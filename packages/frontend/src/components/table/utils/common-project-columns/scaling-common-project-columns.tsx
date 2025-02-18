import { type ColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '../../cells/project-name-cell'
import {
  type CommonProjectColumnsEntry,
  type CommonProjectColumnsOptions,
  getCommonProjectColumns,
} from './common-project-columns'

export function getScalingCommonProjectColumns<
  T extends CommonProjectColumnsEntry,
>(columnHelper: ColumnHelper<T>, opts?: CommonProjectColumnsOptions) {
  return [
    ...getCommonProjectColumns(columnHelper, opts),
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
      meta: opts?.activity
        ? {
            headClassName: 'w-0 min-w-[154px]',
          }
        : undefined,
    }),
  ]
}
