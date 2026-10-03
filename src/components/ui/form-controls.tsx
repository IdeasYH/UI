import { useId, type InputHTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { Input } from './input'
import { TriStateCheckbox } from './tri-state-checkbox'
import './form-controls.css'

export { TriStateCheckbox } from './tri-state-checkbox'
export { PrerequisiteAction, type PrerequisiteActionProps, type PrerequisiteCondition } from './prerequisite-action'

export function ValidatedInput({ label, error, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  return <div className="form-control-field">
    <label htmlFor={inputId}>{label}</label>
    <Input {...props} id={inputId} aria-invalid={!!error} aria-describedby={[props['aria-describedby'], error ? errorId : undefined].filter(Boolean).join(' ') || undefined} />
    {error && <div className="form-control-error" id={errorId} role="status"><X size={18} aria-hidden="true" />{error}</div>}
  </div>
}

export function CountedTextarea({ label, value, onChange, maxLength = 200 }: { label: string; value: string; onChange: (value: string) => void; maxLength?: number }) {
  const id = useId()
  // 与原生 maxLength 使用相同的 UTF-16 长度口径，输入限制和计数保持一致。
  return <div className="form-control-field"><label htmlFor={id}>{label}</label>
    <div className="counted-textarea">
      <textarea id={id} value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value.slice(0, maxLength))} aria-describedby={`${id}-count`} />
      <span id={`${id}-count`} className="textarea-count">{value.length} / {maxLength}</span>
    </div>
  </div>
}

export type ChoiceOption = { value: string; label: string; detail?: string }

export function RadioCards({ label, options, value, onChange }: { label: string; options: readonly ChoiceOption[]; value: string; onChange: (value: string) => void }) {
  const name = useId()
  return <fieldset className="form-choice-fieldset"><legend>{label}</legend><div className="radio-cards">
    {options.map((option) => <label className="choice-card" data-selected={value === option.value} key={option.value}>
      <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
      <span><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}</span>
    </label>)}
  </div></fieldset>
}

export function CheckboxCards({ label, options, value, onChange }: { label: string; options: readonly ChoiceOption[]; value: readonly string[]; onChange: (value: string[]) => void }) {
  const selectedCount = options.filter((option) => value.includes(option.value)).length
  const allSelected = options.length > 0 && selectedCount === options.length
  return <fieldset className="form-choice-fieldset"><legend>{label}</legend><div className="checkbox-cards">
    <label className="checkbox-all"><TriStateCheckbox checked={allSelected} indeterminate={selectedCount > 0 && !allSelected} disabled={!options.length} onChange={() => onChange(allSelected ? [] : options.map((option) => option.value))} /><strong>全选</strong><span>已选 {selectedCount} / {options.length}</span></label>
    {options.map((option) => <label className="choice-card checkbox-card" data-selected={value.includes(option.value)} key={option.value}>
      <TriStateCheckbox checked={value.includes(option.value)} onChange={(event) => onChange(event.target.checked ? [...value, option.value] : value.filter((item) => item !== option.value))} />
      <strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}
    </label>)}
  </div></fieldset>
}
