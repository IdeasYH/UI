import { useEffect, useState } from 'react'
import { Sun } from 'lucide-react'
import { PortableButton } from './portable-button'
import { datePresets, monthDays, orderRange, presetRange, shiftMonth, type DateRange } from './date-range-model'
import './date-range-picker.css'

export type DateRangePickerProps = { today: string; value: DateRange; onChange: (range: DateRange) => void; dataDates: ReadonlySet<string> }

export function DateRangePicker({ today, value, onChange, dataDates }: DateRangePickerProps) {
  const [open, setOpen] = useState(true)
  const [month, setMonth] = useState(value.start.slice(0, 7))
  const [draft, setDraft] = useState(value)
  const [anchor, setAnchor] = useState<string | null>(null)
  const [preset, setPreset] = useState<string>('')
  // 父页面重置或切换记录时，外部已确认值优先于尚未提交的草稿。
  // 按日期字段比较，避免父页面仅重建相同值对象时打断用户的选择。
  useEffect(() => {
    setDraft({ start: value.start, end: value.end })
    setMonth(value.start.slice(0, 7))
    setAnchor(null)
    setPreset('')
  }, [value.start, value.end])
  function shortcut(name: typeof datePresets[number]) { const range = presetRange(name, today); setDraft(range); setMonth(range.start.slice(0, 7)); setAnchor(null); setPreset(name); onChange(range); setOpen(false) }
  function select(day: string) { setPreset(''); if (!anchor) { setAnchor(day); setDraft({ start: day, end: day }) } else { setDraft(orderRange(anchor, day)); setAnchor(null) } }
  return <div className="date-range-demo">
    <PortableButton type="button" variant="outline" aria-expanded={open} onClick={() => { setOpen(!open); setDraft(value); setAnchor(null); setPreset('') }}>日期区间：{value.start} → {value.end}</PortableButton>
    {open && <div className="date-range-panel">
      <div className="date-range-toolbar"><div className="date-shortcuts">{datePresets.slice(0, 5).map(name => <button type="button" key={name} className={name === '今天' ? 'date-today-shortcut' : undefined} aria-pressed={preset === name} onClick={() => shortcut(name)}>{name === '今天' && <Sun size={14} aria-hidden="true" />}<span>{name}</span></button>)}</div>
        <div className="date-month-nav" role="group" aria-label="切换日历显示月份"><button type="button" title="查看上一年，不改变已选区间" onClick={() => setMonth(shiftMonth(month, -12))}>上年</button><button type="button" aria-label="上个月" title="查看上个月，不改变已选区间" onClick={() => setMonth(shiftMonth(month, -1))}>‹</button><input type="month" aria-label="显示月份" value={month} onChange={event => { if (/^\d{4}-\d{2}$/.test(event.target.value)) setMonth(event.target.value) }} /><button type="button" aria-label="下个月" title="查看下个月，不改变已选区间" onClick={() => setMonth(shiftMonth(month, 1))}>›</button><button type="button" title="查看下一年，不改变已选区间" onClick={() => setMonth(shiftMonth(month, 12))}>下年</button></div>
        <div className="date-shortcuts">{datePresets.slice(5).map(name => <button type="button" key={name} aria-pressed={preset === name} onClick={() => shortcut(name)}>{name}</button>)}</div>
      </div>
      <div className="date-months">{[month, shiftMonth(month, 1)].map(current => {
        const { days, offset } = monthDays(current)
        return <section className="date-month" aria-label={`${current}日历`} key={current}><h3>{current.slice(0, 4)} 年 {current.slice(5)} 月</h3><div className="date-grid">{['一', '二', '三', '四', '五', '六', '日'].map(day => <span className="date-weekday" key={day}>{day}</span>)}{Array.from({ length: offset }, (_, index) => <span key={`empty-${index}`} />)}{days.map(day => {
          const selected = day >= draft.start && day <= draft.end
          const endpoint = day === draft.start || day === draft.end
          const hasData = dataDates.has(day)
          return <button type="button" key={day} className="date-day" aria-label={`${day}${hasData ? ' 有数据' : ' 无数据'}`} aria-pressed={selected} aria-current={day === today ? 'date' : undefined} data-filled={selected && hasData} data-endpoint={endpoint} onClick={() => select(day)}>{Number(day.slice(-2))}</button>
        })}</div></section>
      })}</div>
      <p className="data-demo-note">紫色：选中区间内有数据；白色：无数据；描边：区间起止日期。</p>
      <div className="date-range-footer"><span role="status">{draft.start} → {draft.end}{anchor ? ' · 请再选择结束日期' : ''}</span><PortableButton type="button" onClick={() => { onChange(draft); setOpen(false); setAnchor(null) }}>应用日期</PortableButton></div>
    </div>}
  </div>
}
