import React, { ReactNode } from 'react'

export interface PageProps {
  title?: string
  children?: ReactNode
}

export function Page({ title, children }: PageProps) {
  return (
    <html lang="en" className="h-full w-full">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Discovery UI` : 'Discovery UI'}</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body className="h-full w-full">{children}</body>
      <script src="/htmx-2.0.2.min.js"></script>
    </html>
  )
}
