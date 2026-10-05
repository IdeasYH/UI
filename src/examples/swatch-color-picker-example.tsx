import { useState } from 'react'
import { SwatchColorPicker, swatchColors } from '../components/ui/swatch-color-picker'

export function SwatchColorPickerExample() {
  const [color, setColor] = useState<string>(swatchColors[3])
  const [message, setMessage] = useState('点击色块选择颜色')

  async function choose(next: string) {
    setColor(next)
    try {
      await navigator.clipboard.writeText(next)
      setMessage(`已选择并复制 ${next}`)
    } catch {
      // 复制是演示增强能力；浏览器拒绝剪贴板权限时仍保留已确认的颜色。
      setMessage(`已选择 ${next}；当前环境不允许自动复制`)
    }
  }

  return <div style={{ display: 'grid', gap: 8 }}>
    <div style={{ height: 280 }}><SwatchColorPicker label="主题预设色" value={color} onChange={next => void choose(next)} /></div>
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#566475' }}>
      <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 5, background: color }} />
      {message}
    </div>
  </div>
}
