import { useState } from 'react'
import { LogoutButton } from '../components/uiverse/logout-button'

export function UiverseExpandingLogoutExample() {
  const [count, setCount] = useState(0)
  return <div style={{ display: 'grid', placeItems: 'center', gap: 16, minHeight: 150, padding: 20, borderRadius: 8, background: '#e8e8e8', color: '#414141' }}>
    <LogoutButton onClick={() => setCount(value => value + 1)} />
    <small role="status">演示点击 {count} 次；不会退出当前系统。</small>
  </div>
}
