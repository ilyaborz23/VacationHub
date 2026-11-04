import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { deleteVacation, getVacations } from '../api'
import ConfirmDialog from '../components/ConfirmDialog'
import { HeartIcon } from '../components/Icons'
import Pagination from '../components/Pagination'
import VacationCard from '../components/VacationCard'
import { alert, button, buttonDangerOutline, buttonSecondary, cardGrid, empty, pageHead, pageTitle } from '../styles'
import type { Vacation, VacationsPage } from '../types'

export default function AdminPage() {
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState<VacationsPage | null>(null)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [reload, setReload] = useState(0)
  const [toDelete, setToDelete] = useState<Vacation | null>(null)
  const [deleting, setDeleting] = useState(false)

  const page = Math.max(1, Number(params.get('page')) || 1)

  useEffect(() => {
    let ignore = false
    setError('')
    getVacations(page)
      .then((result) => {
        if (ignore) return
        // Deleting the last vacation of the last page leaves that page empty
        if (result.vacations.length === 0 && result.totalPages > 0 && page > result.totalPages) {
          setParams({ page: String(result.totalPages) }, { replace: true })
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
  }, [page, reload, setParams])

  async function confirmDelete() {
    if (!toDelete) return
    setActionError('')
    setDeleting(true)
    try {
      await deleteVacation(toDelete.vacation_id)
      setReload((current) => current + 1)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete the vacation')
    } finally {
      setDeleting(false)
      setToDelete(null)
    }
  }

  return (
    <section>
      <div className={pageHead}>
        <h1 className={pageTitle}>Manage vacations</h1>
        <Link to="/admin/add" className={button}>Add vacation</Link>
      </div>

      {actionError && <p className={alert} role="alert">{actionError}</p>}
      {error && (
        <div className={alert} role="alert">
          <p>{error}</p>
          <button type="button" className={buttonSecondary} onClick={() => setReload((current) => current + 1)}>Try again</button>
        </div>
      )}
      {!data && !error && <p className="text-muted" role="status">Loading vacations…</p>}
      {data && data.vacations.length === 0 && !error && <p className={empty}>There are no vacations yet.</p>}

      {data && data.vacations.length > 0 && (
        <div className={cardGrid}>
          {data.vacations.map((vacation) => (
            <VacationCard
              key={vacation.vacation_id}
              vacation={vacation}
              badge={
                <span className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-3.5 font-semibold text-muted shadow-md" aria-label={`${vacation.likes_count} likes`}>
                  <HeartIcon filled={false} />
                  <span>{vacation.likes_count}</span>
                </span>
              }
              footer={
                <div className="flex gap-2">
                  <Link to={`/admin/edit/${vacation.vacation_id}`} className={`${buttonSecondary} px-3.5`} aria-label={`Edit ${vacation.destination}`}>Edit</Link>
                  <button type="button" className={`${buttonDangerOutline} px-3.5`} aria-label={`Delete ${vacation.destination}`} onClick={() => setToDelete(vacation)}>Delete</button>
                </div>
              }
            />
          ))}
        </div>
      )}

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onChange={(next) => {
            setParams({ page: String(next) })
            window.scrollTo({ top: 0 })
          }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete this vacation?"
          message={`${toDelete.destination} and all its likes will be permanently deleted.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  )
}
