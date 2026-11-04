export function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}

export function formatPrice(price: number) {
  return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

export function todayInIsrael() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date())
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 4

export function validateEmail(email: string) {
  if (!email.trim()) return 'Email is required'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address'
  return ''
}

export function validatePassword(password: string) {
  if (!password) return 'Password is required'
  if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  return ''
}
