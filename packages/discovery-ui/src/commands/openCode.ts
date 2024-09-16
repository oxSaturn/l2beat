import { ConfigReader } from '@l2beat/discovery'
import { spawn } from 'child_process'
import { DISCOVERY_ROOT_PATH } from '../common/constants'
import { join } from 'path'
import { existsSync, readdirSync, statSync } from 'fs'

export function openCode(project: string, chain: string, address: string) {
  const configReader = new ConfigReader(DISCOVERY_ROOT_PATH)
  const discovered = configReader.readDiscovery(project, chain)
  const contract = discovered.contracts.find(
    (x) => x.address.toString() === address,
  )

  if (!contract) {
    throw new Error('Contract not found!')
  }

  const projectPath = join(
    DISCOVERY_ROOT_PATH,
    'discovery',
    project,
    chain,
    '.flat',
  )

  const paths = [
    join(projectPath, `${contract.name}.sol`),
    join(projectPath, `${contract.name}-${contract.address}.sol`),
    join(projectPath, contract.name),
    join(projectPath, `${contract.name}-${contract.address}`),
  ]
  let path: string | undefined
  for (const candidate of paths) {
    if (!existsSync(candidate)) {
      continue
    }

    if (!statSync(candidate).isDirectory()) {
      path = candidate
      break
    }

    const items = readdirSync(candidate)
    for (const item of items) {
      if (!item.endsWith('.p.sol') && item.endsWith('.sol')) {
        path = join(candidate, item)
      }
    }
  }

  if (path) {
    spawn('code', [path])
  }
}
