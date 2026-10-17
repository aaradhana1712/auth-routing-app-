import { createContext } from 'react'
import type { JwtPayload, Role } from '../lib/jwt'
import type { AuditLog, StoredUser } from '../services/authApi'

export interface AuthContextValue {
  user: JwtPayload | null
  token: string | null
  isAuthenticated: boolean
  remainingSeconds: number
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (name: string, email: string, password: string, role?: Role) => Promise<void>
  logout: (reason?: string) => void
  refreshToken: () => Promise<void>
  toggleUserRole: (userId: string, role: Role) => void
  deleteUserAccount: (userId: string) => void
  resetMockDb: () => void
  users: StoredUser[]
  logs: AuditLog[]
  refreshLogs: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)