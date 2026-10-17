import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { addAuditLog } from './authApi'

const LOCAL_KEY = 'auth_token'
const SESSION_KEY = 'session_auth_token'

/**
 * Returns the currently persisted JWT token from either localStorage or sessionStorage
 */
export function getActiveToken(): string | null {
  return localStorage.getItem(LOCAL_KEY) || sessionStorage.getItem(SESSION_KEY) || null
}

/**
 * Production-ready Axios instance configured with Request and Response Interceptors.
 * Automatically injects "Authorization: Bearer <token>" into outgoing HTTP requests.
 */
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── 1. REQUEST INTERCEPTOR ──────────────────────────────────────────────────
// Automatically injects Authorization: Bearer <jwt> on every outgoing request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getActiveToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// ─── 2. RESPONSE INTERCEPTOR ─────────────────────────────────────────────────
// Intercepts 401 Unauthorized errors to trigger session renewal or auto-logout
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      addAuditLog('ROLE_GUARD_BLOCKED', 'HTTP 401 intercepted: Invalid or expired JWT token')
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

/**
 * Standard Fetch Interceptor wrapper as an alternative to Axios.
 * Injects Authorization header and handles 401 status codes.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getActiveToken()
  const headers = new Headers(options.headers || {})

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    addAuditLog('ROLE_GUARD_BLOCKED', `Fetch 401 intercepted for ${url}`)
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
  }

  return response
}

export interface InterceptorDemoResult {
  url: string
  method: string
  hasToken: boolean
  authHeader: string | null
  timestamp: string
  status: number
  simulatedResponse: Record<string, unknown>
}

/**
 * Demonstrates the Axios / Fetch interceptor in real-time for evaluation
 */
export async function simulateInterceptorCall(endpoint = '/api/v1/protected/user-data'): Promise<InterceptorDemoResult> {
  const token = getActiveToken()
  const authHeader = token ? `Bearer ${token.substring(0, 18)}...${token.substring(token.length - 10)}` : null

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 350))

  if (!token) {
    addAuditLog('ROLE_GUARD_BLOCKED', `Interceptor blocked unauthenticated call to ${endpoint}`)
    return {
      url: endpoint,
      method: 'GET',
      hasToken: false,
      authHeader: null,
      timestamp: new Date().toISOString(),
      status: 401,
      simulatedResponse: {
        error: 'Unauthorized',
        message: 'No Bearer token found in Authorization header. Interceptor rejected request.',
      },
    }
  }

  addAuditLog('TOKEN_REFRESH', `Axios Interceptor successfully injected Bearer token to ${endpoint}`)
  return {
    url: endpoint,
    method: 'GET',
    hasToken: true,
    authHeader,
    timestamp: new Date().toISOString(),
    status: 200,
    simulatedResponse: {
      message: 'Access Granted: Authenticated response retrieved via JWT Interceptor',
      endpoint,
      authorizedAt: new Date().toISOString(),
    },
  }
}
