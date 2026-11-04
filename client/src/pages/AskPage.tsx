import { useState } from 'react'
import type { FormEvent } from 'react'
import { askQuestion } from '../api'
import Field from '../components/Field'
import { alert, answer as answerStyle, button, chip, formPage, formWide, input, pageTitle } from '../styles'

const MAX_LENGTH = 500
const EXAMPLES = [
  'כמה חופשות פעילות קיימות כרגע?',
  'מהו ממוצע מחירי החופשות?',
  'אלו חופשות עתידיות קיימות עבור מדינות באירופה?',
]

export default function AskPage() {
  const [question, setQuestion] = useState('')
  const [inputError, setInputError] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!question.trim()) {
      setInputError('Enter a question')
      return
    }
    setAnswer('')
    setLoading(true)
    try {
      setAnswer((await askQuestion(question.trim())).answer)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get an answer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={formPage}>
      <h1 className={pageTitle}>Ask the data</h1>
      <p className="mt-1 text-muted">Ask anything about the vacations in the database. The answer comes through the MCP server.</p>
      <form className={formWide} onSubmit={submit} noValidate>
        <Field id="question" label="Your question" error={inputError}>
          <textarea
            id="question"
            className={`${input} block resize-y`}
            dir="auto"
            rows={3}
            maxLength={MAX_LENGTH}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value)
              setInputError('')
            }}
            aria-invalid={inputError ? true : undefined}
            aria-describedby={inputError ? 'question-error' : undefined}
          />
        </Field>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Example questions">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className={chip}
              dir="auto"
              onClick={() => {
                setQuestion(example)
                setInputError('')
              }}
            >
              {example}
            </button>
          ))}
        </div>
        <button type="submit" className={`${button} self-start`} disabled={loading}>{loading ? 'Thinking…' : 'Ask'}</button>
      </form>
      {loading && <p className="mt-4 text-muted" role="status">Looking through the data, this can take a few seconds…</p>}
      {error && <p className={`${alert} mt-4`} role="alert">{error}</p>}
      {answer && <article className={answerStyle} dir="auto" aria-live="polite">{answer}</article>}
    </section>
  )
}
