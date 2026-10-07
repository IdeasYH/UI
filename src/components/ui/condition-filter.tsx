import { useEffect, useId, useRef, useState } from 'react'
import { dateLabels, matchesFilterSearch, formatDay, isConditionReady, operatorLabels, operatorsFor, type DateMode, type FilterCondition, type FilterField, type FilterOperator, type FilterValue } from './condition-filter-model'
import './condition-filter.css'

type Choice = { value: string; label: string; pinyin?: string; initials?: string; color?: string }
function Picker({ label, value, options, onChange, searchable = false }: { label: string; value: string; options: readonly Choice[]; onChange: (value: string) => void; searchable?: boolean }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  const selected = options.find(option => option.value === value)
  const filtered = options.filter(option => matchesFilterSearch(option, query))
  return <div className="cf-picker" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} onKeyDown={event => {
    if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus() }
    if (open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault()
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=option]'))
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
      buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus()
    }
  }}>
    <button type="button" ref={trigger} className="cf-control" aria-label={label} aria-expanded={open} aria-haspopup="listbox" aria-controls={open ? id : undefined} onClick={() => { setOpen(!open); setQuery('') }}><span className={selected ? '' : 'cf-placeholder'}>{selected?.label ?? '请选择选项'}</span><span aria-hidden>⌄</span></button>
    {open && <div className="cf-menu">
      {searchable && <input autoFocus aria-label={`${label}搜索`} placeholder="中文、拼音或首字母" value={query} onChange={event => setQuery(event.target.value)} />}
      <div id={id} role="listbox" aria-label={label}>{filtered.map(option => <button type="button" role="option" aria-selected={value === option.value} key={option.value} onClick={() => { onChange(option.value); setOpen(false); trigger.current?.focus() }}><span className={option.color ? 'cf-tag' : ''} style={option.color ? { background: option.color } : undefined}>{option.label}</span>{value === option.value && <span className="cf-tick">✓</span>}</button>)}{!filtered.length && <p className="cf-empty">没有匹配选项</p>}</div>
    </div>}
  </div>
}

function Calendar({ value, onChange, label, today }: { value: string; onChange: (value: string) => void; label: string; today: Date }) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const trigger = useRef<HTMLButtonElement>(null)
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - (month.getDay() + 6) % 7)
  return <div className="cf-calendar-anchor" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus() } }}>
    <button type="button" className="cf-control" ref={trigger} aria-label={label} aria-expanded={open} onClick={() => { if (!open) { const date = value ? new Date(`${value}T12:00:00`) : today; setMonth(new Date(date.getFullYear(), date.getMonth(), 1)) } setOpen(!open) }}><span className={value ? '' : 'cf-placeholder'}>{value || 'yyyy/mm/dd'}</span><span aria-hidden>⌄</span></button>
    {open && <div className="cf-calendar" role="dialog" aria-label="选择具体日期"><div className="cf-calendar-heading"><strong>{month.getFullYear()}年 {month.getMonth() + 1}月</strong><button type="button" aria-label="上个月" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><button type="button" aria-label="下个月" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></div><div className="cf-days">{['一', '二', '三', '四', '五', '六', '日'].map(day => <span key={day}>{day}</span>)}{Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
      const key = formatDay(date)
      return <button type="button" key={key} aria-label={key} aria-pressed={value === key} aria-current={key === formatDay(today) ? 'date' : undefined} className={date.getMonth() !== month.getMonth() ? 'cf-outside' : ''} onClick={() => { onChange(key); setOpen(false); trigger.current?.focus() }}>{date.getDate()}</button>
    })}</div></div>}
  </div>
}

