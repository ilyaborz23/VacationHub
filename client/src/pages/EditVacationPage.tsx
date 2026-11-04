import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getVacation, updateVacation } from '../api'
import VacationForm from '../components/VacationForm'
import { alert, formPage, pageTitle } from '../styles'
import type { Vacation } from '../types'

export default function EditVacationPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [vacation, setVacation] = useState<Vacation | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    getVacation(id)
      .then((result) => {
        if (!ignore) setVacation(result)
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [id])

  return (
    <section className={formPage}>
      <h1 className={pageTitle}>Edit vacation</h1>
      {error && (
        <div className={`${alert} mt-4`} role="alert">
          <p>{error}</p>
          <Link to="/admin" className="underline">Back to vacations</Link>
        </div>
      )}
      {!vacation && !error && <p className="mt-4 text-muted" role="status">Loading vacation…</p>}
      {vacation && (
        <VacationForm
          mode="edit"
          initialValues={{
            destination: vacation.destination,
            description: vacation.description,
            start_date: vacation.start_date,
            end_date: vacation.end_date,
            price: String(vacation.price),
          }}
          currentImage={vacation.image_file_name}
          submitLabel="Save changes"
          onSubmit={async (data) => {
            await updateVacation(id, data)
            navigate('/admin')
          }}
        />
      )}
    </section>
  )
}
