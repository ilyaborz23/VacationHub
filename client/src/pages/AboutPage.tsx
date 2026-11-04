import { formPage, pageTitle, panel } from '../styles'

const FEATURES = [
  'Browse vacations, like your favorites and filter them by likes and dates',
  'Get a trip recommendation from AI for any destination',
  'Ask questions about the vacation data through an MCP server',
  'Administrators add, edit and delete vacations, see a likes report and download it as a CSV file',
]

const TECHNOLOGIES = 'React, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL (Neon), JWT, Gemini AI and MCP'

export default function AboutPage() {
  return (
    <section className={formPage}>
      <h1 className={pageTitle}>About VacationHub</h1>

      <div className={`${panel} mt-5 p-[clamp(16px,4vw,24px)]`}>
        <h2 className="text-xl font-bold">The system</h2>
        <p className="mt-2 text-muted">VacationHub is a website for discovering vacations and choosing your next trip.</p>
        <ul className="mt-3 list-disc space-y-1.5 ps-5 text-muted">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p className="mt-3 text-muted"><span className="font-medium text-ink">Built with:</span> {TECHNOLOGIES}.</p>
      </div>

      <div className={`${panel} mt-5 p-[clamp(16px,4vw,24px)]`}>
        <h2 className="text-xl font-bold">The developer</h2>
        <p className="mt-2 text-muted"><span className="font-medium text-ink">Name:</span> Ilya Borzyh</p>
        <p className="mt-1 text-muted">
          <span className="font-medium text-ink">Project code:</span>{' '}
          <a className="inline-block py-2.5 text-primary underline" href="https://github.com/ilyaborz23/VacationHub" target="_blank" rel="noreferrer">
            github.com/ilyaborz23/VacationHub
          </a>
        </p>
      </div>
    </section>
  )
}
