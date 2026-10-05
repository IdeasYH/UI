import './glow-switch.css'

/** Uiverse EddyBel / slimy-penguin-36: preserve the source's 3-second floating keyframes. */
export function GlowSwitch({ label, checked, onChange }: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return <label className="uiverse-glow-switch">
    <input type="checkbox" className="input__check" aria-label={label} checked={checked} onChange={event => onChange(event.target.checked)} />
    <span className="slider" aria-hidden="true" />
  </label>
}
