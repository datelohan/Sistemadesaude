import { type ReactNode } from 'react'
import { Skeleton } from '../atoms/Skeleton.js'
import { EmptyState } from '../molecules/EmptyState.js'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyTitle = 'Nenhum registro encontrado',
  emptyDescription,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-left font-medium text-gray-600 ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-gray-700 ${col.className ?? ''}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {!loading && data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} className="py-12" />
      )}
    </div>
  )
}
