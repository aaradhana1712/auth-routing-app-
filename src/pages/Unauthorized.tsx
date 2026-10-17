import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react'

export default function Unauthorized() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const requiredRoles = location.state?.requiredRoles as string[] | undefined
  const currentRole = location.state?.currentRole || user?.role || 'user'
  const attemptedPath = location.state?.from?.pathname || '/admin'

  const handleSwitchAccount = () => {
    logout('Switching accounts to test different role permissions.')
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900 dark:shadow-none">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <span className="mt-4 inline-block rounded-full bg-rose-100 px-3 py-1 font-mono text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          403 Forbidden • Access Denied
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Role Guard Authorization Denied
        </h1>

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          The route <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{attemptedPath}</span> is protected by client-side RBAC guards and is not permitted for your current role.
        </p>

        {/* Diagnostic breakdown box */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left text-xs dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-500">Your Current Role:</span>
            <span className="font-mono font-bold uppercase text-rose-600 dark:text-rose-400">
              {currentRole}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500">Required Role(s):</span>
            <span className="font-mono font-bold uppercase text-purple-600 dark:text-purple-400">
              {requiredRoles ? requiredRoles.join(', ') : 'admin'}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
          <button
            onClick={handleSwitchAccount}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LogIn className="h-4 w-4" />
            Sign in as Admin
          </button>
        </div>
      </div>
    </div>
  )
}