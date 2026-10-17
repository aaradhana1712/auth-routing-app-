import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Shield, CheckCircle, XCircle, ArrowUpRight, Lock, Unlock, EyeOff } from 'lucide-react'

interface RouteRule {
  path: string
  name: string
  description: string
  guardType: 'Public' | 'Authenticated' | 'Admin Only' | 'Guest Only'
}

const routes: RouteRule[] = [
  {
    path: '/',
    name: 'Home Page',
    description: 'Accessible by anyone without authentication',
    guardType: 'Public',
  },
  {
    path: '/dashboard',
    name: 'User Dashboard',
    description: 'Requires active JWT authentication',
    guardType: 'Authenticated',
  },
  {
    path: '/profile',
    name: 'User Profile',
    description: 'Displays current session claims and token metadata',
    guardType: 'Authenticated',
  },
  {
    path: '/admin',
    name: 'Admin Control Center',
    description: 'Restricted strictly to users with role="admin"',
    guardType: 'Admin Only',
  },
  {
    path: '/login',
    name: 'Login Form',
    description: 'Redirects to /dashboard if already logged in (Guest Guard)',
    guardType: 'Guest Only',
  },
  {
    path: '/register',
    name: 'Register Form',
    description: 'Redirects to /dashboard if already logged in (Guest Guard)',
    guardType: 'Guest Only',
  },
  {
    path: '/non-existent-page',
    name: '404 Catch-All',
    description: 'Handles unmatched URLs gracefully with custom 404 view',
    guardType: 'Public',
  },
]

export default function RouteGuardPlayground() {
  const { isAuthenticated, user } = useAuth()

  const checkAccess = (guardType: RouteRule['guardType']) => {
    switch (guardType) {
      case 'Public':
        return { allowed: true, status: 'Allowed', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' }
      case 'Authenticated':
        return isAuthenticated
          ? { allowed: true, status: 'Allowed (Authenticated)', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' }
          : { allowed: false, status: 'Blocked (Redirects to /login)', badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' }
      case 'Admin Only':
        if (!isAuthenticated) {
          return { allowed: false, status: 'Blocked (Redirects to /login)', badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' }
        }
        return user?.role === 'admin'
          ? { allowed: true, status: 'Allowed (Admin Privilege)', badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' }
          : { allowed: false, status: 'Forbidden 403 (Redirects to /unauthorized)', badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' }
      case 'Guest Only':
        return isAuthenticated
          ? { allowed: false, status: 'Bypassed (Redirects to /dashboard)', badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' }
          : { allowed: true, status: 'Allowed (Guest)', badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' }
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Route Guard Matrix & Live Tester
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time evaluation of all route protections based on your current session
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Current Auth Status:</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isAuthenticated
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {isAuthenticated ? (
              <>
                <Unlock className="h-3 w-3" /> Logged In ({user?.role.toUpperCase()})
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" /> Anonymous / Guest
              </>
            )}
          </span>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
        {routes.map((r) => {
          const evalResult = checkAccess(r.guardType)
          return (
            <div
              key={r.path}
              className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {r.path}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {r.name}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {r.guardType}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{r.description}</p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${evalResult.badgeClass}`}
                >
                  {evalResult.allowed ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : r.guardType === 'Guest Only' ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {evalResult.status}
                </span>

                <Link
                  to={r.path}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
                >
                  Test Route
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