export function ConditionFilter({ fields, value, onChange, today = new Date(), defaultOpen = false }: { fields: readonly FilterField[]; value: FilterValue; onChange: (value: FilterValue) => void; today?: Date; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  const nextId = useRef(0)
  const activeCount = value.conditions.filter(condition => isConditionReady(condition, fields)).length
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  const update = (conditionId: string, patch: Partial<FilterCondition>) => onChange({ ...value, conditions: value.conditions.map(condition => condition.id === conditionId ? { ...condition, ...patch } : condition) })
  return <div className="cf-root" ref={root} onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() } }}>
    <button ref={trigger} type="button" className={`cf-trigger ${open || activeCount ? 'cf-trigger-active' : ''}`} aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => { if (!open && !value.conditions.length && fields.length) onChange({ ...value, conditions: [{ id: `${id}-${++nextId.current}`, field: fields[0].id, operator: 'eq', value: '', dateMode: 'exact' }] }); setOpen(!open) }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M3 4h18v3l-7 7v6l-4-2v-4L3 7Z"/></svg>筛选{activeCount > 0 && <span>{activeCount}</span>}</button>
    {open && <section id={id} className="cf-panel" aria-label="设置筛选条件"><header>设置筛选条件 <span title="完整条件即时生效，未填写条件暂不参与筛选">ⓘ</span></header>
      {value.conditions.length > 0 && <div className="cf-conjunction">符合以下 <Picker label="条件组合方式" value={value.conjunction} options={[{ value: 'all', label: '所有' }, { value: 'any', label: '任一' }]} onChange={conjunction => onChange({ ...value, conjunction: conjunction as FilterValue['conjunction'] })} /> 条件</div>}
      <div className="cf-rows">{value.conditions.map((condition, index) => {
        const field = fields.find(item => item.id === condition.field)
        return <div className="cf-row" key={condition.id}>
          <Picker label={`条件 ${index + 1} 字段`} value={condition.field} options={fields.map(item => ({ value: item.id, label: item.label, pinyin: item.pinyin, initials: item.initials }))} searchable onChange={fieldId => update(condition.id, { field: fieldId, operator: 'eq', value: '', dateMode: 'exact' })} />
          <Picker label={`条件 ${index + 1} 运算符`} value={condition.operator} options={operatorsFor(field?.type ?? 'text').map(operator => ({ value: operator, label: operatorLabels[operator] }))} onChange={operator => update(condition.id, { operator: operator as FilterOperator })} />
          <div className="cf-value">{condition.operator === 'empty' || condition.operator === 'notEmpty' ? <span className="cf-placeholder">无需填写值</span> : field?.type === 'select' ? <Picker label={`条件 ${index + 1} 选项`} searchable options={field.options ?? []} value={condition.value} onChange={selected => update(condition.id, { value: selected })} /> : field?.type === 'date' ? <><Picker label={`条件 ${index + 1} 日期范围`} value={condition.dateMode ?? 'exact'} options={Object.entries(dateLabels).map(([key, label]) => ({ value: key, label }))} onChange={mode => update(condition.id, { dateMode: mode as DateMode, value: '' })} />{(!condition.dateMode || condition.dateMode === 'exact') && <Calendar label={`条件 ${index + 1} 具体日期`} value={condition.value} onChange={date => update(condition.id, { value: date })} today={today} />}</> : <input aria-label={`条件 ${index + 1} 值`} type={field?.type === 'number' ? 'number' : 'text'} placeholder="请输入" value={condition.value} onChange={event => update(condition.id, { value: event.target.value })} />}</div>
          <button type="button" className="cf-remove" aria-label={`删除条件 ${index + 1}`} onClick={() => onChange({ ...value, conditions: value.conditions.filter(item => item.id !== condition.id) })}>×</button>
        </div>
      })}</div>
      <button type="button" className="cf-add" disabled={!fields.length} onClick={() => onChange({ ...value, conditions: [...value.conditions, { id: `${id}-${++nextId.current}`, field: fields[0].id, operator: 'eq', value: '', dateMode: 'exact' }] })}>＋ 添加条件</button>
      <footer><span>完整条件即时生效</span>{value.conditions.length > 0 && <button type="button" onClick={() => onChange({ ...value, conditions: [] })}>清空条件</button>}</footer>
    </section>}
  </div>
}
