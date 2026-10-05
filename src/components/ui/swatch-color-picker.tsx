import type { CSSProperties } from 'react'
import './swatch-color-picker.css'

export const swatchColors = [
  '#e11d48', '#f472b6', '#fb923c', '#facc15', '#84cc16',
  '#10b981', '#0ea5e9', '#3b82f6', '#8b5cf6', '#a78bfa',
] as const

export function SwatchColorPicker({ label, colors = swatchColors, value, onChange }: {
  label: string
  colors?: readonly string[]
  value: string
  onChange: (color: string) => void
}) {
  return <div className="swatch-color-picker" role="group" aria-label={label}>
    <div className="swatch-color-picker-panel">
    <div className="swatch-color-picker-items">
      {colors.map(color => <button
        key={color}
        type="button"
        className="swatch-color-picker-item"
        style={{ '--swatch-color': color } as CSSProperties}
        data-color={color}
        aria-label={`选择颜色 ${color}`}
        aria-pressed={value.toLowerCase() === color.toLowerCase()}
        onClick={() => onChange(color)}
      />)}
    </div>
    {colors.length === 0 && <p className="swatch-color-picker-empty">暂无可选颜色</p>}
    </div>
  </div>
}
