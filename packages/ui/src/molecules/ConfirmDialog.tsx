import { Button } from '../atoms/Button.js'

export interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  dangerous?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  dangerous = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div role="dialog" aria-modal aria-labelledby="dialog-title" aria-describedby="dialog-desc">
      <h2 id="dialog-title" className="text-lg font-semibold text-gray-900">
        {title}
      </h2>
      <p id="dialog-desc" className="mt-2 text-sm text-gray-600">
        {description}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={dangerous ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  )
}
