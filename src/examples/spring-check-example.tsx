import { useState } from 'react'
import SpringCheck from '../components/react-bits/SpringCheck'

export function SpringCheckExample() {
  const [checked, setChecked] = useState(false)
  return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
    <SpringCheck checked={checked} onChange={(next: boolean) => setChecked(next)} label="确认已阅读" fillColor="#0f766e" checkColor="#ffffff" />
    <span role="status">{checked ? '已勾选' : '未勾选'}</span>
  </div>
}
export default SpringCheckExample
