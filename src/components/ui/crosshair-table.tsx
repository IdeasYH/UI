import { useId, useState, type TableHTMLAttributes } from 'react'
import './crosshair-table.css'

/** Flat tables only: cellIndex does not describe logical columns with merged cells. */
export function CrosshairTable({ children, className = '', onPointerOver, onPointerLeave, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  const id = `crosshair-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const [active, setActive] = useState<{ row: number; column: number } | null>(null)
  return <>
    {active && <style>{`
      #${id} tr > :nth-child(${active.column + 1}),
      #${id} tr[data-crosshair-row="${active.row}"] > * { background-color: var(--crosshair-soft, #eee8fc); }
      #${id} tr[data-crosshair-row="${active.row}"] > :nth-child(${active.column + 1}) { background-color: var(--crosshair-intersection, #ddd1f7); }
    `}</style>}
    <table {...props} id={id} className={`crosshair-table ${className}`} onPointerOver={event => {
      onPointerOver?.(event)
      if (event.pointerType === 'touch') return
      const cell = (event.target as HTMLElement).closest('td, th') as HTMLTableCellElement | null
      if (!cell || cell.closest('table') !== event.currentTarget) { setActive(null); return }
      const row = cell.parentElement as HTMLTableRowElement
      row.setAttribute('data-crosshair-row', String(row.rowIndex))
      setActive(previous => previous?.row === row.rowIndex && previous.column === cell.cellIndex ? previous : { row: row.rowIndex, column: cell.cellIndex })
    }} onPointerLeave={event => { onPointerLeave?.(event); setActive(null) }}>
      {children}
    </table>
  </>
}
