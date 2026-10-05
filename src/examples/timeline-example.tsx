import { useState } from 'react'
import { Timeline } from '../components/ui/timeline'

const steps = [
  { id: 'ordered', title: '下单', time: '09:12' },
  { id: 'packing', title: '打包', time: '10:40' },
  { id: 'transit', title: '运输', time: '14:05' },
  { id: 'delivered', title: '签收', time: '18:22' },
]

export function TimelineExample() {
  const [completed, setCompleted] = useState(1)
  return <div style={{ display: 'grid', gap: 8 }}>
    <Timeline steps={steps} completedCount={completed} label="示例订单进度" />
    <div className="demo-timeline-actions">
      <button type="button" onClick={() => setCompleted(value => Math.min(steps.length, value + 1))}>下一步</button>
      <button type="button" onClick={() => setCompleted(1)}>重置进度</button>
    </div>
    <span role="status" style={{ fontSize: 12, color: '#64748b' }}>演示进度：已完成 {completed} / {steps.length} 项。时间均为示例。</span>
  </div>
}
