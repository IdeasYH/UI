import { useState } from 'react'
import Dock from '../components/react-bits/Dock'

export function DockExample() {
  const [selected, setSelected] = useState('选择快捷入口')
  const items = [
    { icon: '⌂', label: '首页', onClick: () => setSelected('首页') },
    { icon: '▦', label: '组件', onClick: () => setSelected('组件') },
    { icon: '⚙', label: '设置', onClick: () => setSelected('设置') },
  ]
  return <div style={{ display: 'grid', justifyItems: 'center', position: 'relative', width: '100%', minHeight: 180 }}><Dock items={items} /><p role="status">{selected}</p></div>
}
export default DockExample
