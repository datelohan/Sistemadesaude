import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  parseJwt,
  login as apiLogin,
  logout as apiLogout,
  refresh as apiRefresh,
} from '../services/auth.service.js'
import type { ProfileClaim, TokenPayload } from '../services/auth.service.js'

interface AuthState {
  user: TokenPayload | null
  selectedProfile: ProfileClaim | null
  accessToken: string | null
}

interface AuthContextValue extends AuthState {
  login(email: string, password: string): Promise<void>
  logout(): Promise<void>
  selectProfile(profile: ProfileClaim): void
  refreshToken(): Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY_REFRESH = 'smeds.rt'
const STORAGE_KEY_ACCESS = 'smeds.at'

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedAccess = localStorage.getItem(STORAGE_KEY_ACCESS)
  const initialUser = storedAccess ? parseJwt(storedAccess) : null

  const [state, setState] = useState<AuthState>({
    user: initialUser,
    selectedProfile: initialUser?.profiles[0] ?? null,
    accessToken: storedAccess,
  })

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await apiLogin(email, password)
    const user = parseJwt(tokens.accessToken)
    localStorage.setItem(STORAGE_KEY_ACCESS, tokens.accessToken)
    localStorage.setItem(STORAGE_KEY_REFRESH, tokens.refreshToken)
    setState({
      user,
      selectedProfile: user.profiles.length === 1 ? user.profiles[0] : null,
      accessToken: tokens.accessToken,
    })
  }, [])

  const logout = useCallback(async () => {
    const rt = localStorage.getItem(STORAGE_KEY_REFRESH)
    if (rt) {
      try {
        await apiLogout(rt)
      } catch {
        /* ignora */
      }
    }
    localStorage.removeItem(STORAGE_KEY_ACCESS)
    localStorage.removeItem(STORAGE_KEY_REFRESH)
    setState({ user: null, selectedProfile: null, accessToken: null })
  }, [])

  const selectProfile = useCallback((profile: ProfileClaim) => {
    setState((s) => ({ ...s, selectedProfile: profile }))
  }, [])

  const refreshToken = useCallback(async () => {
    const rt = localStorage.getItem(STORAGE_KEY_REFRESH)
    if (!rt) throw new Error('Sem refresh token')
    const tokens = await apiRefresh(rt)
    const user = parseJwt(tokens.accessToken)
    localStorage.setItem(STORAGE_KEY_ACCESS, tokens.accessToken)
    localStorage.setItem(STORAGE_KEY_REFRESH, tokens.refreshToken)
    setState((s) => ({ ...s, user, accessToken: tokens.accessToken }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, selectProfile, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
