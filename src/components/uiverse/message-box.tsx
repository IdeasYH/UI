import { useId } from 'react'
import './message-box.css'

/** Uiverse vinodjangid07 / good-donkey-28; the host owns send and file handling. */
export function MessageBox({ value, onChange, onSend, onFileChange }: {
  value: string
  onChange: (value: string) => void
  onSend: (value: string) => void
  onFileChange?: (file: File | null) => void
}) {
  const fileId = useId()
  return <form className="uiverse-message-box" onSubmit={event => { event.preventDefault(); onSend(value) }}>
    <div className="fileUploadWrapper">
      <label htmlFor={fileId} aria-label="添加图片">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337" aria-hidden="true">
          <circle strokeWidth="20" stroke="#6c6c6c" fill="none" r="158.5" cy="168.5" cx="168.5" />
          <path strokeLinecap="round" strokeWidth="25" stroke="#6c6c6c" d="M167.759 79V259" />
          <path strokeLinecap="round" strokeWidth="25" stroke="#6c6c6c" d="M79 167.138H259" />
        </svg>
        <span className="tooltip">Add an image</span>
      </label>
      <input type="file" id={fileId} className="file-input" name="file" onChange={event => onFileChange?.(event.target.files?.[0] ?? null)} />
    </div>
    <input required placeholder="Message..." type="text" className="messageInput" aria-label="Message" value={value} onChange={event => onChange(event.target.value)} />
    <button className="sendButton" type="submit" aria-label="发送消息">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663" aria-hidden="true">
        <path fill="none" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="33.67" stroke="#6c6c6c" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
      </svg>
    </button>
  </form>
}
