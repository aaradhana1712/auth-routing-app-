import { Link, useLocation } from 'react-router-dom'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const location = useLocation()

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <FileQuestion className="h-8 w-8" />
        </div>

        <span className="mt-4 inline-block font-mono text-4xl font-extrabold text-slate-800 dark:text-slate-100">
          404
        </span>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Route Not Found
        </h1>

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          The requested URL path <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-800 dark:bg-slate-800 dark:text-slate-200">{location.pathname}</code> does not match any registered routes in the React Router route tree.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}