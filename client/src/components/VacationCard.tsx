import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Vacation } from '../types'
import { formatDate, formatPrice } from '../utils/format'
import { CalendarIcon } from './Icons'

type VacationCardProps = {
  vacation: Vacation
  badge?: ReactNode
  footer?: ReactNode
}

export default function VacationCard({ vacation, badge, footer }: VacationCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card">
      <div className="relative aspect-[16/10] bg-linear-to-br from-sky-900 via-sky-600 to-sky-400 after:pointer-events-none after:absolute after:inset-x-0 after:top-[45%] after:bottom-0 after:bg-linear-to-t after:from-sky-950/85 after:to-transparent">
        {!imageFailed && (
          <img
            className="block size-full object-cover"
            src={`/images/${encodeURIComponent(vacation.image_file_name)}`}
            alt={vacation.destination}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        {badge && <div className="absolute start-3 top-3 z-10">{badge}</div>}
        <h2 className="absolute inset-x-4 bottom-3 z-10 text-xl leading-tight font-semibold text-white" dir="auto">{vacation.destination}</h2>
      </div>
      <p className="flex items-center gap-2 bg-tint px-4 py-2.5 text-[0.95rem] font-medium">
        <CalendarIcon />
        <span>{formatDate(vacation.start_date)} – {formatDate(vacation.end_date)}</span>
      </p>
      <p className="flex-1 px-4 pt-3.5 pb-1 wrap-anywhere text-muted" dir="auto">{vacation.description}</p>
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 pt-3 pb-4">
        <p className="text-xl font-bold text-accent">{formatPrice(vacation.price)}</p>
        {footer}
      </div>
    </article>
  )
}
