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
    description?: string
    fields: Field[]
  }

  interface Field {
    name: string
    value: FieldValue
    untracked?: boolean
    description?: string
  }

  const addressNameMap: Record<string, string> = {}
  for (const override of config.overrides) {
    if (override.ignoreDiscovery) {
      addressNameMap[override.address.toString()] = '<ignored/toplevel>'
    }
    if (override.ignoreRelatives) {
      const contract = discovery.contracts.find(
        (x) => x.address === override.address,
      )
      for (const key of override.ignoreRelatives) {
        const value = contract?.values?.[key]
        if (typeof value === 'string') {
          addressNameMap[value] = '<ignored/relative>'
        }
      }
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
      field.untracked = contract.ignoreInWatchMode?.includes(name)
      fields.push(field)
    }
    contracts.push({
      name: contract.name,
      isEOA: false,
      address: contract.address.toString(),
      chain: config.chain,
      description: contract.descriptions?.join('; '),
      fields,
    })
  }

  return (
    <Page>
      <main className="mx-auto max-w-[1200px] p-4 pl-[304px]">
        <nav className="fixed top-0 h-full w-[300px] translate-x-[-304px] overflow-auto p-4">
          <div className="mb-8 h-[48px] border-gray-400 border-b">
            <nav className="mb-4">
              <a href="/" className="font-mono text-blue-700">
                ← Home
              </a>
            </nav>
          </div>
          <ol>
            {contracts.map((contract, i) => (
              <li key={i}>
                <a
                  className="text-blue-700 text-sm"
                  href={`#${contract.address}`}
                >
                  {contract.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mb-8 h-[48px] border-gray-400 border-b">
          <h1 className="font-mono text-xl">
            <strong>{config.name}</strong> <small>{config.chain}</small>
          </h1>
        </div>
        <ol>
          {contracts.map((contract, i) => (
            <li key={i} className="mb-8">
              <div id={contract.address} className="font-mono text-lg">
                <strong>{contract.name}</strong>{' '}
                <a
                  className="text-blue-700 text-sm"
                  href={`#${contract.address}`}
                >
                  {contract.address}
                </a>
              </div>
              <div>
                <button
                  hx-get={`/code?project=${config.name}&chain=${config.chain}&address=${contract.address}`}
                  className="text-pink-700"
                >
                  [code]
                </button>
              </div>
              {contract.description && (
                <p className="col-span-2 font-serif text-gray-700 italic">
                  {contract.description}
                </p>
              )}
              <ol>
                {contract.fields.map((field, i) => (
                  <Field
                    key={i}
                    name={field.name}
                    description={field.description}
                    untracked={field.untracked}
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
