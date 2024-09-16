import React, { ReactNode } from 'react'

export interface PageProps {
  title?: string
  children?: ReactNode
}

export function Page({ title, children }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | Discovery UI` : 'Discovery UI'}</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
