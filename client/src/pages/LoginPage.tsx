import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../auth/AuthContext'
import Field from '../components/Field'
import { homePathFor } from '../components/RouteGuards'
import { alert, authPanel, button, form, input, pageTitle } from '../styles'
import { validateEmail, validatePassword } from '../utils/format'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setFormError('')
    const nextEmailError = validateEmail(email)
    const nextPasswordError = validatePassword(password)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextEmailError || nextPasswordError) return

    setSaving(true)
    try {
      const session = await login(email, password)
      signIn(session)
      navigate(homePathFor(session.user.role))
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to log in')
      setSaving(false)
    }
  }

  return (
    <section className={authPanel}>
      <h1 className={pageTitle}>Welcome back</h1>
      <p className="mt-1 text-muted">Log in to see your vacations.</p>
      <form className={form} onSubmit={submit} noValidate>
        <Field id="email" label="Email" error={emailError}>
          <input
            id="email"
            className={input}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError('')
            }}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? 'email-error' : undefined}
          />
        </Field>
        <Field id="password" label="Password" error={passwordError}>
          <input
            id="password"
            className={input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError('')
            }}
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? 'password-error' : undefined}
          />
        </Field>
        {formError && <p className={`${alert} mb-0`} role="alert">{formError}</p>}
        <button type="submit" className={`${button} w-full`} disabled={saving}>{saving ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="mt-4 text-center">New here? <Link to="/register" className="inline-block py-2.5 font-medium text-primary underline">Create an account</Link></p>
    </section>
  )
}
