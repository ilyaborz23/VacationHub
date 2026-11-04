type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const pageButton = 'min-h-11 min-w-11 rounded-[10px] border border-line bg-surface font-medium transition-colors not-disabled:hover:bg-tint disabled:opacity-45'
const currentPageButton = 'min-h-11 min-w-11 rounded-[10px] border border-primary bg-primary font-medium text-white'

function visiblePages(page: number, totalPages: number) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null
  const pages = visiblePages(page, totalPages)

  return (
    <nav className="mt-7 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button type="button" className={pageButton} aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ‹
      </button>
      {pages.map((p, index) => (
        <span key={p} className="inline-flex items-center gap-1.5">
          {index > 0 && p - pages[index - 1] > 1 && <span className="text-muted" aria-hidden="true">…</span>}
          <button
            type="button"
            className={p === page ? currentPageButton : pageButton}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        </span>
      ))}
      <button type="button" className={pageButton} aria-label="Next page" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        ›
      </button>
    </nav>
  )
}
