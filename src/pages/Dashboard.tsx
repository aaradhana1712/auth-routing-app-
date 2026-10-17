import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { formatDuration } from '../lib/jwt'
import JwtInspector from '../components/JwtInspector'
import RouteGuardPlayground from '../components/RouteGuardPlayground'
import InterceptorDemo from '../components/InterceptorDemo'
import {
  Shield,
  ShieldCheck,
  Clock,
  KeyRound,
  User,
  Activity,
  RefreshCw,
  History,
  Zap,
} from 'lucide-react'

export default function Dashboard() {
  const { user, remainingSeconds, refreshToken, logs } = useAuth()
  const [activeTab, setActiveTab] = useState<'inspector' | 'routes' | 'interceptor' | 'logs'>('inspector')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshToken()
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl dark:border-slate-800">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
              alt={user?.name}
              className="h-16 w-16 rounded-2xl border-2 border-indigo-400/40 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl">Welcome, {user?.name}!</h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    user?.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
              <p className="mt-1 text-xs text-indigo-200/80">
                Logged in via <span className="font-mono text-white">{user?.email}</span> • Client session is active and persisted
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Extend Session (+1h)
            </button>
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-400"
            >
              <User className="h-4 w-4" />
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Token Expiry Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Session Remaining</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {formatDuration(remainingSeconds)}
          </div>
          <span className="mt-1 inline-block text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Auto-refreshable • Local Storage
          </span>
        </div>

        {/* Current Role */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">RBAC Role</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white capitalize">
            {user?.role}
          </div>
          <span className="mt-1 inline-block text-[11px] text-slate-500 dark:text-slate-400">
            {user?.role === 'admin' ? 'Unrestricted admin authorization' : 'Standard user permissions'}
          </span>
        </div>

        {/* Guard Clearance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Admin Route Access</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {user?.role === 'admin' ? 'Granted' : 'Restricted'}
          </div>
          <span className="mt-1 inline-block text-[11px] text-slate-500 dark:text-slate-400">
            {user?.role === 'admin' ? 'Has /admin clearance' : 'Blocked by ProtectedRoute RBAC'}
          </span>
        </div>

        {/* Cryptographic Spec */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">JWT Format</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <KeyRound className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            HS256
          </div>
          <span className="mt-1 inline-block text-[11px] text-slate-500 dark:text-slate-400">
            Base64URL Header.Payload.Sig
          </span>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === 'inspector'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <KeyRound className="h-4 w-4" />
            Live JWT Inspector &amp; Claims
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === 'routes'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Route Guard Matrix
          </button>

          <button
            onClick={() => setActiveTab('interceptor')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === 'interceptor'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="h-4 w-4" />
            Axios / Fetch Interceptors
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === 'logs'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <History className="h-4 w-4" />
            Session Audit Logs
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'inspector' && <JwtInspector />}
        {activeTab === 'routes' && <RouteGuardPlayground />}
        {activeTab === 'interceptor' && <InterceptorDemo />}
        {activeTab === 'logs' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Activity className="h-4 w-4 text-indigo-500" />
              Security &amp; Routing Event Logs
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Audit trails generated dynamically as you navigate and interact with route guards
            </p>

            <div className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {logs.slice(0, 8).map((log) => (
                <div key={log.id} className="flex flex-col gap-1 p-3.5 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        log.event === 'ROLE_GUARD_BLOCKED'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : log.event === 'LOGIN_SUCCESS'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {log.event}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200">{log.details}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}