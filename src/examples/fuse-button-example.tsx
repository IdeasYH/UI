import { useState } from 'react'
import FuseButton from '../components/react-bits/FuseButton'

export function FuseButtonExample() {
  const [message, setMessage] = useState('尚未执行')
  return <div style={{ display: 'grid', justifyItems: 'start', gap: 12 }}>
    <FuseButton label="归档示例" undoLabel="撤销" doneLabel="已归档" commitOn="fuseEnd" onCommit={() => setMessage('已触发归档回调')} onUndo={() => setMessage('已撤销')} />
    <span role="status">{message}</span>
  </div>
}
export default FuseButtonExample
