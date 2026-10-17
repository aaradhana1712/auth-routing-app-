import { useToast, type ToastType } from '../context/ToastContext'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

const icons: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colors: Record<ToastType, { border: string; bg: string; text: string; icon: string }> = {
  success: {
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    bg: 'bg-emerald-50/95 dark:bg-emerald-950/80',
    text: 'text-emerald-900 dark:text-emerald-100',
    icon: 'text-emerald-500',
  },
  error: {
    border: 'border-rose-500/30 dark:border-rose-500/40',
    bg: 'bg-rose-50/95 dark:bg-rose-950/80',
    text: 'text-rose-900 dark:text-rose-100',
    icon: 'text-rose-500',
  },
  warning: {
    border: 'border-amber-500/30 dark:border-amber-500/40',
    bg: 'bg-amber-50/95 dark:bg-amber-950/80',
    text: 'text-amber-900 dark:text-amber-100',
    icon: 'text-amber-500',
  },
  info: {
    border: 'border-indigo-500/30 dark:border-indigo-500/40',
    bg: 'bg-indigo-50/95 dark:bg-indigo-950/80',
    text: 'text-indigo-900 dark:text-indigo-100',
    icon: 'text-indigo-500',
  },
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2.5">
      {toasts.map((t) => {
        const Icon = icons[t.type]
        const c = colors[t.type]
        return (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${c.border} ${c.bg} ${c.text}`}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${c.icon}`} />
            <div className="flex-1 text-sm">
              <div className="font-semibold">{t.title}</div>
              {t.message && <div className="mt-0.5 text-xs opacity-90">{t.message}</div>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
