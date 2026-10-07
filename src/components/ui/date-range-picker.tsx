import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, CalendarRange, ChevronLeft, ChevronRight, History, PanelsTopLeft, Sun } from 'lucide-react'
import { PortableButton } from './portable-button'
import { datePresets, monthDays, orderRange, presetRange, shiftMonth, type DateRange } from './date-range-model'
import './date-range-picker.css'

const leadingPresets = datePresets.slice(0, 5)
const trailingPresets = datePresets.slice(5)
const weekdays = ['一', '二', '三', '四', '五', '六', '日']

// Keep month navigation overlays from rebuilding the date grid. Data sets must
// be replaced (not mutated) when their contents change, as for other React props.
const CalendarMonth = memo(function CalendarMonth({ month, start, end, today, dataDates, onSelect }: {
  month: string; start: string; end: string; today: string; dataDates: ReadonlySet<string>; onSelect: (day: string) => void
}) {
  const { days, offset } = useMemo(() => monthDays(month), [month])
  return <section className="date-month" aria-label={`${month}日历`}><h3>{month.slice(0, 4)} 年 {month.slice(5)} 月</h3><div className="date-grid">{weekdays.map(day => <span className="date-weekday" key={day}>{day}</span>)}{Array.from({ length: offset }, (_, index) => <span key={`empty-${index}`} />)}{days.map(day => {
    const selected = day >= start && day <= end
    const endpoint = day === start || day === end
    const hasData = dataDates.has(day)
    return <button type="button" key={day} className="date-day" aria-label={`${day}${hasData ? ' 有数据' : ' 无数据'}`} aria-pressed={selected} aria-current={day === today ? 'date' : undefined} data-filled={selected && hasData} data-endpoint={endpoint} onClick={() => onSelect(day)}>{Number(day.slice(-2))}</button>
  })}</div></section>
})

export type DateRangePickerProps = { today: string; value: DateRange; onChange: (range: DateRange) => void; dataDates: ReadonlySet<string> }

