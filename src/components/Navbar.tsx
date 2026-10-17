import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'
import { formatDuration } from '../lib/jwt'
import {
  Shield,
  LayoutDashboard,
  User,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Clock,
  RefreshCw,
  Menu,
  X,
  LogIn,
  UserPlus,
} from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, user, logout, remainingSeconds, refreshToken } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleLogout = () => {
    logout('Logged out successfully.')
    navigate('/login')
  }

  const handleQuickRefresh = async () => {
    setIsRefreshing(true)
    await refreshToken()
    setIsRefreshing(false)
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 dark:bg-indigo-600'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/30 transition group-hover:scale-105">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-900 dark:text-white">
              <span>AuthGuard</span>
              <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                JWT
              </span>
            </div>
            <span className="hidden text-[10px] text-slate-400 sm:inline-block">Client Route Architecture</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                <User className="h-3.5 w-3.5" />
                Profile
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink to="/admin" className={navLinkClass}>
                  <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                  Admin
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                <LogIn className="h-3.5 w-3.5" />
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                <UserPlus className="h-3.5 w-3.5" />
                Register
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Section: Session Countdown + Theme Toggle + User Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live Session Timer Badge when logged in */}
          {isAuthenticated && (
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs lg:flex dark:border-slate-800 dark:bg-slate-900">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-slate-500 dark:text-slate-400">Exp:</span>
              <span className={`font-mono font-bold ${remainingSeconds < 300 ? 'text-amber-500 animate-pulse' : 'text-slate-700 dark:text-slate-200'}`}>
                {formatDuration(remainingSeconds)}
              </span>
              <button
                onClick={handleQuickRefresh}
                disabled={isRefreshing}
                className="ml-1 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                title="Refresh token (extend 1h)"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Profile / Logout or Login button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 pr-3 sm:flex dark:border-slate-800 dark:bg-slate-900">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="h-7 w-7 rounded-lg object-cover"
                />
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                    {user.name.split(' ')[0]}
                  </div>
                  <span
                    className={`inline-block rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/60"
                title="Sign out of active session"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 md:hidden dark:border-slate-800 dark:text-slate-300"
            aria-label="Open Navigation Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white p-4 shadow-lg md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass}
                >
                  <User className="h-4 w-4" />
                  Profile
                </NavLink>
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className={navLinkClass}
                  >
                    <ShieldCheck className="h-4 w-4 text-purple-400" />
                    Admin
                  </NavLink>
                )}
                <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Logged in as: <b className="text-slate-800 dark:text-slate-200">{user?.name}</b></span>
                    <span className="font-mono text-indigo-500">{formatDuration(remainingSeconds)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      handleLogout()
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass}
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}