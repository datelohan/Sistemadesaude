import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const selectProfileSchema = z.object({
  profileId: z.string().uuid('ID de perfil inválido'),
})
export type SelectProfileInput = z.infer<typeof selectProfileSchema>

export const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  profileId: z.string().uuid(),
  role: z.enum(['ADMIN', 'CLIENT', 'SUPPLIER']),
  clientId: z.string().uuid().nullable(),
  supplierId: z.string().uuid().nullable(),
})
export type TokenPayload = z.infer<typeof tokenPayloadSchema>
