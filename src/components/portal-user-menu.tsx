import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, LogOut, Settings2, ShieldCheck } from 'lucide-react'
import { PortalAuthError, type PortalSession } from '../lib/portal-auth'
import { Button } from './ui/button'
import { Card } from './ui/card'

type PortalUserMenuProps = {
  session: PortalSession
  defaultOpen?: boolean
  hrmHref?: string
  canManage: boolean
  onManage: () => void
  onLogout: () => Promise<void>
}

function logoutErrorMessage(error: unknown) {
  if (error instanceof PortalAuthError) return error.message
  return '暂时无法连接人员中台，请稍后重试。'
}

export function PortalUserMenu({ session, defaultOpen = false, hrmHref, canManage, onManage, onLogout }: PortalUserMenuProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const initial = Array.from(session.displayName.trim())[0] ?? '尚'

  useEffect(() => {
    const closeFromOutside = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeFromOutside)
    document.addEventListener('keydown', closeFromEscape)
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside)
      document.removeEventListener('keydown', closeFromEscape)
    }
  }, [])

  const logout = async () => {
    setLoggingOut(true)
    setError('')
    try {
      await onLogout()
      setOpen(false)
    } catch (logoutError) {
      setError(logoutErrorMessage(logoutError))
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="portal-user" ref={rootRef}>
      <Button
        variant="ghost"
        className="portal-user-trigger"
        aria-label={`账号菜单：${session.displayName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="portal-user-avatar" aria-hidden="true">{initial}</span>
        <span className="portal-user-trigger-copy">
          <strong>{session.displayName}</strong>
          <small>本地示例</small>
        </span>
        <ChevronDown size={14} strokeWidth={1.8} />
      </Button>

      {open && (
        <Card className="portal-user-popover" role="menu" aria-label="门户账号菜单">
          <div className="portal-user-summary">
            <span className="portal-user-avatar portal-user-avatar-large" aria-hidden="true">{initial}</span>
            <div>
              <strong>{session.displayName}</strong>
              <span>{session.loginName}</span>
            </div>
          </div>
          <div className="portal-user-session">
            <ShieldCheck size={15} />
            <span>示例身份，未连接业务系统</span>
          </div>
          {error && <div className="portal-user-error" role="alert">{error}</div>}
          <div className="portal-user-actions">
            {canManage && (
              <Button variant="ghost" role="menuitem" onClick={() => { setOpen(false); onManage() }}>
                <Settings2 size={15} /> 管理门户
              </Button>
            )}
            {hrmHref && (
              <Button variant="ghost" href={hrmHref} target="_blank" rel="noreferrer">
                人员中台 <ArrowUpRight size={14} />
              </Button>
            )}
            <Button variant="ghost" role="menuitem" disabled={loggingOut} onClick={logout}>
              <LogOut size={15} /> {loggingOut ? '正在退出…' : '退出门户'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
