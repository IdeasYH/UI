import { useId, type CSSProperties } from 'react'
import './segmented-control.css'

export type SegmentOption = { value: string; label: string; disabled?: boolean }

/** 保存一个互斥值；内容区域由宿主根据 value 渲染。 */
export function SegmentedControl({ label, options, value, onChange }: {
  label: string
  options: readonly SegmentOption[]
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  const enabled = options.filter(option => !option.disabled)

  function focus(value: string) {
    document.getElementById(`${id}-${options.findIndex(option => option.value === value)}`)?.focus()
  }

  function move(current: number, direction: number) {
    if (!enabled.length) return
    const index = enabled.findIndex(option => option.value === options[current]?.value)
    const next = enabled[(index + direction + enabled.length) % enabled.length]
    onChange(next.value)
    focus(next.value)
  }

  const selectedIndex = Math.max(0, options.findIndex(option => option.value === value))
  return <div className="segmented-control" role="radiogroup" aria-label={label} data-empty={!options.length} style={{ '--segment-count': Math.max(1, options.length), '--selected-index': selectedIndex } as CSSProperties}>
    {options.map((option, index) => <button
      key={option.value}
      id={`${id}-${index}`}
      type="button"
      role="radio"
      aria-checked={value === option.value}
      disabled={option.disabled}
      tabIndex={value === option.value || (!options.some(item => item.value === value) && enabled[0]?.value === option.value) ? 0 : -1}
      onClick={() => onChange(option.value)}
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); move(index, 1) }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); move(index, -1) }
        if (event.key === 'Home' && enabled.length) { event.preventDefault(); onChange(enabled[0].value); focus(enabled[0].value) }
        if (event.key === 'End' && enabled.length) { event.preventDefault(); onChange(enabled[enabled.length - 1].value); focus(enabled[enabled.length - 1].value) }
      }}
    >{option.label}</button>)}
  </div>
}
