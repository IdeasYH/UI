import { useState } from 'react'
import BranchedMenu from '../components/react-bits/BranchedMenu'

const items = [
  { label: '组件', children: [{ value: 'input', label: '输入组件' }, { value: 'navigation', label: '导航组件' }] },
  { label: '指南', children: [{ value: 'reuse', label: '复用方法' }, { value: 'examples', label: '真实示例' }] },
]

export function BranchedMenuExample() {
  const [selected, setSelected] = useState('尚未选择')
  return <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
    <BranchedMenu items={items} onSelect={(value: string) => setSelected(value)} color="#17324d" accentColor="#0f766e" lineColor="#9ab9b5" />
    <span role="status">当前：{selected}</span>
  </div>
}
export default BranchedMenuExample
