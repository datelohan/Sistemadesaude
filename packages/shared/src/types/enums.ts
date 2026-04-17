export const Role = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  SUPPLIER: 'SUPPLIER',
} as const
export type Role = (typeof Role)[keyof typeof Role]

export const BudgetType = {
  REGULAR: 'REGULAR',
  EMERGENCY: 'EMERGENCY',
  JUDICIAL: 'JUDICIAL',
} as const
export type BudgetType = (typeof BudgetType)[keyof typeof BudgetType]

export const BudgetStatus = {
  OPEN: 'OPEN',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  CANCELLED: 'CANCELLED',
  CLOSED: 'CLOSED',
} as const
export type BudgetStatus = (typeof BudgetStatus)[keyof typeof BudgetStatus]

export const QuoteStatus = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  WON: 'WON',
  LOST: 'LOST',
  CANCELLED: 'CANCELLED',
} as const
export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus]

export const ProductCategory = {
  MEDICATION: 'MEDICATION',
  HOSPITAL_SUPPLIES: 'HOSPITAL_SUPPLIES',
  EQUIPMENT_MAINTENANCE: 'EQUIPMENT_MAINTENANCE',
  EQUIPMENT_RENTAL: 'EQUIPMENT_RENTAL',
} as const
export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory]
