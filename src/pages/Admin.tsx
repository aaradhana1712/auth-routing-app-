import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  Users,
  ShieldCheck,
  UserCheck,
  Trash2,
  RotateCcw,
  Activity,
  Search,
} from 'lucide-react'

export default function Admin() {
  const { users, toggleUserRole, deleteUserAccount, resetMockDb, logs } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const adminCount = users.filter((u) => u.role === 'admin').length
  const userCount = users.filter((u) => u.role === 'user').length

  return (
    <div className="space-y-8">
      {/* Admin Banner */}
      <div className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl dark:border-purple-900/50">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-400/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              Role Guard: Protected View (Allowed Roles: [&quot;admin&quot;])
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Admin Control Center</h1>
            <p className="mt-1 text-xs text-purple-200/80">
              This screen is strictly accessible to authenticated sessions with verified <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-purple-200">admin</code> role in JWT claims.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset mock database to initial state?')) {
                resetMockDb()
              }
            }}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Mock Database
          </button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Accounts</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{users.length}</div>
          <span className="text-[11px] text-slate-500">Registered in mock database</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Administrators</span>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{adminCount}</div>
          <span className="text-[11px] text-purple-600/80">Hold full permission bypass</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Standard Users</span>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{userCount}</div>
          <span className="text-[11px] text-emerald-600/80">Guarded from /admin path</span>
        </div>
      </div>

      {/* User Management Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              User Role Management &amp; Access Control
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Promote or demote users to immediately test client-side RBAC guards
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3.5 font-semibold">User</th>
                <th className="px-6 py-3.5 font-semibold">Email</th>
                <th className="px-6 py-3.5 font-semibold">Current Role</th>
                <th className="px-6 py-3.5 font-semibold">Registered</th>
                <th className="px-6 py-3.5 text-right font-semibold">Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                        alt={u.name}
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {u.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        title="Toggle role between user and admin"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>

                      {users.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete account for ${u.email}?`)) {
                              deleteUserAccount(u.id)
                            }
                          }}
                          className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Activity className="h-4 w-4 text-purple-500" />
          Security Audit Trails &amp; Guard Interceptions
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Complete log of authentication lifecycle and RBAC enforcement events
        </p>

        <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {logs.slice(0, 10).map((log) => (
            <div key={log.id} className="flex flex-col gap-1 p-3.5 text-xs sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    log.event === 'ROLE_GUARD_BLOCKED'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : log.event === 'ROLE_UPDATED'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : log.event === 'LOGIN_SUCCESS'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}
                >
                  {log.event}
                </span>
                <span className="text-slate-800 dark:text-slate-200">{log.details}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}