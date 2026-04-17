import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  phone: z.string().optional(),
})
export type CreateUserInput = z.infer<typeof createUserSchema>
