import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { formatDuration } from '../lib/jwt'
import {
  Shield,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Database,
} from 'lucide-react'

export default function Profile() {
  const { user, token, remainingSeconds, refreshToken, logout } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleCopy = () => {
    if (!token) return
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshToken()
    setIsRefreshing(false)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Profile Header Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600" />
        <div className="relative px-6 pb-6 sm:px-8">
          <div className="-mt-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex items-end gap-4">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                alt={user?.name}
                className="h-24 w-24 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-lg dark:border-slate-900 dark:bg-slate-800"
              />
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      user?.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Token
              </button>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Claims and Technical Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Decoded Claims Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Verified JWT Payload Claims
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Claims decoded from active client-side token
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span className="text-xs text-slate-500">Subject ID (sub):</span>
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user?.sub}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span className="text-xs text-slate-500">Full Name (name):</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user?.name}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span className="text-xs text-slate-500">Email (email):</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user?.email}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span className="text-xs text-slate-500">Assigned Role (role):</span>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                {user?.role}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span className="text-xs text-slate-500">Issued At (iat):</span>
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                {user?.iat ? new Date(user.iat * 1000).toLocaleString() : 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Expires At (exp):</span>
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                {user?.exp ? new Date(user.exp * 1000).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Persistence & Lifecycle Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              State Persistence Configuration
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Storage synchronization details
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <span className="text-xs text-slate-500">Active Storage:</span>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  localStorage (auth_token)
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <span className="text-xs text-slate-500">Session Status:</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active &amp; Guarded
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Lifespan Remaining:</span>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {formatDuration(remainingSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Raw Token Snippet */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Encoded Token
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 font-mono text-[11px] leading-relaxed break-all rounded-lg bg-slate-50 p-2.5 text-slate-600 dark:bg-slate-950 dark:text-slate-400">
              {token}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}