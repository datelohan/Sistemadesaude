import { cn } from '../lib/cn.js'

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-4',
} as const

export interface SpinnerProps {
  size?: keyof typeof sizes
  className?: string
  label?: string
}

export function Spinner({ size = 'md', className, label = 'Carregando...' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label}>
      <span
        className={cn(
          'block animate-spin rounded-full border-gray-300 border-t-primary-600',
          sizes[size],
          className,
        )}
        aria-hidden
      />
    </span>
  )
}
