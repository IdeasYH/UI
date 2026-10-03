import { Check, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import './data-controls.css'
import { colorStripStops, stripColor, stripPosition } from './color-model'

export const standardColors = ['#0D9488', '#22C55E', '#84CC16', '#FACC15', '#FB923C', '#F97316', '#EF4444', '#FF6B81', '#EC4899', '#D946EF', '#A855F7', '#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4', '#2DD4BF', '#BEF264', '#FDE047', '#FDA4AF', '#F0ABFC', '#93C5FD', '#64748B', '#1F2937', '#FFFFFF']
export function ColorPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [text, setText] = useState(value)
  const id = useId()
  const [position, setPosition] = useState(() => stripPosition(value))
  // 外部颜色不强制投影到色带；仅将滑块定位到最近位置，保留原始精确值。
  useEffect(() => {
    setPosition(stripPosition(value)); setText(value.toUpperCase())
  }, [value])
  function choose(color: string) { setText(color.toUpperCase()); setPosition(stripPosition(color)); onChange(color.toUpperCase()) }
  function slide(next: number) {
    setPosition(next)
    const color = stripColor(next)
    setText(color)
    onChange(color)
  }
  const valid = /^#[0-9a-f]{6}$/i.test(text)
  return <div className="color-picker"><label htmlFor={id}>主题色</label><div className="color-current"><input type="color" aria-label="自定义颜色" value={value} onChange={event => choose(event.target.value)} /><input id={id} aria-label="颜色 HEX" value={text} aria-invalid={!valid} onChange={event => { setText(event.target.value); if (/^#[0-9a-f]{6}$/i.test(event.target.value)) choose(event.target.value) }} /></div>{!valid && <p className="form-control-error" role="status">请输入 # 加 6 位十六进制颜色值</p>}
    <div className="color-palette"><div className="color-sliders">
      <input type="range" aria-label="颜色：白色到彩色到黑色" aria-valuetext={value.toUpperCase()} min={0} max={100} step={0.1} value={position} className="color-slider" style={{ background: `linear-gradient(to right, ${colorStripStops.join(', ')})` }} onChange={event => slide(Number(event.target.value))} />
    </div><div className="color-swatches">{standardColors.map(color => <button type="button" key={color} aria-label={`选择颜色 ${color}`} aria-pressed={value.toUpperCase() === color} style={{ backgroundColor: color }} onClick={() => choose(color)}>{value.toUpperCase() === color && <Check size={16} color={['#FFFFFF', '#FACC15', '#FDE047', '#BEF264'].includes(color) ? '#273548' : '#fff'} />}</button>)}</div></div>
  </div>
}

export function UploadProgress({ name, bytes, progress }: { name: string; bytes: number; progress: number }) {
  const percent = Math.max(0, Math.min(100, Math.round(progress)))
  return <div className="upload-progress"><span className="upload-file-icon">{name.split('.').pop()?.slice(0, 4).toUpperCase() || 'FILE'}</span><div className="upload-file-body"><div className="upload-file-heading"><strong title={name}>{name}</strong><span>{(bytes / 1024 / 1024).toFixed(1)} MB</span></div><div className="upload-progress-line"><progress aria-label={`${name} 上传进度`} max={100} value={percent} /><span role="status">{percent === 100 ? <><Check size={20} aria-hidden="true" /><span className="data-visually-hidden">上传完成</span></> : `${percent}%`}</span></div></div></div>
}

const statusLabels = { running: '进行中', complete: '已完成', priority: '高优', default: '默认', disabled: '停用' }
export function StatusPill({ status }: { status: keyof typeof statusLabels }) { return <span className={`status-pill status-pill-${status}`}>{statusLabels[status]}</span> }

export function StatisticCard({ title, value, unit, change }: { title: string; value: string; unit: string; change: number | null }) {
  const direction = change === null || change === 0 ? 'flat' : change > 0 ? 'up' : 'down'
  const Icon = direction === 'up' ? ArrowUp : direction === 'down' ? ArrowDown : Minus
  return <div className="statistic-card"><p>{title}</p><div className="statistic-number"><strong>{value}</strong><span>{unit}</span></div><div className={`statistic-change statistic-${direction}`}><Icon size={17} aria-hidden="true" /><strong>{change === null ? '暂无对比' : `${change > 0 ? '+' : ''}${change}%`}</strong><span>{change === null ? '' : '较昨日'}</span></div></div>
}
