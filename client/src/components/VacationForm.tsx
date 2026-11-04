import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { alert, button, buttonSecondary, formWide, input } from '../styles'
import { todayInIsrael } from '../utils/format'
import Field from './Field'

const MAX_PRICE = 10000
const MAX_DESTINATION_LENGTH = 100
const MAX_IMAGE_SIZE_MB = 5
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const PRICE_PATTERN = /^-?\d+(\.\d{1,2})?$/

export type VacationFormValues = {
  destination: string
  description: string
  start_date: string
  end_date: string
  price: string
}

type FieldName = keyof VacationFormValues | 'image'
type FieldErrors = Partial<Record<FieldName, string>>

const EMPTY_VALUES: VacationFormValues = { destination: '', description: '', start_date: '', end_date: '', price: '' }

type VacationFormProps = {
  mode: 'add' | 'edit'
  initialValues?: VacationFormValues
  currentImage?: string
  submitLabel: string
  onSubmit: (data: FormData) => Promise<void>
}

export default function VacationForm({ mode, initialValues, currentImage, submitLabel, onSubmit }: VacationFormProps) {
  const [values, setValues] = useState(initialValues ?? EMPTY_VALUES)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const isAdd = mode === 'add'

  useEffect(() => {
    if (!image) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  function change(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = event.target.name as keyof VacationFormValues
    setValues((current) => ({ ...current, [name]: event.target.value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function checkImage(file: File | null) {
    if (!file) return isAdd ? 'Image is required' : ''
    if (!IMAGE_TYPES.includes(file.type)) return 'Image must be a JPG, PNG, GIF or WEBP file'
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) return `Image cannot be larger than ${MAX_IMAGE_SIZE_MB} MB`
    return ''
  }

  function changeImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setImage(file)
    setErrors((current) => ({ ...current, image: file ? checkImage(file) || undefined : undefined }))
  }

  function validate() {
    const next: FieldErrors = {}
    if (!values.destination.trim()) next.destination = 'Destination is required'
    else if (values.destination.trim().length > MAX_DESTINATION_LENGTH) next.destination = `Destination cannot be longer than ${MAX_DESTINATION_LENGTH} characters`
    if (!values.description.trim()) next.description = 'Description is required'

    if (!values.start_date) next.start_date = 'Start date is required'
    else if (isAdd && values.start_date < todayInIsrael()) next.start_date = 'Start date cannot be in the past'
    if (!values.end_date) next.end_date = 'End date is required'
    else if (isAdd && values.end_date < todayInIsrael()) next.end_date = 'End date cannot be in the past'
    else if (values.start_date && values.end_date < values.start_date) next.end_date = 'End date cannot be earlier than start date'

    const price = values.price.trim()
    if (!price) next.price = 'Price is required'
    else if (!PRICE_PATTERN.test(price)) next.price = 'Enter a valid price with up to 2 decimals'
    else if (Number(price) < 0 || Number(price) > MAX_PRICE) next.price = `Price must be between 0 and ${MAX_PRICE.toLocaleString('en-US')}`

    const imageError = checkImage(image)
    if (imageError) next.image = imageError
    return next
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setFormError('')
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const data = new FormData()
    Object.entries(values).forEach(([name, value]) => data.append(name, value.trim()))
    if (image) data.append('image', image)

    setSaving(true)
    try {
      await onSubmit(data)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save the vacation')
      setSaving(false)
    }
  }

  const describe = (name: FieldName) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })
  const shownImage = preview ?? (currentImage ? `/images/${encodeURIComponent(currentImage)}` : null)
  const minDate = isAdd ? todayInIsrael() : undefined

  return (
    <form className={formWide} onSubmit={submit} noValidate>
      <Field id="destination" label="Destination" error={errors.destination}>
        <input id="destination" name="destination" className={input} dir="auto" maxLength={MAX_DESTINATION_LENGTH} value={values.destination} onChange={change} {...describe('destination')} />
      </Field>
      <Field id="description" label="Description" error={errors.description}>
        <textarea id="description" name="description" className={`${input} block resize-y`} dir="auto" rows={5} value={values.description} onChange={change} {...describe('description')} />
      </Field>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
        <Field id="start_date" label="Start date" error={errors.start_date}>
          <input id="start_date" name="start_date" className={input} type="date" min={minDate} value={values.start_date} onChange={change} {...describe('start_date')} />
        </Field>
        <Field id="end_date" label="End date" error={errors.end_date}>
          <input id="end_date" name="end_date" className={input} type="date" min={values.start_date || minDate} value={values.end_date} onChange={change} {...describe('end_date')} />
        </Field>
      </div>
      <Field id="price" label="Price ($)" error={errors.price}>
        <input id="price" name="price" className={input} type="number" inputMode="decimal" min={0} max={MAX_PRICE} step="0.01" value={values.price} onChange={change} {...describe('price')} />
      </Field>
      <Field id="image" label={isAdd ? 'Image' : 'Image (optional, keeps the current one if empty)'} error={errors.image}>
        <input id="image" name="image" className={input} type="file" accept={IMAGE_TYPES.join(',')} onChange={changeImage} {...describe('image')} />
      </Field>
      {shownImage && (
        <img
          key={shownImage}
          className="aspect-[16/10] w-full max-w-[320px] rounded-[10px] object-cover"
          src={shownImage}
          alt={preview ? 'Preview of the selected image' : 'Current vacation image'}
          onError={(event) => {
            event.currentTarget.hidden = true
          }}
        />
      )}
      {formError && <p className={`${alert} mb-0`} role="alert">{formError}</p>}
      <div className="flex flex-wrap gap-2.5">
        <button type="submit" className={button} disabled={saving}>{saving ? 'Saving…' : submitLabel}</button>
        <Link to="/admin" className={buttonSecondary}>Cancel</Link>
      </div>
    </form>
  )
}
