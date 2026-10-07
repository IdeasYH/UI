import { useRef, useState, type PointerEvent } from 'react'
import './liquid-glass.css'

/** Screenshot-inspired material study. Actions are local previews, never remote writes. */
export function LiquidGlass({ title = 'Liquid Glass' }: { title?: string }) {
  const scene = useRef<HTMLDivElement>(null)
  const [checked, setChecked] = useState(true)
  const [enabled, setEnabled] = useState(true)
  const [view, setView] = useState('grid')
  const [message, setMessage] = useState('Move the light. Feel the glass.')
  const [query, setQuery] = useState('')
  function moveLight(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    // CSS variables keep high-frequency pointer updates out of the React render loop.
    event.currentTarget.style.setProperty('--light-x', `${(event.clientX - rect.left) / rect.width * 100}%`)
    event.currentTarget.style.setProperty('--light-y', `${(event.clientY - rect.top) / rect.height * 100}%`)
    event.currentTarget.style.setProperty('--shadow-x', `${18 + (event.clientX - rect.left) / rect.width * 22}px`)
  }
  return <div ref={scene} className="lg-scene" onPointerMove={moveLight} onPointerLeave={() => {
    scene.current?.style.removeProperty('--light-x')
    scene.current?.style.removeProperty('--light-y')
    scene.current?.style.removeProperty('--shadow-x')
  }}>
    <section className="lg-panel" aria-label="液态玻璃交互展示">
      <header className="lg-header"><div><h1>{title}</h1><p>Search projects...</p></div><div className="lg-tools"><span aria-label="4 个项目">4</span><button aria-label="新增项目演示" onClick={() => setMessage('New project · preview only')}>+</button></div></header>
      <div className="lg-grid">
        <button className="lg-material lg-primary" onClick={() => setMessage('Primary action selected')}>Primary</button>
        <button className="lg-material lg-aqua" onClick={() => setMessage('Secondary action selected')}>Secondary</button>
        <label className="lg-material lg-search"><input aria-label="搜索项目" placeholder="Search projects..." value={query} onChange={event => { setQuery(event.target.value); setMessage(event.target.value ? `Search preview: ${event.target.value}` : 'Move the light. Feel the glass.') }} /><i /></label>
        <form className="lg-material lg-workspace" onSubmit={event => { event.preventDefault(); setMessage('Workspace created · local preview') }}><input aria-label="工作区名称" placeholder="Create workspace..." required /><button aria-label="创建工作区演示"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg></button></form>
        <button className="lg-material lg-aqua lg-select" onClick={() => setMessage('Collection selected')}>Select<span>➜</span></button>
        <label className="lg-material lg-check"><input type="checkbox" checked={checked} onChange={event => setChecked(event.target.checked)} /><span className="lg-check-mark">{checked && '✓'}</span><span>Fields</span></label>
        <label className="lg-material lg-check"><input type="checkbox" defaultChecked /><span className="lg-check-mark">✓</span><span>Auto fit</span></label>
        <div className="lg-material lg-segments" role="group" aria-label="显示方式"><button aria-pressed={view === 'grid'} onClick={() => setView('grid')}>Grid</button><button aria-label="列表" aria-pressed={view === 'list'} onClick={() => setView('list')}>☰</button></div>
        <button className="lg-material lg-small" onClick={() => setMessage('Ready to switch workspace')}>↗ <span>Switch</span><span className="lg-dot" /></button>
        <button className="lg-material lg-invite" onClick={() => setMessage('Invitation ready · local preview')}>Invite member</button>
        <div className="lg-material lg-upgrade"><span>Your next<br/>brilliant idea.</span><div className="lg-upgrade-check">✓</div><button onClick={() => setMessage('Upgrade selected · no purchase made')}>Upgrade plan</button></div>
        <button className="lg-orbit" aria-label="圆环确认" aria-pressed={checked} onClick={() => setChecked(!checked)}><span><b>{checked ? '✓' : '+'}</b></span></button>
        <button className="lg-material lg-switch" role="switch" aria-label="光彩开关" aria-checked={enabled} onClick={() => setEnabled(!enabled)}><span /></button>
        <button className="lg-material lg-dismiss" onClick={() => { setMessage('Preview reset'); setQuery(''); setEnabled(true); setChecked(true); setView('grid') }}>Reset <span>×</span></button>
      </div>
      <p className="lg-feedback" role="status">{message}</p>
    </section>
  </div>
}
