import type * as React from 'react'
import { cn } from '../../lib/utils'

export function Table({ className, containerClassName, containerProps, ...props }: React.TableHTMLAttributes<HTMLTableElement> & {
  containerClassName?: string
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}) {
  return <div {...containerProps} className={cn('ui-table-container', containerClassName, containerProps?.className)}>
    <table className={cn('ui-table', className)} {...props} />
  </div>
}

export function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead {...props} /> }
export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} /> }
export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) { return <tr {...props} /> }
export function TableHead(props: React.ThHTMLAttributes<HTMLTableCellElement>) { return <th {...props} /> }
export function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td {...props} /> }
