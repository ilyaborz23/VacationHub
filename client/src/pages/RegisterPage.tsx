import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api'
import type { RegisterData } from '../api'
import { useAuth } from '../auth/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import { alert, button, form, input } from '../styles'
import { validateEmail, validatePassword } from '../utils/format'

type Errors = Partial<Record<keyof RegisterData, string>>

const EMPTY: RegisterData = { first_name: '', last_name: '', email: '', password: '' }

export default function RegisterPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  function update(name: keyof RegisterData, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function validate() {
    const next: Errors = {}
    if (!values.first_name.trim()) next.first_name = 'First name is required'
    if (!values.last_name.trim()) next.last_name = 'Last name is required'
    const emailError = validateEmail(values.email)
    if (emailError) next.email = emailError
    const passwordError = validatePassword(values.password)
    if (passwordError) next.password = passwordError
    return next
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setFormError('')
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      signIn(await register(values))
      navigate('/vacations')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to register')
      setSaving(false)
    }
  }

  const describe = (name: keyof RegisterData) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <AuthLayout
      title="Create your account"
      intro="Save the vacations you love and get trip advice."
    >
      <form className={form} onSubmit={submit} noValidate>
        <Field id="first_name" label="First name" error={errors.first_name}>
          <input id="first_name" className={input} dir="auto" autoComplete="given-name" maxLength={50} value={values.first_name} onChange={(e) => update('first_name', e.target.value)} {...describe('first_name')} />
        </Field>
        <Field id="last_name" label="Last name" error={errors.last_name}>
          <input id="last_name" className={input} dir="auto" autoComplete="family-name" maxLength={50} value={values.last_name} onChange={(e) => update('last_name', e.target.value)} {...describe('last_name')} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" className={input} type="email" autoComplete="email" maxLength={255} value={values.email} onChange={(e) => update('email', e.target.value)} {...describe('email')} />
        </Field>
        <Field id="password" label="Password (at least 4 characters)" error={errors.password}>
          <input id="password" className={input} type="password" autoComplete="new-password" value={values.password} onChange={(e) => update('password', e.target.value)} {...describe('password')} />
        </Field>
        {formError && <p className={`${alert} mb-0`} role="alert">{formError}</p>}
        <button type="submit" className={`${button} w-full`} disabled={saving}>{saving ? 'Creating account…' : 'Sign up'}</button>
      </form>
      <p className="mt-4 text-center">Already registered? <Link to="/login" className="inline-block py-2.5 font-bold text-primary underline hover:text-primary-hover">Log in</Link></p>
    </AuthLayout>
  )
}
