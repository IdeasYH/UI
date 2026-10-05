import { useState } from 'react'
import { GlowSwitch } from '../components/uiverse/glow-switch'

export function UiverseFloatingGlowSwitchExample() {
  const [checked, setChecked] = useState(false)
  return <div style={{ display: 'grid', placeItems: 'center', gap: 16, minHeight: 150, padding: 20, borderRadius: 8, background: '#212121', color: '#ddd' }}>
    <GlowSwitch label="彩色光晕开关" checked={checked} onChange={setChecked} />
    <small role="status">当前：{checked ? '开' : '关'}</small>
  </div>
}
