import { useState } from 'react'
import RubberSegment from '../components/react-bits/RubberSegment'

const items = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
]

export function RubberSegmentExample() {
  const [value, setValue] = useState('week')
  return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
    <RubberSegment items={items} value={value} onChange={(next: string) => setValue(next)} aria-label="统计周期" />
    <span role="status">当前：{value}</span>
  </div>
}
export default RubberSegmentExample
