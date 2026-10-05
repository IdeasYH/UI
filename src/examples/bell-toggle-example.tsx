import { useState } from 'react'
import BellToggle from '../components/react-bits/BellToggle'

export function BellToggleExample() {
  const [pressed, setPressed] = useState(false)
  return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
    <BellToggle pressed={pressed} onChange={(next: boolean) => setPressed(next)} offLabel="接收通知" onLabel="已订阅" count={2} />
    <span role="status">{pressed ? '示例通知已开启' : '示例通知已关闭'}</span>
  </div>
}
export default BellToggleExample
