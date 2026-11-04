import { useState } from 'react'
import type { FormEvent } from 'react'
import { getRecommendation } from '../api'
import Field from '../components/Field'
import { alert, answer, button, formPage, formWide, input, pageTitle } from '../styles'

const MAX_LENGTH = 100

export default function RecommendationPage() {
  const [destination, setDestination] = useState('')
  const [inputError, setInputError] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!destination.trim()) {
      setInputError('Enter a destination')
      return
    }
    setRecommendation('')
    setLoading(true)
    try {
      setRecommendation((await getRecommendation(destination.trim())).recommendation)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get a recommendation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={formPage}>
      <h1 className={pageTitle}>AI trip advice</h1>
      <p className="mt-1 text-muted">Enter a destination and get a trip recommendation.</p>
      <form className={formWide} onSubmit={submit} noValidate>
        <Field id="destination" label="Destination" error={inputError}>
          <input
            id="destination"
            className={input}
            dir="auto"
            maxLength={MAX_LENGTH}
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value)
              setInputError('')
            }}
            aria-invalid={inputError ? true : undefined}
            aria-describedby={inputError ? 'destination-error' : undefined}
          />
        </Field>
        <button type="submit" className={`${button} self-start`} disabled={loading}>{loading ? 'Thinking…' : 'Get recommendation'}</button>
      </form>
      {loading && <p className="mt-4 text-muted" role="status">Asking the AI, this can take a few seconds…</p>}
      {error && <p className={`${alert} mt-4`} role="alert">{error}</p>}
      {recommendation && <article className={answer} dir="auto" aria-live="polite">{recommendation}</article>}
    </section>
  )
}
