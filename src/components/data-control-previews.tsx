import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { DateRangePicker } from './ui/date-range-picker'
import { monthDays } from './ui/date-range-model'
import { ColorPicker, StatusPill, StatisticCard, UploadProgress } from './ui/data-controls'

export function FocusLabelPreview() { const [value, setValue] = useState('小明'); return <div className="focus-label-field"><label htmlFor="demo-focused-name">用户名</label><Input id="demo-focused-name" value={value} onChange={event => setValue(event.target.value)} /></div> }

export function DateRangePreview() {
  const [today] = useState(() => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Taipei' }).format(new Date()))
  const [value, setValue] = useState({ start: today, end: today })
  // 明确的月内演示日期；其他月份无数据，方便验证区间里的白色空档。
  const [dataDates] = useState(() => new Set(monthDays(today.slice(0, 7)).days.filter(day => [2, 3, 6, 7, 9, 12, 15, 18, 21, 24, 27, 30].includes(Number(day.slice(-2))))))
  return <DateRangePicker today={today} value={value} onChange={setValue} dataDates={dataDates} />
}
export function ColorPreview() { const [value, setValue] = useState('#FF6B81'); return <ColorPicker value={value} onChange={setValue} /> }
export function UploadPreview() {
  const [file, setFile] = useState({ name: 'avatar.png', bytes: 1258291 })
  const [progress, setProgress] = useState(57)
  const [running, setRunning] = useState(false)
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setProgress(current => Math.min(100, current + 7)), 250); return () => window.clearInterval(timer) }, [running])
  useEffect(() => { if (progress === 100) setRunning(false) }, [progress])
  return <div className="upload-demo"><p className="data-demo-note">本地模拟上传，不读取或发送文件内容。</p><UploadProgress {...file} progress={progress} /><div className="sample-actions"><Button onClick={() => { setProgress(0); setRunning(true) }} disabled={running}>模拟上传</Button><Button variant="outline" onClick={() => { setRunning(false); setProgress(100) }}>查看完成状态</Button><label className="upload-file-picker">选择本地文件<input type="file" onChange={event => { const selected = event.target.files?.[0]; if (selected) { setRunning(false); setProgress(0); setFile({ name: selected.name, bytes: selected.size }) } }} /></label></div></div>
}
export function StatusPreview() { return <div className="status-pill-list">{(['running', 'complete', 'priority', 'default', 'disabled'] as const).map(status => <StatusPill key={status} status={status} />)}</div> }
export function StatisticsPreview() { return <><div className="statistic-grid"><StatisticCard title="今日访问量" value="12,846" unit="次" change={12.5} /><StatisticCard title="订单数" value="3,420" unit="单" change={-2.3} /><StatisticCard title="转化率" value="5.0" unit="%" change={0.6} /></div><p className="data-demo-note">演示数值 · 上涨红色，下跌绿色。</p></> }
