import { useState } from 'react'
import { MessageBox } from '../components/uiverse/message-box'

export function UiverseMessageComposerExample() {
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('输入文字后按回车或点击箭头；附件仅显示文件名。')
  return <div style={{ display: 'grid', placeItems: 'center', gap: 16, minHeight: 150, padding: 20, borderRadius: 8, background: '#212121', color: '#ddd' }}>
    <MessageBox value={message} onChange={setMessage} onSend={text => { setNotice(`演示发送：${text}`); setMessage('') }} onFileChange={file => setNotice(file ? `已选择 ${file.name}，未上传` : '未选择附件')} />
    <small role="status">{notice}</small>
  </div>
}
