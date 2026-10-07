import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import './copy-value.css'

export function CopyValue({ value, label = value }: { value: string; label?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const attempt = useRef(0)
  useEffect(() => () => { clearTimeout(timer.current); attempt.current++ }, [])
  useEffect(() => { clearTimeout(timer.current); attempt.current++; setStatus('idle') }, [value])
  async function copy() {
    const current = ++attempt.current
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(value)
      if (current !== attempt.current) return
      setStatus('copied')
      timer.current = setTimeout(() => setStatus('idle'), 1800)
    } catch {
      if (current === attempt.current) setStatus('error')
    }
  }
  return <span className="copy-value-wrap"><button type="button" className="copy-value" onClick={event => { event.stopPropagation(); void copy() }} aria-label={`复制 ${label}`} title={status === 'error' ? '复制失败，请重试或手动复制' : status === 'copied' ? '已复制' : '点击复制'}><span>{label}</span>{status === 'copied' ? <Check size={13} className="copy-value-check" aria-hidden /> : <Copy size={12} aria-hidden />}</button><span className={status === 'error' ? 'copy-value-error' : 'copy-value-status'} role="status">{status === 'copied' ? '已复制' : status === 'error' ? '复制失败，请手动复制' : ''}</span></span>
}
