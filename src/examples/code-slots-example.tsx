import { useState } from 'react'
import CodeSlots from '../components/react-bits/CodeSlots'

export function CodeSlotsExample() {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [complete, setComplete] = useState(false)
  return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
    <CodeSlots length={4} value={value} onChange={(next: string) => { setValue(next); setStatus('idle'); setComplete(false) }} onComplete={() => setComplete(true)} status={status} ariaLabel="四位示例代码" />
    <div style={{ display: 'flex', gap: 8 }}><button type="button" onClick={() => setStatus('success')} disabled={!complete}>演示验证成功</button><button type="button" onClick={() => setStatus('error')}>演示错误</button><button type="button" onClick={() => { setValue(''); setStatus('idle'); setComplete(false) }}>清空</button></div>
    <span role="status">{status === 'success' ? '演示成功状态（未接验证服务）' : status === 'error' ? '演示错误状态' : complete ? '已填写完整，尚未验证' : `${value.length} / 4 位`}</span>
  </div>
}
export default CodeSlotsExample
