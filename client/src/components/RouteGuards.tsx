import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../types'

export function homePathFor(role: Role) {
  return role === 'admin' ? '/admin' : '/vacations'
}

export function RequireAuth({ role }: { role?: Role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={homePathFor(user.role)} replace />
  return <Outlet />
}

export function GuestOnly() {
  const { user } = useAuth()
  if (user) return <Navigate to={homePathFor(user.role)} replace />
  return <Outlet />
}

export function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? homePathFor(user.role) : '/login'} replace />
}
