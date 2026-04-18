import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn.js'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm',
        'placeholder:text-gray-400',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error
          ? 'border-red-500 focus-visible:ring-red-500'
          : 'border-gray-300 focus-visible:ring-primary-500',
        className,
      )}
      aria-invalid={error}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
