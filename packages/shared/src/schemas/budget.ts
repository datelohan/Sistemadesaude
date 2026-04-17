import { z } from 'zod'

export const createBudgetSchema = z.object({
  contractId: z.string().uuid('Contrato inválido'),
  type: z.enum(['REGULAR', 'EMERGENCY', 'JUDICIAL']),
  deadline: z.string().datetime('Data prazo inválida'),
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Produto inválido'),
        quantity: z.number().int().positive('Quantidade deve ser positiva'),
      }),
    )
    .min(1, 'Orçamento deve ter ao menos 1 item'),
})
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>
