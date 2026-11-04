import { useNavigate } from 'react-router-dom'
import { addVacation } from '../api'
import VacationForm from '../components/VacationForm'
import { formPage, pageTitle } from '../styles'

export default function AddVacationPage() {
  const navigate = useNavigate()

  return (
    <section className={formPage}>
      <h1 className={pageTitle}>Add vacation</h1>
      <VacationForm
        mode="add"
        submitLabel="Add vacation"
        onSubmit={async (data) => {
          await addVacation(data)
          navigate('/admin')
        }}
      />
    </section>
  )
}
