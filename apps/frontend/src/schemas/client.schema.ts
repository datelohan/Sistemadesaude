import { z } from 'zod'

const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
const STATE_REGEX = /^[A-Z]{2}$/
const CEP_REGEX = /^\d{5}-\d{3}$/

export const clientFormSchema = z.object({
  cnpj: z.string().regex(CNPJ_REGEX, 'Formato: XX.XXX.XXX/XXXX-XX'),
  name: z.string().min(2, 'Mínimo 2 caracteres').max(200),
  municipality: z.string().min(2, 'Município inválido').max(100),
  state: z.string().regex(STATE_REGEX, 'Selecione um estado'),
  zipCode: z.string().regex(CEP_REGEX, 'Formato: XXXXX-XXX').optional().or(z.literal('')),
  address: z.string().max(300).optional().or(z.literal('')),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>
