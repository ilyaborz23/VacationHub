import { formPage, pageTitle, panel } from '../styles'

const FEATURES = [
  'Browse vacations, like your favorites and filter them by likes and dates',
  'Get a trip recommendation from AI for any destination',
  'Ask questions about the vacation data through an MCP server',
  'Administrators add, edit and delete vacations, see a likes report and download it as a CSV file',
]

const TECHNOLOGIES = 'React, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL (Neon), JWT, Gemini AI and MCP'
const REPOSITORY_URL = 'https://github.com/ilyaborz23/VacationHub'
const link = 'inline-block py-2.5 text-primary underline hover:text-primary-hover'

export default function AboutPage() {
  return (
    <section className={formPage}>
      <h1 className={pageTitle}>About VacationHub</h1>

      <div className={`${panel} mt-5 p-[clamp(16px,4vw,24px)]`}>
        <h2 className="text-xl font-bold">The system</h2>
        <p className="mt-2">VacationHub is a website for discovering vacations and choosing your next trip.</p>
        <ul className="mt-3 list-disc space-y-1.5 ps-5">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p className="mt-3"><span className="font-bold">Built with:</span> {TECHNOLOGIES}.</p>
      </div>

      <div className={`${panel} mt-5 p-[clamp(16px,4vw,24px)]`}>
        <h2 className="text-xl font-bold">The developer</h2>
        <p className="mt-2">Ilya Borzyh</p>
        <div className="mt-1 flex flex-wrap gap-x-6">
          <a className={link} href={REPOSITORY_URL} target="_blank" rel="noreferrer">Project code on GitHub</a>
          <a className={link} href={`${REPOSITORY_URL}/blob/main/database/image-credits.md`} target="_blank" rel="noreferrer">Photo credits</a>
        </div>
      </div>
    </section>
  )
}
