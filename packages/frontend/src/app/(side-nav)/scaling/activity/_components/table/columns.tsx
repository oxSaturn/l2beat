import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { PrimaryValueCell } from '~/components/table/cells/primary-value-cell'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { type CommonProjectColumnsOptions } from '~/components/table/utils/common-project-columns/common-project-columns'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { formatInteger } from '~/utils/number-format/format-integer'
import { formatUops } from '~/utils/number-format/format-uops'
import { formatUopsRatio } from '~/utils/number-format/format-uops-ratio'
import { SyncStatusWrapper } from '../../../finality/_components/table/sync-status-wrapper'
import { type ActivityMetric } from '../activity-metric-context'
import { MaxUopsCell } from './max-uops-cell'

export type ScalingActivityTableEntry = ScalingActivityEntry & {
  data: {
    change: number
    pastDayCount: number
    summedCount: number
    maxCount: {
      value: number
      timestamp: number
    }
  }
}

const columnHelper = createColumnHelper<ScalingActivityTableEntry>()

export const getScalingActivityColumns = (
  metric: ActivityMetric,
  opts?: CommonProjectColumnsOptions,
) => [
  ...getScalingCommonProjectColumns(columnHelper, opts),
  columnHelper.accessor('data.pastDayCount', {
    header: `Past day ${metric === 'uops' ? 'UOPS' : 'TPS'}`,
    cell: (ctx) => {
      const data = ctx.row.original.data
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
          <PrimaryValueCell>{formatUops(data.pastDayCount)}</PrimaryValueCell>
        </SyncStatusWrapper>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      headClassName: 'max-w-[60px]',
      tooltip: `${metric === 'uops' ? 'User operations' : 'Transactions'} per second averaged over the past day.`,
    },
  }),
  columnHelper.accessor('data.maxCount.value', {
    header: `Max ${metric === 'uops' ? 'UOPS' : 'TPS'}`,
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
          <MaxUopsCell
            maxUops={data.maxCount.value}
            timestamp={data.maxCount.timestamp}
          />
        </SyncStatusWrapper>
      )
    },
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('data.summedCount', {
    header: '30D Count',
    cell: (ctx) => {
      const data = ctx.row.original.data
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
          <ValueWithPercentageChange
            change={data.change}
            className="font-medium"
            containerClassName="justify-end"
          >
            {formatInteger(data.summedCount)}
          </ValueWithPercentageChange>
        </SyncStatusWrapper>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('data.ratio', {
    header: 'UOPS/TPS RATIO',
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return <NoDataBadge />
      }
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
          <PrimaryValueCell>{formatUopsRatio(data.ratio)}</PrimaryValueCell>
        </SyncStatusWrapper>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'The ratio of user operations to transactions over the past day. A high ratio indicates that for some transactions multiple individual user operations are bundled in a single transaction.',
    },
  }),
]