export function DateRangePicker({ today, value, onChange, dataDates }: DateRangePickerProps) {
  const [open, setOpen] = useState(true)
  const [month, setMonth] = useState(value.start.slice(0, 7))
  const [draft, setDraft] = useState(value)
  const [anchor, setAnchor] = useState<string | null>(null)
  const [preset, setPreset] = useState<string>('')
  const [monthPickerOpen, setMonthPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(Number(month.slice(0, 4)))
  const pickerRef = useRef<HTMLDivElement>(null)
  const monthButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!monthPickerOpen) return
    pickerRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus()
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target) && !monthButtonRef.current?.contains(event.target)) setMonthPickerOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [monthPickerOpen])
  function chooseMonth(next: string) {
    setMonth(next)
    setMonthPickerOpen(false)
    monthButtonRef.current?.focus()
  }
  // 父页面重置或切换记录时，外部已确认值优先于尚未提交的草稿。
  // 按日期字段比较，避免父页面仅重建相同值对象时打断用户的选择。
  useEffect(() => {
    setDraft(previous => previous.start === value.start && previous.end === value.end ? previous : { start: value.start, end: value.end })
    setMonth(value.start.slice(0, 7))
    setAnchor(null)
    setPreset('')
    setMonthPickerOpen(false)
  }, [value.start, value.end])
  function shortcut(name: typeof datePresets[number]) { const range = presetRange(name, today); setDraft(range); setMonth(range.start.slice(0, 7)); setAnchor(null); setPreset(name); onChange(range); setOpen(false); setMonthPickerOpen(false) }
  const select = useCallback((day: string) => { setPreset(''); if (!anchor) { setAnchor(day); setDraft({ start: day, end: day }) } else { setDraft(orderRange(anchor, day)); setAnchor(null) } }, [anchor])
  const visibleMonths = useMemo(() => [month, shiftMonth(month, 1)], [month])
  return <div className="date-range-demo">
    <PortableButton type="button" variant="outline" aria-expanded={open} onClick={() => { setOpen(!open); setMonthPickerOpen(false); setDraft(value); setAnchor(null); setPreset('') }}>日期区间：{value.start} → {value.end}</PortableButton>
    {open && <div className="date-range-panel">
      <div className="date-range-toolbar"><div className="date-shortcuts">{leadingPresets.map(name => <button type="button" key={name} className={name === '今天' || name === '昨天' || name === '本周' ? 'date-icon-shortcut' : undefined} aria-pressed={preset === name} onClick={() => shortcut(name)}>{name === '今天' && <Sun className="date-sun-icon" size={14} aria-hidden="true" />}{name === '昨天' && <History size={14} aria-hidden="true" />}{name === '本周' && <svg className="date-week-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><rect x="2" y="4" width="20" height="17" rx="3" /><path d="M7 2v4M17 2v4M2 9h20" /><rect x="4" y="12" width="16" height="5" rx="1.5" fill="currentColor" fillOpacity=".18" stroke="none" /><path d="M5 14.5h.1m2.2 0h.1m2.2 0h.1m2.2 0h.1m2.2 0h.1m2.2 0h.1m2.2 0h.1" strokeWidth="1.8" /></svg>}<span>{name}</span></button>)}</div>
        <div className="date-month-nav" role="group" aria-label="切换日历显示月份"><button type="button" title="查看上一年，不改变已选区间" onClick={() => setMonth(shiftMonth(month, -12))}>上年</button><button type="button" className="date-month-step" aria-label="上个月" title="查看上个月，不改变已选区间" onClick={() => setMonth(shiftMonth(month, -1))}><ChevronLeft size={22} strokeWidth={3} aria-hidden="true" /></button><button ref={monthButtonRef} type="button" className="date-month-trigger" aria-label="选择显示年月" aria-haspopup="dialog" aria-expanded={monthPickerOpen} onClick={() => { setPickerYear(Number(month.slice(0, 4))); setMonthPickerOpen(!monthPickerOpen) }}>{month.slice(0, 4)}年{month.slice(5)}月<CalendarDays size={13} aria-hidden="true" /></button><button type="button" className="date-month-step" aria-label="下个月" title="查看下个月，不改变已选区间" onClick={() => setMonth(shiftMonth(month, 1))}><ChevronRight size={22} strokeWidth={3} aria-hidden="true" /></button><button type="button" title="查看下一年，不改变已选区间" onClick={() => setMonth(shiftMonth(month, 12))}>下年</button></div>
        <div className="date-shortcuts">{trailingPresets.map(name => <button type="button" key={name} className={name === '本月' || name === '本季度' || name === '本年' ? 'date-icon-shortcut' : undefined} aria-pressed={preset === name} onClick={() => shortcut(name)}>{name === '本月' && <CalendarDays className="date-month-icon" size={16} aria-hidden="true" />}{name === '本季度' && <PanelsTopLeft size={14} aria-hidden="true" />}{name === '本年' && <CalendarRange className="date-year-icon" size={15} aria-hidden="true" />}<span>{name}</span></button>)}</div>
      </div>
      {monthPickerOpen && <div ref={pickerRef} className="date-month-picker" role="dialog" aria-label="选择日历显示年月" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setMonthPickerOpen(false); monthButtonRef.current?.focus() } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== monthButtonRef.current) setMonthPickerOpen(false) }}>
        <header><button type="button" aria-label="年月面板上一年" disabled={pickerYear <= 1} onClick={() => setPickerYear(year => year - 1)}>‹</button><strong>{pickerYear} 年</strong><button type="button" aria-label="年月面板下一年" disabled={pickerYear >= 9998} onClick={() => setPickerYear(year => year + 1)}>›</button></header>
        <div className="date-month-options">{Array.from({ length: 12 }, (_, index) => {
          const next = `${String(pickerYear).padStart(4, '0')}-${String(index + 1).padStart(2, '0')}`
          return <button type="button" key={index} aria-pressed={next === month} onClick={() => chooseMonth(next)}>{index + 1}月</button>
        })}</div>
        <footer><span>仅切换日历视图</span><button type="button" onClick={() => chooseMonth(today.slice(0, 7))}>回到本月</button></footer>
      </div>}
      <div className="date-months">{visibleMonths.map(current => <CalendarMonth key={current} month={current} start={draft.start} end={draft.end} today={today} dataDates={dataDates} onSelect={select} />)}</div>
      <p className="data-demo-note">紫色：选中区间内有数据；白色：无数据；描边：区间起止日期。</p>
      <div className="date-range-footer"><span role="status">{draft.start} → {draft.end}{anchor ? ' · 请再选择结束日期' : ''}</span><PortableButton type="button" onClick={() => { onChange(draft); setOpen(false); setAnchor(null) }}>应用日期</PortableButton></div>
    </div>}
  </div>
}
