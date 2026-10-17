import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../lib/jwt'
import { addAuditLog } from '../services/authApi'

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  // 1. Guard against unauthenticated visitors
  if (!isAuthenticated) {
    const redirectUrl = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`
    return <Navigate to={redirectUrl} replace state={{ from: location }} />
  }

  // 2. Role-Based Access Control (RBAC) guard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    addAuditLog(
      'ROLE_GUARD_BLOCKED',
      `Denied access to ${location.pathname}. Required: [${allowedRoles.join(', ')}], Current: [${user.role}]`,
      user.email,
    )
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          from: location,
          requiredRoles: allowedRoles,
          currentRole: user.role,
        }}
      />
    )
  }

  return <Outlet />
}