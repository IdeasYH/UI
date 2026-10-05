import { useState } from 'react'
import VoicePill from '../components/react-bits/VoicePill'

export function VoicePillExample() {
  const [message, setMessage] = useState('点击或按住开始语音示例')
  return <div style={{ display: 'grid', justifyItems: 'start', gap: 14 }}>
    <VoicePill reactive="simulated" mode="toggle" ariaLabel="开始或停止语音示例" onStart={() => setMessage('模拟录音中')} onStop={() => setMessage('模拟录音已停止')} />
    <span role="status">{message}</span>
  </div>
}
export default VoicePillExample
