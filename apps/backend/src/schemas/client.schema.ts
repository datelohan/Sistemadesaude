import { z } from 'zod'

const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
const STATE_REGEX = /^[A-Z]{2}$/
const CEP_REGEX = /^\d{5}-\d{3}$/

export const createClientSchema = z.object({
  cnpj: z.string().regex(CNPJ_REGEX, 'CNPJ inválido (formato: XX.XXX.XXX/XXXX-XX)'),
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(200),
  municipality: z.string().min(2, 'Município inválido').max(100),
  state: z.string().regex(STATE_REGEX, 'Estado inválido (ex: SP)'),
  zipCode: z.string().regex(CEP_REGEX, 'CEP inválido (formato: XXXXX-XXX)').optional(),
  address: z.string().max(300).optional(),
})

export const updateClientSchema = createClientSchema.partial()

export const listClientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  state: z.string().regex(STATE_REGEX).optional(),
  active: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
})

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>
