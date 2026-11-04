import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { setAuthToken, setUnauthorizedHandler } from '../api'
import type { AuthResponse, User } from '../types'

const STORAGE_KEY = 'vacationhub-auth'

function isExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

function loadSession(): AuthResponse | null {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as AuthResponse | null
    if (session?.token && session.user && !isExpired(session.token)) return session
  } catch {
    // Unreadable storage is the same as not being logged in
  }
  return null
}

const initialSession = loadSession()
setAuthToken(initialSession?.token ?? null)

type AuthContextValue = {
  user: User | null
  signIn: (session: AuthResponse) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)

  const signIn = useCallback((session: AuthResponse) => {
    setAuthToken(session.token)
    setUser(session.user)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
      // The session still works until the page is reloaded
    }
  }, [])

  const signOut = useCallback(() => {
    setAuthToken(null)
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to clean up
    }
  }, [])

  useEffect(() => setUnauthorizedHandler(signOut), [signOut])

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
