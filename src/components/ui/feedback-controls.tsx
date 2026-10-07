import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './feedback-controls.css'

export function PersistentBanner({ tone = 'warning', children, onClose }: { tone?: 'warning' | 'error'; children: ReactNode; onClose: () => void }) {
  return createPortal(<div className={`feedback-banner feedback-${tone}`} role="alert"><span aria-hidden>{tone === 'warning' ? '⚠' : '⊗'}</span><span>{children}</span><button type="button" onClick={onClose} aria-label="关闭顶部提示">×</button></div>, document.body)
}
export type ToastMessage = { id: string; text: string; tone?: 'success' | 'error' | 'info' }
function ToastItem({ item, onDismiss, duration }: { item: ToastMessage; onDismiss: (id: string) => void; duration: number }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const paused = hovered || focused
  return <div className={`feedback-toast feedback-toast-${item.tone ?? 'info'}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }} role="status"><span className="feedback-toast-icon" aria-hidden>{item.tone === 'success' ? '✓' : item.tone === 'error' ? '!' : 'i'}</span><span className="feedback-toast-text">{item.text}</span><button type="button" aria-label={`关闭提示 ${item.text}`} onClick={() => onDismiss(item.id)}>×</button>{duration > 0 && <span key={duration} className="feedback-toast-progress" aria-hidden style={{ animationDuration: `${duration}ms`, animationPlayState: paused ? 'paused' : 'running' }} onAnimationEnd={() => onDismiss(item.id)} />}</div>
}
export function ToastStack({ items, onDismiss, duration = 2500 }: { items: readonly ToastMessage[]; onDismiss: (id: string) => void; duration?: number }) {
  return createPortal(<div className="feedback-toast-stack" aria-label="轻提示">{items.map(item => <ToastItem key={item.id} item={item} onDismiss={onDismiss} duration={duration} />)}</div>, document.body)
}
export function Drawer({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])
  return createPortal(<dialog ref={ref} className="feedback-drawer" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right) onClose() } }}><header><h2 id={titleId}>{title}</h2><button type="button" onClick={onClose} aria-label="关闭抽屉">×</button></header><div className="feedback-drawer-body">{children}</div>{footer && <footer>{footer}</footer>}</dialog>, document.body)
}
