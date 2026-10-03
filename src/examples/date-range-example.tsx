import { useState } from 'react'
import { DateRangePicker } from '../components/ui/date-range-picker'
import type { DateRange } from '../components/ui/date-range-model'

// 固定值只使参考用例可重复。接入时由业务时区提供今天、由查询结果提供有数据日期。
const today = '2026-10-03'
const initialRange: DateRange = { start: '2026-10-01', end: today }
const dataDates = new Set(['2026-10-01', '2026-10-03'])

export function DateRangeExample() {
  const [value, setValue] = useState(initialRange)
  const [confirmations, setConfirmations] = useState(0)
  return <div>
    <DateRangePicker today={today} value={value} dataDates={dataDates} onChange={range => { setValue(range); setConfirmations(count => count + 1) }} />
    <p role="status">已确认区间：{value.start} → {value.end}；确认次数：{confirmations}</p>
    <button type="button" onClick={() => setValue(initialRange)}>外部重置区间</button>
  </div>
}
