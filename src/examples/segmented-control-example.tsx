import { useState } from 'react'
import { SegmentedControl } from '../components/ui/segmented-control'

const metrics = {
  day: { count: 126, label: '今日订单量', bars: [36, 58, 45] },
  week: { count: 842, label: '每周订单量', bars: [68, 52, 88] },
  month: { count: 3420, label: '本月订单量', bars: [44, 82, 96] },
} as const
type Period = keyof typeof metrics

export function SegmentedControlExample() {
  const [period, setPeriod] = useState<Period>('week')
  const selected = metrics[period]
  return <div style={{ display: 'grid', justifyItems: 'center', gap: 24, padding: '16px 0' }}>
    <SegmentedControl label="订单统计周期" options={[{ value: 'day', label: '日' }, { value: 'week', label: '周' }, { value: 'month', label: '月' }]} value={period} onChange={value => setPeriod(value as Period)} />
    <div role="status" style={{ textAlign: 'center' }}><strong style={{ display: 'block', color: '#202832', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1 }}>{selected.count.toLocaleString()}<small style={{ marginLeft: 6, fontSize: '.3em' }}>单</small></strong><span style={{ color: '#e88d06', fontWeight: 700 }}>{selected.label}</span></div>
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'end', gap: 28, height: 90 }}>{selected.bars.map((height, index) => <span key={index} style={{ display: 'block', width: 26, height: `${height}%`, borderRadius: 8, background: index === 1 ? '#ec8f06' : '#f3d7ad' }} />)}</div>
  </div>
}
