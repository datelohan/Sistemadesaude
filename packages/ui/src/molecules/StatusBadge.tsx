import { Badge, type BadgeProps } from '../atoms/Badge.js'

type StatusMap = Record<string, { label: string; variant: BadgeProps['variant'] }>

export interface StatusBadgeProps {
  status: string
  map: StatusMap
}

export function StatusBadge({ status, map }: StatusBadgeProps) {
  const config = map[status] ?? { label: status, variant: 'default' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export const BUDGET_STATUS_MAP: StatusMap = {
  OPEN: { label: 'Aberto', variant: 'info' },
  PENDING_APPROVAL: { label: 'Aguardando aprovação', variant: 'warning' },
  APPROVED: { label: 'Aprovado', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'danger' },
  CLOSED: { label: 'Encerrado', variant: 'default' },
}

export const QUOTE_STATUS_MAP: StatusMap = {
  PENDING: { label: 'Pendente', variant: 'warning' },
  SUBMITTED: { label: 'Enviada', variant: 'info' },
  WON: { label: 'Venceu', variant: 'success' },
  LOST: { label: 'Perdeu', variant: 'danger' },
  CANCELLED: { label: 'Cancelada', variant: 'default' },
}
