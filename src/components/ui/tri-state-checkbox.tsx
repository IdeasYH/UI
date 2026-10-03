import { useEffect, useRef, type InputHTMLAttributes } from 'react'
import { Check, Minus } from 'lucide-react'
import './tri-state-checkbox.css'

export type TriStateCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { indeterminate?: boolean }

export function TriStateCheckbox({ indeterminate = false, ...props }: TriStateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate }, [indeterminate, props.checked])
  return <span className="tri-state-checkbox">
    <input {...props} ref={ref} type="checkbox" aria-checked={indeterminate ? 'mixed' : props.checked} />
    <span className="checkbox-mark" aria-hidden="true">{indeterminate ? <Minus size={18} /> : props.checked ? <Check size={18} /> : null}</span>
  </span>
}
