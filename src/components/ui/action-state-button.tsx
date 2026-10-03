import { Check, LoaderCircle, TriangleAlert } from 'lucide-react'
import { Button, type ButtonProps } from './button'
import './action-state-button.css'

type ActionState = 'submitting' | 'success' | 'error'

export function FormActionButton({ action, className = '', ...props }: Omit<ButtonProps, 'href' | 'children'> & { action: 'submit' | 'cancel' }) {
  return <Button {...props} type={props.type ?? (action === 'submit' ? 'submit' : 'button')} className={`action-state-button form-action-${action} ${className}`}>
    {action === 'submit' ? '提交' : '取消'}
  </Button>
}

const states = {
  submitting: { label: '提交中...', Icon: LoaderCircle },
  success: { label: '保存成功', Icon: Check },
  error: { label: '出错了', Icon: TriangleAlert },
}

// 状态按钮仅支持原生按钮，避免链接绕过提交中的 disabled 限制。
export function ActionStateButton({ state, className = '', disabled, ...props }: Omit<ButtonProps, 'href' | 'children' | 'permission'> & { state: ActionState }) {
  const { label, Icon } = states[state]
  return <Button {...props} type={props.type ?? 'button'} disabled={state === 'submitting' || disabled} aria-busy={state === 'submitting'} className={`action-state-button action-state-${state} ${className}`}>
    <Icon size={19} aria-hidden="true" className={state === 'submitting' ? 'action-state-spinner' : undefined} />
    {label}
  </Button>
}

export function ActionStateNotice({ state }: { state: ActionState }) {
  const { label, Icon } = states[state]
  return <div className={`action-state-notice action-state-${state}`} role="status">
    <Icon size={21} aria-hidden="true" className={state === 'submitting' ? 'action-state-spinner' : undefined} />
    <span>{state === 'submitting' ? '正在提交...（防止连点）' : label}</span>
  </div>
}
