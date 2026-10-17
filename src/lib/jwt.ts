export type Role = 'admin' | 'user'

export interface JwtPayload {
  sub: string
  name: string
  email: string
  role: Role
  avatar?: string
  iat: number
  exp: number
}

export interface DecodedJwtParts {
  header: { alg: string; typ: string }
  payload: JwtPayload
  signature: string
  rawHeader: string
  rawPayload: string
  rawSignature: string
}

const encode = (obj: object) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

const decode = (str: string) => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return decodeURIComponent(escape(atob(padded)))
}

export function createMockToken(payload: JwtPayload): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const rawHeader = encode(header)
  const rawPayload = encode(payload)
  // create deterministic mock signature based on header + payload
  const rawSignature = `sig_${btoa(rawHeader + '.' + rawPayload).substring(0, 16)}`
  return `${rawHeader}.${rawPayload}.${rawSignature}`
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    return JSON.parse(decode(parts[1])) as JwtPayload
  } catch {
    return null
  }
}

export function parseJwtParts(token: string): DecodedJwtParts | null {
  try {
    const parts = token.split('.')
    if (parts.length < 3) return null

    const header = JSON.parse(decode(parts[0]))
    const payload = JSON.parse(decode(parts[1])) as JwtPayload
    return {
      header,
      payload,
      signature: parts[2],
      rawHeader: parts[0],
      rawPayload: parts[1],
      rawSignature: parts[2],
    }
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) return true
  return payload.exp * 1000 <= Date.now()
}

export function getRemainingSeconds(token: string): number {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) return 0
  const remaining = Math.floor((payload.exp * 1000 - Date.now()) / 1000)
  return remaining > 0 ? remaining : 0
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  const h = Math.floor(m / 60)
  if (h > 0) {
    const remM = m % 60
    return `${h}h ${remM.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}