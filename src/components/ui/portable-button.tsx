import { forwardRef, type ButtonHTMLAttributes } from 'react'
import './portable-button.css'

export interface PortableButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
}

// 可复制样板只依赖原生按钮；模板权限仍由原有 Button 负责。
export const PortableButton = forwardRef<HTMLButtonElement, PortableButtonProps>(
  ({ className, variant = 'primary', type = 'button', ...props }, ref) => (
    <button {...props} ref={ref} type={type} className={['portable-button', `portable-button-${variant}`, className].filter(Boolean).join(' ')} />
  ),
)

PortableButton.displayName = 'PortableButton'
