import { useId, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronRight, Star } from 'lucide-react'
import { TriStateCheckbox } from './tri-state-checkbox'
import { filterOptions, selectionState, toggleBranch, type SelectOption, type SelectionNode } from './selection-model'
import './selection-controls.css'

export function ToggleSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="demo-switch-control" onClick={() => onChange(!checked)}>
    <span className="demo-switch-track"><span /></span><span>{label} · {checked ? '开' : '关'}</span>
  </button>
}

export function StarRating({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [preview, setPreview] = useState<number | null>(null)
  const displayed = preview ?? value
  return <div className="rating-example"><div className="rating-stars" role="group" aria-label="评分，支持半星" onMouseLeave={() => setPreview(null)}>
    {Array.from({ length: 5 }, (_, index) => <span className="rating-star" key={index}>
      <Star aria-hidden="true" className="rating-outline" />
      <span className="rating-fill" style={{ width: `${Math.max(0, Math.min(1, displayed - index)) * 100}%` }}><Star aria-hidden="true" /></span>
      {[.5, 1].map(half => <button type="button" key={half} className={`rating-hit rating-hit-${half === .5 ? 'left' : 'right'}`} aria-label={`${index + half} 星`} aria-pressed={value === index + half} onMouseEnter={() => setPreview(index + half)} onFocus={() => setPreview(index + half)} onBlur={() => setPreview(null)} onClick={() => onChange(index + half)} />)}
    </span>)}
  </div><p role="status">{preview === null ? `已确认 ${value} 分` : `预览 ${preview} 分 · 已确认 ${value} 分`}</p></div>
}

export function SearchSelect({ label, options, value, onChange }: { label: string; options: readonly SelectOption[]; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const searchable = options.length > 5
  const filtered = filterOptions(options, query)
  function choose(next: string) { onChange(next); setOpen(false); setQuery(''); trigger.current?.focus() }
  return <div className="selection-field"><span id={`${id}-label`}>{label}</span><div className="select-control" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setQuery('') } }} onKeyDown={event => {
    if (event.key === 'Escape') { setOpen(false); setQuery(''); trigger.current?.focus() }
  }}>
    <button ref={trigger} type="button" aria-labelledby={`${id}-label ${id}-value`} aria-expanded={open} aria-haspopup="listbox" aria-controls={`${id}-options`} className="select-trigger" onClick={() => { setOpen(!open); setQuery(''); setActive(0) }}><span id={`${id}-value`}>{options.find(option => option.value === value)?.label ?? '请选择'}</span><ChevronDown size={17} /></button>
    {open && <div className="select-popup">
      {searchable && <input autoFocus aria-label={`${label}搜索`} role="combobox" aria-expanded="true" aria-controls={`${id}-options`} aria-autocomplete="list" aria-activedescendant={filtered[active] ? `${id}-option-${active}` : undefined} placeholder="输入中文、拼音或首字母筛选" value={query} onChange={event => { setQuery(event.target.value); setActive(0) }} onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setActive(current => Math.max(0, Math.min(filtered.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1)))) }
        if (event.key === 'Enter' && filtered[active]) { event.preventDefault(); choose(filtered[active].value) }
      }} />}
      <div id={`${id}-options`} role="listbox" aria-label={label}>{filtered.map((option, index) => <button type="button" role="option" id={`${id}-option-${index}`} aria-selected={value === option.value} className="select-option" data-active={searchable && index === active} key={option.value} onMouseDown={event => event.preventDefault()} onClick={() => choose(option.value)}>{option.label}{value === option.value && <Check size={17} aria-hidden="true" />}</button>)}</div>
      {!filtered.length && <p className="selection-empty" role="status">没有匹配项</p>}
    </div>}
  </div></div>
}

export function Cascader({ label, nodes, value, onChange }: { label: string; nodes: readonly SelectionNode[]; value: readonly string[]; onChange: (value: string[]) => void }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<readonly string[]>(value)
  const columns: (readonly SelectionNode[])[] = [nodes]
  let level = nodes
  const labels: string[] = []
  for (const id of value) { const node = level.find(item => item.value === id); if (!node) break; labels.push(node.label); level = node.children ?? [] }
  level = nodes
  for (const id of draft) { const node = level.find(item => item.value === id); if (!node?.children?.length) break; columns.push(node.children); level = node.children }
  return <div className="selection-field cascader-field"><span>{label}</span><div className="select-control" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}>
    <button type="button" className="select-trigger" aria-label={`${label}：${labels.join(' / ') || '请选择'}`} aria-expanded={open} onClick={() => { setDraft(value); setOpen(!open) }}>{labels.join(' / ') || '请选择省 / 市 / 区'}<ChevronDown size={17} /></button>
    {open && <div className="select-popup cascade-columns">{columns.map((column, index) => <div className="cascade-column" key={index} role="group" aria-label={`第 ${index + 1} 级`}>{column.map(node => <button type="button" key={node.value} className="select-option" aria-pressed={draft[index] === node.value} onClick={() => {
      const path = [...draft.slice(0, index), node.value]
      setDraft(path)
      // 完整选到叶子才提交，切换上级的草稿截断旧下级。
      if (!node.children?.length) { onChange(path); setOpen(false) }
    }}>{node.label}{node.children?.length ? <ChevronRight size={15} /> : draft[index] === node.value ? <Check size={15} /> : null}</button>)}</div>)}</div>}
  </div></div>
}

export function TreeSelect({ nodes, value, onChange }: { nodes: readonly SelectionNode[]; value: readonly string[]; onChange: (value: string[]) => void }) {
  const [collapsed, setCollapsed] = useState<string[]>([])
  function render(items: readonly SelectionNode[]) {
    return <ul>{items.map(node => {
      const state = selectionState(node, value)
      const expanded = !collapsed.includes(node.value)
      return <li key={node.value}><div className="tree-select-row">
        {node.children?.length ? <button type="button" className="tree-expand" aria-label={`${expanded ? '收起' : '展开'}${node.label}`} aria-expanded={expanded} onClick={() => setCollapsed(expanded ? [...collapsed, node.value] : collapsed.filter(id => id !== node.value))}>{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button> : <span className="tree-expand" />}
        <label><TriStateCheckbox checked={state === 'all'} indeterminate={state === 'mixed'} onChange={() => onChange(toggleBranch(node, value))} />{node.label}</label>
      </div>{expanded && node.children?.length ? render(node.children) : null}</li>
    })}</ul>
  }
  return <div className="tree-select" role="group" aria-label="组织树选择">{render(nodes)}<p className="form-preview-result" role="status">已选择 {value.length} 个末级节点</p></div>
}
