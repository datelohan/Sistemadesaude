import { z } from 'zod'

export const submitQuoteSchema = z.object({
  budgetId: z.string().uuid('Orçamento inválido'),
  items: z
    .array(
      z.object({
        budgetItemId: z.string().uuid('Item inválido'),
        unitPrice: z.number().positive('Preço unitário deve ser positivo'),
      }),
    )
    .min(1, 'Cotação deve ter ao menos 1 item'),
})
export type SubmitQuoteInput = z.infer<typeof submitQuoteSchema>
