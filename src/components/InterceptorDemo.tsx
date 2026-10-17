import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { simulateInterceptorCall, type InterceptorDemoResult } from '../services/apiClient'
import { Send, CheckCircle2, XCircle, Code, ShieldCheck, Zap } from 'lucide-react'

export default function InterceptorDemo() {
  const { token, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InterceptorDemoResult | null>(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/protected/user-data')
  const [showCode, setShowCode] = useState(false)

  const handleSendRequest = async () => {
    setLoading(true)
    try {
      const res = await simulateInterceptorCall(selectedEndpoint)
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 dark:border-emerald-500/10 dark:bg-emerald-500/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Axios &amp; Fetch Interceptor Simulator
                </h3>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Automated Header Injection
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect how client requests automatically attach <strong className="font-mono">Authorization: Bearer &lt;token&gt;</strong> headers.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Code className="h-4 w-4" />
            {showCode ? 'Hide Code' : 'View Interceptor Code'}
          </button>
        </div>
      </div>

      {/* Code Toggle Drawer */}
      {showCode && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-5 font-mono text-xs text-slate-200 shadow-md dark:border-slate-800">
          <div className="flex items-center justify-between pb-3 text-slate-400">
            <span>src/services/apiClient.ts (Axios Request Interceptor)</span>
            <span className="text-[10px] text-emerald-400 font-bold">Active in app</span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-indigo-300">
{`// 1. Automatic Bearer Header Injection
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('session_auth_token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})

// 2. Global 401 Unauthorized Interception
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)`}
          </pre>
        </div>
      )}

      {/* Interactive Playground */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Test Outgoing API Call
          </h4>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Select a protected backend endpoint to simulate sending an HTTP request through the client interceptor.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500">API Endpoint</label>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="/api/v1/protected/user-data">GET /api/v1/protected/user-data</option>
                <option value="/api/v1/admin/audit-export">GET /api/v1/admin/audit-export</option>
                <option value="/api/v1/billing/invoices">GET /api/v1/billing/invoices</option>
              </select>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Auth Status:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {isAuthenticated ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" /> Authenticated
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400">Unauthenticated</span>
                  )}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-700/60">
                <span className="text-slate-500">Token Available:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {token ? 'Yes (Bearer Token)' : 'No (None)'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className={`h-3.5 w-3.5 ${loading ? 'animate-pulse' : ''}`} />
              {loading ? 'Intercepting & Sending...' : 'Execute Request via Interceptor'}
            </button>
          </div>
        </div>

        {/* Live Inspector Results */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Interceptor Live Output
          </h4>

          {result ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  {result.status === 200 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-500" />
                  )}
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    HTTP {result.status}
                  </span>
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono dark:bg-slate-700">
                    {result.method} {result.url}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Injected Header Card */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-xs dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <span className="font-bold text-indigo-700 dark:text-indigo-300">
                  Injected HTTP Request Headers:
                </span>
                <div className="mt-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <div>Content-Type: application/json</div>
                  <div className="mt-1 font-semibold text-indigo-600 dark:text-indigo-400">
                    Authorization: {result.authHeader || '<None - Interceptor injected no token>'}
                  </div>
                </div>
              </div>

              {/* Response Body */}
              <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-emerald-400 shadow-inner">
                <div className="text-[10px] text-slate-400 mb-1">Response Body:</div>
                <pre className="overflow-x-auto">
                  {JSON.stringify(result.simulatedResponse, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center py-8 text-center text-slate-400">
              <Zap className="h-8 w-8 stroke-1 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 text-xs">
                Click &quot;Execute Request via Interceptor&quot; to inspect the outgoing Authorization header.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
