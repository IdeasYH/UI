import { useState } from 'react'
import JellyRadio from '../components/react-bits/JellyRadio'

const items = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
]

export function JellyRadioExample() {
  const [value, setValue] = useState('medium')
  return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
    <JellyRadio items={items} value={value} onChange={(next: string) => setValue(next)} ariaLabel="尺寸" />
    <span role="status">当前：{value}</span>
  </div>
}
export default JellyRadioExample
