import { createMockToken, type Role } from '../lib/jwt'

export interface StoredUser {
  id: string
  name: string
  email: string
  password: string
  role: Role
  avatar?: string
  createdAt: string
}

export interface AuditLog {
  id: string
  timestamp: string
  event: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'REGISTER' | 'LOGOUT' | 'TOKEN_REFRESH' | 'ROLE_GUARD_BLOCKED' | 'ROLE_UPDATED'
  userEmail?: string
  details: string
}

const USERS_KEY = 'mock_users_v2'
const AUDIT_LOGS_KEY = 'mock_audit_logs'

const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'user-admin-1',
    name: 'Aaradhana (Admin)',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'user-standard-2',
    name: 'Alex Johnson',
    email: 'user@test.com',
    password: 'user123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
]

export function getUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      // fallback
    }
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS))
  return DEFAULT_USERS
}

export function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getAuditLogs(): AuditLog[] {
  const raw = localStorage.getItem(AUDIT_LOGS_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      // fallback
    }
  }
  return [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      event: 'LOGIN_SUCCESS',
      userEmail: 'admin@test.com',
      details: 'Admin user authenticated with JWT issued for 3600s',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      event: 'ROLE_GUARD_BLOCKED',
      userEmail: 'user@test.com',
      details: 'Route /admin blocked by ProtectedRoute role guard',
    },
  ]
}

export function addAuditLog(event: AuditLog['event'], details: string, userEmail?: string): void {
  const logs = getAuditLogs()
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    event,
    userEmail,
    details,
  }
  const updated = [newLog, ...logs].slice(0, 50)
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated))
}

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

function issueToken(u: StoredUser, expiresInSeconds = 3600): string {
  const now = Math.floor(Date.now() / 1000)
  return createMockToken({
    sub: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    iat: now,
    exp: now + expiresInSeconds,
  })
}

export async function loginApi(email: string, password: string, expiresInSeconds = 3600): Promise<{ token: string; user: StoredUser }> {
  await delay()
  const users = getUsers()
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  )

  if (!user) {
    addAuditLog('LOGIN_FAILURE', `Failed attempt for ${email}`, email)
    throw new Error('Invalid email or password')
  }

  const token = issueToken(user, expiresInSeconds)
  addAuditLog('LOGIN_SUCCESS', `User signed in successfully (Role: ${user.role})`, user.email)
  return { token, user }
}

export async function registerApi(name: string, email: string, password: string, role: Role = 'user'): Promise<{ token: string; user: StoredUser }> {
  await delay()
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email address already exists')
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])
  const token = issueToken(newUser)
  addAuditLog('REGISTER', `New user registered: ${name} (${role})`, newUser.email)
  return { token, user: newUser }
}

export async function refreshTokenApi(email: string, role: Role): Promise<{ token: string }> {
  await delay(250)
  const users = getUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
    id: `usr-${Date.now()}`,
    name: email.split('@')[0],
    email,
    password: '',
    role,
    createdAt: new Date().toISOString(),
  }

  const token = issueToken(user, 3600)
  addAuditLog('TOKEN_REFRESH', 'JWT token expiration extended by 1 hour', email)
  return { token }
}

export function updateUserRole(userId: string, newRole: Role): StoredUser[] {
  const users = getUsers()
  const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
  saveUsers(updated)
  const target = updated.find((u) => u.id === userId)
  if (target) {
    addAuditLog('ROLE_UPDATED', `Role changed to ${newRole} for ${target.email}`, target.email)
  }
  return updated
}

export function deleteUser(userId: string): StoredUser[] {
  const users = getUsers()
  const target = users.find((u) => u.id === userId)
  const updated = users.filter((u) => u.id !== userId)
  saveUsers(updated)
  if (target) {
    addAuditLog('ROLE_UPDATED', `User deleted: ${target.email}`)
  }
  return updated
}

export function resetMockDatabase(): StoredUser[] {
  localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS))
  localStorage.removeItem(AUDIT_LOGS_KEY)
  addAuditLog('LOGIN_SUCCESS', 'Mock database reset to defaults')
  return DEFAULT_USERS
}