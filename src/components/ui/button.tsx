import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { evaluatePermission, visibilityCode } from '../permissions/permission-model'
import { usePermissions } from '../permissions/permission-context'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'icon' | 'nav'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  permission?: string
  variant?: ButtonVariant
  href?: string
  target?: string
  rel?: string
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', href, target, rel, children, permission, ...props }, ref) => {
    const permissions = usePermissions()
    const patrol = !!permission && permissions?.state.mode === 'patrol'
    const denied = !!permission && !!permissions && !permissions.can(permission)
    if (denied && permissions && !evaluatePermission(permissions.state, visibilityCode(permission!)).allowed) return null
    const classes = cn('ui-button', `ui-button-${variant}`, className)

    if (href) {
      return (
        <a className={classes} href={denied ? undefined : href} target={target} rel={rel} aria-current={props['aria-current']} aria-label={props['aria-label']} aria-disabled={denied || undefined} data-permission={permission} data-patrol={patrol || undefined} title={denied ? permissions?.reason(permission!) : props.title} onClick={(event) => {
          if (patrol || denied) event.preventDefault()
          if (patrol) { event.stopPropagation(); permissions?.inspect(permission!) }
        }}>
          {children}
        </a>
      )
    }

    return (
      <button ref={ref} className={classes} {...props} data-permission={permission} data-patrol={patrol || undefined} disabled={patrol ? false : props.disabled || denied} title={patrol ? `现场配置：${permission}` : denied ? permissions?.reason(permission!) : props.title} onClick={(event) => {
        if (patrol) { event.preventDefault(); event.stopPropagation(); permissions?.inspect(permission!); return }
        if (!denied) props.onClick?.(event)
      }}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
