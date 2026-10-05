import { useState } from 'react'
import AnimatedList from '../components/react-bits/AnimatedList'

const items = ['项目计划', '设计验收', '前端开发', '交互验证', '发布回顾', '版本归档']

export function AnimatedListExample() {
  const [selected, setSelected] = useState('尚未选择')
  return <div style={{ width: '100%', maxWidth: 390 }}>
    <AnimatedList items={items} onItemSelect={(item: string) => setSelected(item)} />
    <p role="status">当前：{selected}</p>
  </div>
}
export default AnimatedListExample
