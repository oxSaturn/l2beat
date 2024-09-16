import { ConfigReader } from '@l2beat/discovery'
import React from 'react'
import { Page } from '../common/Page'
import { DISCOVERY_ROOT_PATH } from '../common/constants'
import { Field } from '../components/Field/Field'
import { FieldValue, parseFieldValue } from '../components/Field/type'

export interface ProjectPageProps {
  projectName: string
  chainName: string
}

export function ProjectPage(props: ProjectPageProps) {
  const configReader = new ConfigReader(DISCOVERY_ROOT_PATH)
  const config = configReader.readConfig(props.projectName, props.chainName)
  const discovery = configReader.readDiscovery(
    props.projectName,
    props.chainName,
  )

  interface Contract {
    name: string
    isEOA: boolean
    address: string
    chain: string
    fields: Field[]
  }

  interface Field {
    name: string
    value: FieldValue
    description?: string
  }

  const addressNameMap: Record<string, string> = {}
  for (const override of config.overrides) {
    if (override.ignoreDiscovery) {
      addressNameMap[override.address.toString()] = '<ignored>'
    }
  }
  for (const contract of discovery.contracts) {
    addressNameMap[contract.address.toString()] = contract.name
    const $implementation = contract.values?.['$implementation']
    const values = Array.isArray($implementation)
      ? $implementation
      : [$implementation]
    for (const item of values) {
      if (typeof item === 'string') {
        addressNameMap[item] ??= '<impl>'
      }
    }
  }
  for (const eoa of discovery.eoas) {
    addressNameMap[eoa.address.toString()] = 'EOA'
  }

  const contracts: Contract[] = []
  for (const contract of discovery.contracts) {
    const fields: Field[] = []
    for (const [name, value] of Object.entries(contract.values ?? {})) {
      const field: Field = {
        name,
        value: parseFieldValue(value, addressNameMap),
      }
      const meta = contract.fieldMeta?.[name]
      if (meta?.description) {
        field.description = meta.description
      }
      fields.push(field)
    }
    contracts.push({
      name: contract.name,
      isEOA: false,
      address: contract.address.toString(),
      chain: config.chain,
      fields,
    })
  }

  return (
    <Page>
      <main className="mx-auto max-w-[1200px] p-4">
        <nav className="mb-4">
          <a href="/" className="font-mono text-blue-700">
            ← Home
          </a>
        </nav>
        <h1 className="mb-4 font-mono text-xl">
          <strong>{config.name}</strong> <small>{config.chain}</small>
        </h1>
        <ol>
          {contracts.map((entry, i) => (
            <li key={i} className="mb-4">
              <div id={entry.address} className="font-mono text-lg">
                <strong>{entry.name}</strong>{' '}
                <a className="text-blue-700 text-sm" href={`#${entry.address}`}>
                  {entry.address}
                </a>
              </div>
              <ol>
                {entry.fields.map((field, i) => (
                  <Field
                    key={i}
                    name={field.name}
                    description={field.description}
                    value={field.value}
                    level={0}
                  />
                ))}
              </ol>
            </li>
          ))}
          {discovery.eoas.map((eoa, i) => (
            <li key={i} className="mb-4">
              <div id={eoa.address.toString()} className="font-mono text-lg">
                <strong>EOA</strong>{' '}
                <a className="text-blue-700 text-sm" href={`#${eoa.address}`}>
                  {eoa.address}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </Page>
  )
}
