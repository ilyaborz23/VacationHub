import type { ReactNode } from 'react'

type FieldProps = {
  id: string
  label: string
  error?: string
  children: ReactNode
}

// The control inside must use the same id and point aria-describedby at `${id}-error`
export default function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-bold">{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 text-[0.92rem] text-danger" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
