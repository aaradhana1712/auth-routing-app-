import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from './auth-context'
import { decodeToken, isTokenExpired, getRemainingSeconds, type Role } from '../lib/jwt'
import {
  loginApi,
  registerApi,
  refreshTokenApi,
  getUsers,
  updateUserRole,
  deleteUser,
  resetMockDatabase,
  getAuditLogs,
  addAuditLog,
  type StoredUser,
  type AuditLog,
} from '../services/authApi'
import { useToast } from './ToastContext'

const LOCAL_KEY = 'auth_token'
const SESSION_KEY = 'session_auth_token'
const REMEMBER_KEY = 'auth_remember_me'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast()

  // Retrieve initial token checking localStorage then sessionStorage
  const [token, setToken] = useState<string | null>(() => {
    const isRemembered = localStorage.getItem(REMEMBER_KEY) !== 'false'
    const saved = isRemembered
      ? localStorage.getItem(LOCAL_KEY)
      : sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(LOCAL_KEY)

    if (saved && !isTokenExpired(saved)) {
      return saved
    }
    localStorage.removeItem(LOCAL_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    return null
  })

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    token ? getRemainingSeconds(token) : 0,
  )

  const [users, setUsers] = useState<StoredUser[]>(() => getUsers())
  const [logs, setLogs] = useState<AuditLog[]>(() => getAuditLogs())

  const user = useMemo(() => (token ? decodeToken(token) : null), [token])

  const saveToken = useCallback((newToken: string, remember = true) => {
    localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false')
    if (remember) {
      localStorage.setItem(LOCAL_KEY, newToken)
      sessionStorage.removeItem(SESSION_KEY)
    } else {
      sessionStorage.setItem(SESSION_KEY, newToken)
      localStorage.removeItem(LOCAL_KEY)
    }
    setToken(newToken)
    setRemainingSeconds(getRemainingSeconds(newToken))
  }, [])

  const logout = useCallback(
    (reason?: string) => {
      if (token) {
        const payload = decodeToken(token)
        addAuditLog('LOGOUT', reason || 'User logged out', payload?.email)
      }
      localStorage.removeItem(LOCAL_KEY)
      sessionStorage.removeItem(SESSION_KEY)
      setToken(null)
      setRemainingSeconds(0)

      if (reason) {
        addToast({
          type: 'warning',
          title: 'Session Ended',
          message: reason,
        })
      }
    },
    [token, addToast],
  )

  const login = useCallback(
    async (email: string, password: string, rememberMe = true) => {
      const { token: newToken, user: authenticatedUser } = await loginApi(email, password)
      saveToken(newToken, rememberMe)
      setUsers(getUsers())
      setLogs(getAuditLogs())
      addToast({
        type: 'success',
        title: `Welcome, ${authenticatedUser.name}!`,
        message: `Authenticated as ${authenticatedUser.role.toUpperCase()}`,
      })
    },
    [saveToken, addToast],
  )

  const register = useCallback(
    async (name: string, email: string, password: string, role: Role = 'user') => {
      const { token: newToken, user: registeredUser } = await registerApi(name, email, password, role)
      saveToken(newToken, true)
      setUsers(getUsers())
      setLogs(getAuditLogs())
      addToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome aboard, ${registeredUser.name}!`,
      })
    },
    [saveToken, addToast],
  )

  const refreshToken = useCallback(async () => {
    if (!user) return
    try {
      const { token: renewed } = await refreshTokenApi(user.email, user.role)
      const isRemembered = localStorage.getItem(REMEMBER_KEY) !== 'false'
      saveToken(renewed, isRemembered)
      setLogs(getAuditLogs())
      addToast({
        type: 'info',
        title: 'Session Extended',
        message: 'Your JWT has been renewed for another 1 hour.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Renewal Failed',
        message: 'Unable to refresh session token.',
      })
    }
  }, [user, saveToken, addToast])

  const toggleUserRoleHandler = useCallback(
    (userId: string, newRole: Role) => {
      const updated = updateUserRole(userId, newRole)
      setUsers(updated)
      setLogs(getAuditLogs())
      addToast({
        type: 'info',
        title: 'Role Updated',
        message: `User permissions shifted to ${newRole}`,
      })
    },
    [addToast],
  )

  const deleteUserHandler = useCallback(
    (userId: string) => {
      const updated = deleteUser(userId)
      setUsers(updated)
      setLogs(getAuditLogs())
      addToast({
        type: 'warning',
        title: 'User Deleted',
        message: 'Account removed from mock database',
      })
    },
    [addToast],
  )

  const resetMockDbHandler = useCallback(() => {
    const seeded = resetMockDatabase()
    setUsers(seeded)
    setLogs(getAuditLogs())
    addToast({
      type: 'info',
      title: 'Database Reset',
      message: 'Restored default admin and user mock records',
    })
  }, [addToast])

  const refreshLogs = useCallback(() => {
    setLogs(getAuditLogs())
  }, [])

  // Live session timer & automatic auto-logout handler
  useEffect(() => {
    if (!token) return

    const interval = setInterval(() => {
      const remaining = getRemainingSeconds(token)
      setRemainingSeconds(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        logout('Your JWT session has expired. Please sign in again.')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [token, logout])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user,
      remainingSeconds,
      login,
      register,
      logout,
      refreshToken,
      toggleUserRole: toggleUserRoleHandler,
      deleteUserAccount: deleteUserHandler,
      resetMockDb: resetMockDbHandler,
      users,
      logs,
      refreshLogs,
    }),
    [
      user,
      token,
      remainingSeconds,
      login,
      register,
      logout,
      refreshToken,
      toggleUserRoleHandler,
      deleteUserHandler,
      resetMockDbHandler,
      users,
      logs,
      refreshLogs,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}