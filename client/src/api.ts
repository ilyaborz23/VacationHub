import type { AuthResponse, ReportRow, Vacation, VacationFilter, VacationsPage } from './types'

let authToken: string | null = null
let onUnauthorized: () => void = () => {}

export function setAuthToken(token: string | null) {
  authToken = token
}

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

async function send(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  const sentToken = authToken
  if (sentToken) headers.set('Authorization', `Bearer ${sentToken}`)

  let res: Response
  try {
    res = await fetch(url, { ...options, headers })
  } catch {
    throw new Error('Cannot reach the server. Please check your connection and try again.')
  }

  if (res.ok) return res

  // The body may be missing or not JSON (e.g. the proxy fails when the server is down)
  const data = await res.json().catch(() => null)
  // A rejected token means the session is over. A failed login sends no token, so it stays on the page.
  if (res.status === 401 && sentToken) onUnauthorized()
  if (data?.error) throw new Error(data.error)
  if (res.status >= 500) throw new Error('The server is unavailable. Please try again later.')
  throw new Error(`Request failed (${res.status})`)
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await send(url, options)
  return (await res.json()) as T
}

function postJson<T>(url: string, body: unknown) {
  return request<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export type RegisterData = {
  first_name: string
  last_name: string
  email: string
  password: string
}

export function register(data: RegisterData) {
  return postJson<AuthResponse>('/api/auth/register', data)
}

export function login(email: string, password: string) {
  return postJson<AuthResponse>('/api/auth/login', { email, password })
}

export function getVacations(page: number, filter: VacationFilter = 'all') {
  return request<VacationsPage>(`/api/vacations?page=${page}&filter=${filter}`)
}

export function getVacation(id: string) {
  return request<Vacation>(`/api/vacations/${encodeURIComponent(id)}`)
}

export function likeVacation(id: number) {
  return request<Vacation>(`/api/vacations/${id}/like`, { method: 'POST' })
}

export function unlikeVacation(id: number) {
  return request<Vacation>(`/api/vacations/${id}/like`, { method: 'DELETE' })
}

export function addVacation(data: FormData) {
  return request<Vacation>('/api/vacations', { method: 'POST', body: data })
}

export function updateVacation(id: string, data: FormData) {
  return request<Vacation>(`/api/vacations/${encodeURIComponent(id)}`, { method: 'PUT', body: data })
}

export function deleteVacation(id: number) {
  return request<{ message: string }>(`/api/vacations/${id}`, { method: 'DELETE' })
}

export function getReport() {
  return request<ReportRow[]>('/api/vacations/report')
}

export async function downloadReportCsv() {
  const res = await send('/api/vacations/report/csv')
  const url = URL.createObjectURL(await res.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = 'vacations-likes.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function getRecommendation(destination: string) {
  return postJson<{ destination: string; recommendation: string }>('/api/ai/recommendation', { destination })
}

export function askQuestion(question: string) {
  return postJson<{ question: string; answer: string }>('/api/mcp/ask', { question })
}
