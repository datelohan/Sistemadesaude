import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token obrigatório'),
})

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token obrigatório'),
})

export type LoginBody = z.infer<typeof loginSchema>
export type RefreshBody = z.infer<typeof refreshSchema>
export type LogoutBody = z.infer<typeof logoutSchema>
