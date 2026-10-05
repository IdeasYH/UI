import { useState } from 'react'
import LatticeLoader from '../components/react-bits/LatticeLoader'

export function LatticeLoaderExample() {
  const [status, setStatus] = useState<'working' | 'done' | 'error'>('working')
  return <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
    <div style={{ display: 'flex', gap: 8 }}>
      <button type="button" onClick={() => setStatus('working')}>处理中</button>
      <button type="button" onClick={() => setStatus('done')}>完成</button>
      <button type="button" onClick={() => setStatus('error')}>失败</button>
    </div>
    <LatticeLoader status={status} label="处理中" doneLabel="已完成" errorLabel="失败" />
  </div>
}
export default LatticeLoaderExample
