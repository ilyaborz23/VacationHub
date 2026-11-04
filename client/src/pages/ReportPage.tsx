import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { downloadReportCsv, getReport } from '../api'
import { alert, button, empty, pageHead, pageTitle, panel } from '../styles'
import type { ReportRow } from '../types'

const MAX_LABEL_LENGTH = 24

const shortenLabel = (destination: string) =>
  destination.length > MAX_LABEL_LENGTH ? `${destination.slice(0, MAX_LABEL_LENGTH - 1)}…` : destination

export default function ReportPage() {
  const [report, setReport] = useState<ReportRow[] | null>(null)
  const [error, setError] = useState('')
  const [csvError, setCsvError] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let ignore = false
    getReport()
      .then((result) => {
        if (!ignore) setReport(result)
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [])

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
    <section>
      <div className={pageHead}>
        <h1 className={pageTitle}>Likes report</h1>
        <button type="button" className={button} disabled={downloading} onClick={downloadCsv}>
          {downloading ? 'Preparing…' : 'Download CSV'}
        </button>
      </div>

      {csvError && <p className={alert} role="alert">{csvError}</p>}
      {error && <p className={alert} role="alert">{error}</p>}
      {!report && !error && <p className="text-muted" role="status">Loading report…</p>}
      {report && report.length === 0 && <p className={empty}>There are no vacations to report on.</p>}

      {report && report.length > 0 && (
        <div className={`${panel} overflow-x-auto px-2 py-4`} role="img" aria-label={`Bar chart of likes for ${report.length} vacation destinations`}>
          <div className="min-w-[640px]">
            <ResponsiveContainer width="100%" height={460}>
              <BarChart data={report} margin={{ top: 16, right: 16, bottom: 72, left: 56 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-line)" />
                <XAxis dataKey="destination" interval={0} angle={-35} textAnchor="end" height={90} tickFormatter={shortenLabel} tick={{ fill: 'var(--color-ink)', fontSize: 13 }}>
                  <Label value="Destination" position="insideBottom" offset={-58} fill="var(--color-muted)" />
                </XAxis>
                <YAxis allowDecimals={false} domain={[0, (max: number) => Math.max(max, 1)]} tick={{ fill: 'var(--color-ink)', fontSize: 13 }}>
                  <Label value="Likes" angle={-90} position="insideLeft" fill="var(--color-muted)" />
                </YAxis>
                <Tooltip cursor={{ fill: 'var(--color-tint)' }} />
                <Bar dataKey="likes_count" name="Likes" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={56} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  )
}
