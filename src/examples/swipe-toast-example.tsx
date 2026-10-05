import { useState } from 'react'
import SwipeToast from '../components/react-bits/SwipeToast'

export function SwipeToastExample() {
  const [open, setOpen] = useState(true)
  const [message, setMessage] = useState('可向旁边滑动通知')
  return <div style={{ display: 'grid', gap: 12, minHeight: 112, justifyItems: 'start' }}>
    <button type="button" onClick={() => setOpen(true)}>再次显示通知</button>
    {open && <SwipeToast inline open title="文件已归档" description="可撤销或滑动关闭" actionLabel="撤销" onAction={() => setMessage('已触发撤销')} onClose={() => setOpen(false)} duration={15000} closeButton />}
    <span role="status">{message}</span>
  </div>
}
export default SwipeToastExample
