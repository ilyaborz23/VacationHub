import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getVacations, likeVacation, unlikeVacation } from '../api'
import { HeartIcon } from '../components/Icons'
import Pagination from '../components/Pagination'
import VacationCard from '../components/VacationCard'
import { alert, buttonSecondary, cardGrid, chip, chipActive, empty, pageTitle } from '../styles'
import type { Vacation, VacationFilter, VacationsPage as VacationsData } from '../types'

const likeButton = '-me-2 -mt-2 inline-flex min-h-11 min-w-11 flex-none items-center justify-center gap-1.5 rounded px-2 font-bold transition-colors hover:bg-tint disabled:opacity-70'

const FILTERS: { value: VacationFilter; label: string; empty: string }[] = [
  { value: 'all', label: 'All', empty: 'There are no vacations yet.' },
  { value: 'liked', label: 'My likes', empty: 'You have not liked any vacations yet.' },
  { value: 'active', label: 'Active now', empty: 'No vacations are running right now.' },
  { value: 'upcoming', label: 'Not started yet', empty: 'No upcoming vacations.' },
]

export default function VacationsPage() {
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState<VacationsData | null>(null)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [reload, setReload] = useState(0)
  const [pendingLike, setPendingLike] = useState<number | null>(null)

  const page = Math.max(1, Number(params.get('page')) || 1)
  const filterParam = params.get('filter')
  const filter = FILTERS.find((f) => f.value === filterParam) ?? FILTERS[0]

  useEffect(() => {
    let ignore = false
    setError('')
    getVacations(page, filter.value)
      .then((result) => {
        if (ignore) return
        // The last vacation of the last page can disappear, for example after removing a like
        if (result.vacations.length === 0 && result.totalPages > 0 && page > result.totalPages) {
          setParams({ filter: filter.value, page: String(result.totalPages) }, { replace: true })
          return
        }
        setData(result)
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [page, filter.value, reload, setParams])

  function goTo(nextPage: number) {
    setParams({ filter: filter.value, page: String(nextPage) })
    window.scrollTo({ top: 0 })
  }

  function chooseFilter(value: VacationFilter) {
    setData(null)
    setActionError('')
    setParams({ filter: value, page: '1' })
  }

  async function toggleLike(vacation: Vacation) {
    setActionError('')
    setPendingLike(vacation.vacation_id)
    try {
      const updated = vacation.is_liked ? await unlikeVacation(vacation.vacation_id) : await likeVacation(vacation.vacation_id)
      if (filter.value === 'liked') {
        setReload((current) => current + 1)
      } else {
        setData((current) => current && {
          ...current,
          vacations: current.vacations.map((v) => (v.vacation_id === updated.vacation_id ? updated : v)),
        })
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update the like')
    } finally {
      setPendingLike(null)
    }
  }

  return (
    <section>
      <h1 className={pageTitle}>Vacations</h1>
      <p className="mt-1 mb-5 min-h-6 text-muted" aria-live="polite">
        {data && `${data.totalCount} ${data.totalCount === 1 ? 'vacation' : 'vacations'}, sorted by start date`}
      </p>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter vacations">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={f.value === filter.value ? chipActive : chip}
            aria-pressed={f.value === filter.value}
            onClick={() => chooseFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {actionError && <p className={alert} role="alert">{actionError}</p>}
      {error && (
        <div className={alert} role="alert">
          <p>{error}</p>
          <button type="button" className={buttonSecondary} onClick={() => setReload((current) => current + 1)}>Try again</button>
        </div>
      )}
      {!data && !error && <p className="text-muted" role="status">Loading vacations…</p>}
      {data && data.vacations.length === 0 && !error && <p className={empty}>{filter.empty}</p>}

      {data && data.vacations.length > 0 && (
        <div className={cardGrid}>
          {data.vacations.map((vacation) => (
            <VacationCard
              key={vacation.vacation_id}
              vacation={vacation}
              badge={
                <button
                  type="button"
                  className={`${likeButton} ${vacation.is_liked ? 'text-danger' : 'text-muted'}`}
                  aria-pressed={vacation.is_liked}
                  aria-label={`${vacation.is_liked ? 'Remove like from' : 'Like'} ${vacation.destination}, ${vacation.likes_count} likes`}
                  disabled={pendingLike === vacation.vacation_id}
                  onClick={() => toggleLike(vacation)}
                >
                  <HeartIcon filled={vacation.is_liked} />
                  <span>{vacation.likes_count}</span>
                </button>
              }
            />
          ))}
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={goTo} />}
    </section>
  )
}
