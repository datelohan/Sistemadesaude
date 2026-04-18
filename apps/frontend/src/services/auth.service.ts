import { api } from '../lib/api.js'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface ProfileClaim {
  role: 'ADMIN' | 'CLIENT' | 'SUPPLIER'
  clientId?: string
  supplierId?: string
}

export interface TokenPayload {
  sub: string
  name: string
  profiles: ProfileClaim[]
}

export function parseJwt(token: string): TokenPayload {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64)) as TokenPayload
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/login', { email, password })
  return data
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/refresh', { refreshToken })
  return data
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken })
}
