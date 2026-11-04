import { useEffect, useRef } from 'react'
import { buttonDanger, buttonSecondary } from '../styles'

type ConfirmDialogProps = {
  title: string
  message: string
  confirmLabel: string
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      className="m-auto w-[min(460px,calc(100vw-32px))] rounded-md bg-surface p-6 text-ink shadow-xl backdrop:bg-black/50"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onCancel()
      }}
    >
      <h2 id="dialog-title" className="text-xl font-black">{title}</h2>
      <p className="mt-2 wrap-anywhere text-muted">{message}</p>
      <div className="mt-5 flex flex-wrap justify-end gap-2.5">
        <button type="button" className={buttonSecondary} autoFocus disabled={busy} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={buttonDanger} disabled={busy} onClick={onConfirm}>
          {busy ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
