'use client'

import {
  type RowModel,
  type Table,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { env } from '~/env'
import { useTable } from '~/hooks/use-table'
import { type ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { getScalingActivityColumns } from './columns'

interface Props {
  entries: ScalingActivityEntry[]
  rollups?: boolean
  customSortedRowModel?: (
    table: Table<ScalingActivityEntry>,
  ) => () => RowModel<ScalingActivityEntry>
}

export function ScalingActivityTable({
  entries,
  rollups,
  customSortedRowModel,
}: Props) {
  const table = useTable({
    columns: getScalingActivityColumns({
      activity:
        !!customSortedRowModel && env.NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING,
    }),
    data: entries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: customSortedRowModel ?? getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'data_pastDayTps', desc: true }],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })
  return rollups ? <RollupsTable table={table} /> : <BasicTable table={table} />
}
