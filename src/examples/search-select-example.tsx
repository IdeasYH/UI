import { useState } from 'react'
import { SearchSelect } from '../components/ui/selection-controls'
import type { SelectOption } from '../components/ui/selection-model'

// 同一交互可以用于任意本地候选列表；ID 与检索字段来自调用方的数据。
const options: SelectOption[] = [
  { value: 'node-a', label: '主处理节点', pinyin: 'zhuchulijiedian', initials: 'zcljd' },
  { value: 'node-b', label: '备用处理节点', pinyin: 'beiyongchulijiedian', initials: 'bycljd' },
  { value: 'node-c', label: '审查节点', pinyin: 'shenchajiedian', initials: 'scjd' },
  { value: 'node-d', label: '归档节点', pinyin: 'guidangjiedian', initials: 'gdjd' },
  { value: 'node-e', label: '通知节点', pinyin: 'tongzhijiedian', initials: 'tzjd' },
  { value: 'node-f', label: '人工处理节点', pinyin: 'rengongchulijiedian', initials: 'rgcljd' },
]

export function SearchSelectExample() {
  const [value, setValue] = useState('')
  return <div>
    <SearchSelect label="选择处理节点" options={options} value={value} onChange={setValue} />
    <p role="status">已确认 ID：{value || '尚未选择'}</p>
    <button type="button" onClick={() => setValue('')}>重置选择</button>
  </div>
}
