import { useState } from 'react'
import HoldButton from '../components/react-bits/HoldButton'

export function HoldButtonExample() {
  const [message, setMessage] = useState('持续按住才会确认')
  return <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
    <HoldButton holdTime={1200} doneLabel="已确认" onHold={() => setMessage('已触发确认回调')}>按住确认示例</HoldButton>
    <span role="status">{message}</span>
  </div>
}
export default HoldButtonExample
