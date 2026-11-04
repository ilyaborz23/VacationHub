const buttonBase =
  'inline-flex min-h-11 items-center justify-center rounded-[10px] border px-5 font-semibold no-underline transition-colors disabled:opacity-60'

export const button = `${buttonBase} border-primary bg-primary text-white not-disabled:hover:border-primary-hover not-disabled:hover:bg-primary-hover`
export const buttonSecondary = `${buttonBase} border-primary bg-surface text-primary not-disabled:hover:bg-tint`
export const buttonDanger = `${buttonBase} border-danger bg-danger text-white not-disabled:hover:border-danger-hover not-disabled:hover:bg-danger-hover`
export const buttonDangerOutline = `${buttonBase} border-danger bg-surface text-danger not-disabled:hover:bg-danger-tint`

export const chip = 'min-h-11 rounded-full border border-primary bg-surface px-4 py-1.5 font-medium text-primary transition-colors hover:bg-tint'
export const chipActive = 'min-h-11 rounded-full border border-primary bg-primary px-4 py-1.5 font-medium text-white transition-colors'

export const input =
  'min-h-11 w-full rounded-[10px] border border-input-line bg-surface px-3 py-2.5 aria-invalid:border-2 aria-invalid:border-danger'

export const alert = 'mb-4 flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-[10px] border border-danger bg-danger-tint px-4 py-3 text-danger'
export const panel = 'rounded-2xl bg-surface shadow-card'
export const authPanel = `${panel} mx-auto mt-[clamp(0px,4vh,40px)] w-full max-w-[440px] p-[clamp(20px,5vw,32px)]`
export const pageTitle = 'text-[clamp(1.6rem,4vw,2.1rem)] leading-tight font-bold'
export const pageHead = 'mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3'
export const formPage = 'mx-auto w-full max-w-[680px]'
export const form = 'mt-5 flex flex-col gap-4'
export const formWide = `${form} ${panel} p-[clamp(16px,4vw,24px)]`
export const answer = `${panel} mt-5 border-s-4 border-primary p-[clamp(16px,4vw,24px)] wrap-anywhere whitespace-pre-line`
export const empty = 'rounded-2xl border border-dashed border-line bg-surface px-4 py-12 text-center text-muted'
export const cardGrid = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5'
