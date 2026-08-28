import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'icon' | 'nav'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  href?: string
  target?: string
  rel?: string
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', href, target, rel, children, ...props }, ref) => {
    const classes = cn('ui-button', `ui-button-${variant}`, className)

    if (href) {
      return (
        <a className={classes} href={href} target={target} rel={rel} aria-current={props['aria-current']} aria-label={props['aria-label']} title={props.title}>
          {children}
        </a>
      )
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
