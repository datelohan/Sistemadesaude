import type { Role } from '@prisma/client'

export interface TokenPayload {
  sub: string
  name: string
  profiles: ProfileClaim[]
}

export interface ProfileClaim {
  role: Role
  clientId?: string
  supplierId?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginInput {
  email: string
  password: string
}
