import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { downloadReportCsv } from '../api'
import { useAuth } from '../auth/AuthContext'
import { alert, buttonSecondary } from '../styles'

const navItem = 'inline-flex min-h-11 items-center rounded-[10px] px-3 font-medium no-underline transition-colors'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `${navItem} ${isActive ? 'bg-primary text-white' : 'text-ink hover:bg-tint'}`

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)
  const [csvError, setCsvError] = useState('')

  function logOut() {
    signOut()
    setCsvError('')
    navigate('/login')
  }

  async function downloadCsv() {
    setCsvError('')
    setDownloading(true)
    try {
      await downloadReportCsv()
    } catch (err) {
      setCsvError(err instanceof Error ? err.message : 'Failed to download the CSV file')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line bg-surface px-[clamp(16px,4vw,40px)] py-3">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2.5 text-xl font-bold text-ink no-underline">
          <img src="/favicon.svg" alt="" width="32" height="32" />
          VacationHub
        </Link>
        <nav className="flex flex-wrap gap-1" aria-label="Main">
          {!user && (
            <>
              <NavLink to="/login" className={navLink}>Log in</NavLink>
              <NavLink to="/register" className={navLink}>Sign up</NavLink>
            </>
          )}
          {user?.role === 'user' && <NavLink to="/vacations" className={navLink}>Vacations</NavLink>}
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin" end className={navLink}>Vacations</NavLink>
              <NavLink to="/admin/add" className={navLink}>Add vacation</NavLink>
              <NavLink to="/admin/report" className={navLink}>Report</NavLink>
              <button type="button" className={`${navItem} text-ink not-disabled:hover:bg-tint disabled:opacity-60`} disabled={downloading} onClick={downloadCsv}>
                {downloading ? 'Preparing…' : 'Download CSV'}
              </button>
            </>
          )}
          {user && (
            <>
              <NavLink to="/recommendation" className={navLink}>AI trip advice</NavLink>
              <NavLink to="/ask" className={navLink}>Ask the data</NavLink>
            </>
          )}
          <NavLink to="/about" className={navLink}>About</NavLink>
        </nav>
        {user && (
          <div className="ms-auto flex items-center gap-3">
            <span className="max-w-[180px] truncate text-muted" dir="auto">{user.first_name} {user.last_name}</span>
            <button type="button" className={`${buttonSecondary} px-3.5`} onClick={logOut}>Log out</button>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-[1180px] px-[clamp(16px,4vw,40px)] pt-7 pb-14">
        {csvError && <p className={alert} role="alert">{csvError}</p>}
        <Outlet />
      </main>
    </>
  )
}
