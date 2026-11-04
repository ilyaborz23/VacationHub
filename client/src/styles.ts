const buttonBase =
  'inline-flex min-h-11 items-center justify-center rounded border px-4 font-bold no-underline transition-colors disabled:opacity-60'

export const button = `${buttonBase} border-primary bg-primary text-white not-disabled:hover:border-primary-hover not-disabled:hover:bg-primary-hover`
export const buttonSecondary = `${buttonBase} border-input-line bg-surface font-normal text-ink not-disabled:hover:bg-tint`
export const buttonDanger = `${buttonBase} border-danger bg-danger text-white not-disabled:hover:border-danger-hover not-disabled:hover:bg-danger-hover`
export const buttonDangerOutline = `${buttonBase} border-danger bg-surface font-normal text-danger not-disabled:hover:bg-danger-tint`

export const chip = 'min-h-11 rounded border border-input-line bg-surface px-4 transition-colors hover:bg-tint'
export const chipActive = 'min-h-11 rounded border border-primary bg-primary px-4 font-bold text-white'
export const exampleChip = 'min-h-11 rounded border border-input-line bg-surface px-3 py-1.5 text-start transition-colors hover:bg-tint'

export const input =
  'min-h-11 w-full rounded border border-input-line bg-surface px-3 py-2.5 aria-invalid:border-2 aria-invalid:border-danger'

export const alert = 'mb-4 flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded border border-danger bg-danger-tint px-4 py-3 text-danger'
export const panel = 'rounded-md border border-line bg-surface'
export const pageTitle = 'text-3xl leading-tight font-black'
export const pageHead = 'mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3'
export const formPage = 'mx-auto w-full max-w-[680px]'
export const form = 'mt-5 flex flex-col gap-4'
export const formWide = `${form} ${panel} p-[clamp(16px,4vw,24px)]`
export const answer = `${panel} mt-5 bg-tint p-[clamp(16px,4vw,24px)] wrap-anywhere whitespace-pre-line`
export const empty = `${panel} px-4 py-12 text-center text-muted`
export const cardGrid = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6'
