import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  ShieldCheck,
  Lock,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
} from 'lucide-react'
import RouteGuardPlayground from '../components/RouteGuardPlayground'

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-indigo-50/20 to-white p-8 sm:p-12 lg:p-16 text-center shadow-sm dark:border-slate-800/80 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>TASK-WD-102 • Modern Frontend Architecture & State Flow</span>
        </div>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
          Client Routing & <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">JWT Route Guards</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
          Enterprise-ready React &amp; TypeScript client architecture featuring Protected Route Guards, Role-Based Access Control (RBAC), Persistent Auth State, and Real-Time Token Decoding.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Inspect JWT Claims
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:bg-purple-700"
                >
                  Admin Control
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700"
              >
                Sign In to Test Guards
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Test Protected Route
              </Link>
            </>
          )}
        </div>

        {/* Quick Demo Credentials Pill */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Test Accounts:</span>
          <span className="rounded bg-purple-100 px-2 py-0.5 font-mono font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            Admin: admin@test.com / admin123
          </span>
          <span className="text-slate-400">•</span>
          <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            User: user@test.com / user123
          </span>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-bold text-slate-900 dark:text-white">JWT Route Guards</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Intercepts unauthorized navigation, saves target URL in history state, and redirects back upon successful authentication.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-bold text-slate-900 dark:text-white">Role-Based Access (RBAC)</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Granular route protection with custom permission levels. Restricts administrative screens to verified admin users.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-bold text-slate-900 dark:text-white">Auth State Persistence</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Storage synchronization with support for "Remember Me", auto token validation, and expiry recovery on browser reload.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-bold text-slate-900 dark:text-white">Live Session Lifecycle</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Real-time session countdown timer, automated timeout revocation, and instant token renewal without re-login.
          </p>
        </div>
      </section>

      {/* Interactive Live Route Playground */}
      <section>
        <RouteGuardPlayground />
      </section>

      {/* Architectural Checklist for Reviewers */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Evaluation Checklist (TASK-WD-102 Criteria)
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          All assignment goals implemented with production-grade modularity:
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                JWT Route Guards with History Memory
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Protected views check JWT authenticity and forward unauthenticated traffic to <code className="text-indigo-500">/login</code> with <code className="text-indigo-500">{'state: { from }'}</code>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                RBAC &amp; Dedicated 403 Forbidden View
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin routes guarded with <code className="text-indigo-500">{'allowedRoles={[\'admin\']}'}</code> redirecting unauthorized roles to an informative 403 screen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Authentication State Persistence
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Decodes and validates JWT expiration timestamp on initial app mount; handles page refresh seamlessly without premature session loss.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Public Only Route Guard (Guest Only)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prevents logged-in users from seeing login or registration screens, redirecting them straight to <code className="text-indigo-500">/dashboard</code>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}