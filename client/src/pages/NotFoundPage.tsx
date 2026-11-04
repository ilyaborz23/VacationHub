import { Link } from 'react-router-dom'
import { button, pageTitle } from '../styles'

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-start gap-4 py-16">
      <h1 className={pageTitle}>Page not found</h1>
      <p className="text-muted">This destination does not exist.</p>
      <Link to="/" className={button}>Back home</Link>
    </section>
  )
}
