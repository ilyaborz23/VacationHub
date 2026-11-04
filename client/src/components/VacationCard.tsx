import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Vacation } from '../types'
import { formatDate, formatPrice } from '../utils/format'

type VacationCardProps = {
  vacation: Vacation
  badge?: ReactNode
  footer?: ReactNode
}

export default function VacationCard({ vacation, badge, footer }: VacationCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-line bg-surface">
      <div className="h-[200px] bg-tint">
        {!imageFailed && (
          <img
            className="block size-full object-cover object-[center_15%]"
            src={`/images/${encodeURIComponent(vacation.image_file_name)}`}
            alt={vacation.destination}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl leading-snug font-bold wrap-anywhere" dir="auto">{vacation.destination}</h2>
          {badge}
        </div>
        <p className="text-sm text-muted">{formatDate(vacation.start_date)} – {formatDate(vacation.end_date)}</p>
        <p className="flex-1 wrap-anywhere" dir="auto">{vacation.description}</p>
        <p className="mt-2 text-[1.375rem] font-black">{formatPrice(vacation.price)}</p>
        {footer}
      </div>
    </article>
  )
}
