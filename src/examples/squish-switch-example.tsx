import { useState } from 'react'
import SquishSwitch from '../components/react-bits/SquishSwitch'

export function SquishSwitchExample() {
  const [checked, setChecked] = useState(false)
  return <div style={{ display: 'grid', gap: 12, justifyItems: 'start', background: '#15171c', color: '#f5f5f5', padding: 24, borderRadius: 12, width: '100%', boxSizing: 'border-box' }}>
    <SquishSwitch checked={checked} onChange={(next: boolean) => setChecked(next)} label="开启提醒" trackOnColor="#11ad81" ariaLabel="开启提醒" />
    <span role="status">{checked ? '已开启' : '已关闭'}</span>
  </div>
}
export default SquishSwitchExample
