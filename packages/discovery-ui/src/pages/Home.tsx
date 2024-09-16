import { ConfigReader } from '@l2beat/discovery'
import React from 'react'
import { Page } from '../common/Page'
import { DISCOVERY_ROOT_PATH } from '../common/constants'

export function HomePage() {
  const configReader = new ConfigReader(DISCOVERY_ROOT_PATH)
  const chains = configReader.readAllChains()
  const projects: { name: string; chain: string }[] = []
  for (const chain of chains) {
    projects.push(
      ...configReader
        .readAllProjectsForChain(chain)
        .map((name) => ({ name, chain })),
    )
  }

  projects.sort((a, b) => {
    const cmp = a.name.localeCompare(b.name)
    if (cmp === 0) {
      return a.chain.localeCompare(b.chain)
    }
    return cmp
  })

  return (
    <Page>
      <main className="mx-auto max-w-[1200px] p-4">
        <h1 className="mb-4 font-bold font-mono">Discovery UI</h1>
        <ol className="grid w-full grid-cols-3 gap-x-4">
          {projects.map((project, i) => (
            <li key={i}>
              <a
                href={`/p/${project.name}/${project.chain}`}
                className="font-mono text-blue-700"
              >
                {project.name} <small>{project.chain}</small>
              </a>
            </li>
          ))}
        </ol>
      </main>
    </Page>
  )
}
