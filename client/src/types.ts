export type Role = 'user' | 'admin'

export type User = {
  user_id: number
  first_name: string
  last_name: string
  email: string
  role: Role
}

export type AuthResponse = {
  token: string
  user: User
}

export type Vacation = {
  vacation_id: number
  destination: string
  description: string
  start_date: string
  end_date: string
  price: number
  image_file_name: string
  likes_count: number
  is_liked: boolean
}

export type VacationFilter = 'all' | 'liked' | 'active' | 'upcoming'

export type VacationsPage = {
  vacations: Vacation[]
  page: number
  totalPages: number
  totalCount: number
}

export type ReportRow = {
  destination: string
  likes_count: number
}
