import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { parseJwtParts, formatDuration } from '../lib/jwt'
import { KeyRound, Copy, Check, Clock, ShieldCheck, RefreshCw } from 'lucide-react'

export default function JwtInspector() {
  const { token, remainingSeconds, refreshToken } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  if (!token) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
        <KeyRound className="mx-auto h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          No active JWT token found in session. Please log in to inspect token claims.
        </p>
      </div>
    )
  }

  const parts = parseJwtParts(token)

  const handleCopy = () => {
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-5 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-purple-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white">Active JWT Session Token</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Valid & Cryptographically Encoded
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Persisted in browser storage and validated on every client route navigation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
            <Clock className="h-3.5 w-3.5 text-indigo-500" />
            Expires in: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{formatDuration(remainingSeconds)}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            title="Extend token expiration by 1 hour"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Extend Token
          </button>
        </div>
      </div>

      {/* Raw Token String with Color Coded Segments */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Raw Encoded JWT (Header . Payload . Signature)
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy String
              </>
            )}
          </button>
        </div>

        {parts ? (
          <div className="break-all rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed">
            <span className="text-rose-400 selection:bg-rose-900">{parts.rawHeader}</span>
            <span className="text-slate-500">.</span>
            <span className="text-violet-400 selection:bg-violet-900">{parts.rawPayload}</span>
            <span className="text-slate-500">.</span>
            <span className="text-cyan-400 selection:bg-cyan-900">{parts.rawSignature}</span>
          </div>
        ) : (
          <div className="break-all rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-300">
            {token}
          </div>
        )}
      </div>

      {/* Decoded Inspection Grid */}
      {parts && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Header Card */}
          <div className="rounded-2xl border border-rose-200/60 bg-rose-50/20 p-5 dark:border-rose-900/40 dark:bg-rose-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                1. Header
              </span>
              <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                Algorithm & Token Type
              </span>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-white p-3 font-mono text-xs text-slate-800 shadow-inner dark:bg-slate-950 dark:text-rose-200">
              {JSON.stringify(parts.header, null, 2)}
            </pre>
          </div>

          {/* Payload Card */}
          <div className="rounded-2xl border border-violet-200/60 bg-violet-50/20 p-5 dark:border-violet-900/40 dark:bg-violet-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                2. Payload (Claims)
              </span>
              <span className="rounded bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                Identity & Permissions
              </span>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-white p-3 font-mono text-xs text-slate-800 shadow-inner dark:bg-slate-950 dark:text-violet-200">
              {JSON.stringify(
                {
                  ...parts.payload,
                  iat_formatted: new Date(parts.payload.iat * 1000).toLocaleTimeString(),
                  exp_formatted: new Date(parts.payload.exp * 1000).toLocaleTimeString(),
                },
                null,
                2,
              )}
            </pre>
          </div>

          {/* Signature Card */}
          <div className="rounded-2xl border border-cyan-200/60 bg-cyan-50/20 p-5 dark:border-cyan-900/40 dark:bg-cyan-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                3. Signature
              </span>
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                HMAC-SHA256 Mock
              </span>
            </div>
            <div className="mt-3 rounded-xl bg-white p-3 font-mono text-xs text-slate-700 shadow-inner dark:bg-slate-950 dark:text-cyan-200">
              <div className="text-slate-500 dark:text-slate-400">HMACSHA256(</div>
              <div className="pl-3 text-rose-500">base64UrlEncode(header) + &quot;.&quot;</div>
              <div className="pl-3 text-violet-500">base64UrlEncode(payload),</div>
              <div className="pl-3 text-slate-500">secret</div>
              <div className="text-slate-500">) ➔ <span className="font-bold text-cyan-500">{parts.signature}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
