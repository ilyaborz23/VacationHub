import type { ReactNode } from 'react'
import { pageTitle, panel } from '../styles'

type AuthLayoutProps = {
  title: string
  intro: string
  children: ReactNode
}

export default function AuthLayout({ title, intro, children }: AuthLayoutProps) {
  return (
    <section className={`${panel} mx-auto mt-[clamp(0px,4vh,32px)] w-full max-w-[440px] p-[clamp(20px,5vw,32px)]`}>
      <h1 className={pageTitle}>{title}</h1>
      <p className="mt-1 text-muted">{intro}</p>
      {children}
    </section>
  )
}
