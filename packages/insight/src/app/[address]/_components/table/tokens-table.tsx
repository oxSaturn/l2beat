'use client'

import {
  type Row,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { Card } from '~/components/core/card'
import { CustomLink } from '~/components/core/custom-link'
import { BasicTable } from '~/components/core/table/basic-table'
import { TokenWithChainLogo } from '~/components/token-with-chain-logo'
import { useTable } from '~/hooks/use-table'
import { useReport } from '../report-context'
import { tokenColumns } from './columns'
import {
  type TokenEntry,
  type UnderlyingTokenEntry,
  getTokenEntries,
} from './get-token-entries'

export function TokensTable() {
  const report = useReport()
  const entries = useMemo(() => getTokenEntries(report), [report])

  const table = useTable({
    columns: tokenColumns,
    data: entries,
    getRowCanExpand: (row) => row.original.underlyingTokens.length > 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),

    initialState: {
      sorting: [{ id: 'value', desc: true }],
    },
  })

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between md:mb-6">
        <h2 className="text-2xl font-bold">Assets</h2>
      </div>
      <BasicTable table={table} renderSubComponent={TokenDetails} />
    </Card>
  )
}

function TokenDetails({ row }: { row: Row<TokenEntry> }) {
  return (
    <div>
      <div>
        <TokenDetailsItem token={row.original} />
      </div>
      {row.original.underlyingTokens.map((token) => (
        <div key={token.address}>
          <div className="ml-[15.5px] h-12 border-l border-highlight-secondary" />
          <TokenDetailsItem token={token} />
        </div>
      ))}
    </div>
  )
}

function TokenDetailsItem({
  token,
}: { token: TokenEntry | UnderlyingTokenEntry }) {
  return (
    <div className="-my-2 flex items-center gap-6">
      <TokenWithChainLogo
        token={{ symbol: token.symbol, logoUrl: token.logoUrl }}
        chain={{
          name: token.chain.name,
          logoUrl: token.chain.logoUrl,
        }}
      />
      <div>
        <p className="text-lg">
          <strong>{token.name}</strong> on {token.chain.name}
        </p>
        {token.address === 'native' ? (
          <p className="text-xs text-secondary">Native/gas token</p>
        ) : token.chain.name === 'Ethereum' ? (
          <CustomLink
            className="text-xs"
            href={`https://etherscan.io/address/${token.address}`}
          >
            {token.address}
          </CustomLink>
        ) : (
          <p className="text-xs">{token.address}</p>
        )}
        <p className="text-xs">Secured by {token.managedBy}</p>
      </div>
    </div>
  )
}
