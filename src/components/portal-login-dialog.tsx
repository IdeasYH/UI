import { KeyRound, ShieldCheck, X } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { loginPortal, type PortalSession } from '../lib/portal-auth'

type PortalLoginDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAuthenticated: (session: PortalSession) => void
  applications: readonly string[]
}

export function PortalLoginDialog({ open, onOpenChange, onAuthenticated }: PortalLoginDialogProps) {
  const enterPreview = async () => {
    onAuthenticated(await loginPortal())
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      className="portal-login-dialog"
      labelledBy="portal-login-title"
      describedBy="portal-login-description"
    >
      <div className="portal-login-heading">
        <span className="portal-login-mark" aria-hidden="true"><KeyRound size={22} strokeWidth={1.65} /></span>
        <h2 id="portal-login-title">进入尚毅门户</h2>
        <Button variant="icon" aria-label="关闭登录窗口" onClick={() => onOpenChange(false)}><X size={18} /></Button>
      </div>
      <p id="portal-login-description" className="portal-login-description">本地示例账号，不接入真实身份认证。</p>
      <Button className="portal-login-submit" onClick={enterPreview}>使用示例管理员</Button>
      <div className="portal-login-footnote">
        <ShieldCheck size={15} strokeWidth={1.7} />
        <span>无需输入账号、密码或其他个人信息。</span>
      </div>
    </Dialog>
  )
}
