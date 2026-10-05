import { Check } from 'lucide-react'
import './timeline.css'

export type TimelineStep = { id: string; title: string; time?: string; description?: string }

/** 已完成数由宿主提供；未发生的时间应留空，不能借用示例时间。 */
export function Timeline({ steps, completedCount, label = '进度时间轴' }: { steps: readonly TimelineStep[]; completedCount: number; label?: string }) {
  const completed = Math.max(0, Math.min(steps.length, completedCount))
  return <ol className="demo-timeline" aria-label={label}>
    {steps.map((step, index) => <li key={step.id} data-complete={index < completed} data-current={index === completed}>
      <span className="demo-timeline-marker" aria-hidden="true">{index < completed && <Check size={13} strokeWidth={3} />}</span>
      <div><strong>{step.title}</strong><span className="demo-timeline-state">{index < completed ? '已完成' : '待进行'}</span>{step.time && <time>{step.time}</time>}{step.description && <p>{step.description}</p>}</div>
    </li>)}
  </ol>
}
