import type { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'

export function renderPage(page: ReactNode) {
  const html = renderToString(page)
  return `<!doctype html>${html}`
}
