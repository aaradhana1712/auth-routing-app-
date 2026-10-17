import { Outlet, Link } from 'react-router-dom'
import Navbar from './Navbar'
import { Shield, GitBranch, ExternalLink } from 'lucide-react'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#0b0f19] dark:text-slate-100">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/80 bg-white/50 py-6 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              TASK-WD-102: Authentication & Client Routing
            </span>
            <span>• Week 1 Architecture</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Dashboard
            </Link>
            <Link to="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Admin Area
            </Link>
            <a
              href="https://jwt.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              JWT.io Spec <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/aaradhana1712/ui-library.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <GitBranch className="h-3 w-3" /> Task 1 Repo
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}