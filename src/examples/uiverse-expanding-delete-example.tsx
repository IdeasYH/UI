import { useState } from 'react'
import { DeleteButton } from '../components/uiverse/delete-button'

export function UiverseExpandingDeleteExample() {
  const [count, setCount] = useState(0)
  return <div style={{ display: 'grid', placeItems: 'center', gap: 16, minHeight: 150, padding: 20, borderRadius: 8, background: '#e8e8e8', color: '#414141' }}>
    <DeleteButton onClick={() => setCount(value => value + 1)} />
    <small role="status">演示点击 {count} 次；不会删除数据。</small>
  </div>
}
