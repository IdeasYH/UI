import { useCallback, useState } from 'react'
import { Drawer, PersistentBanner, ToastStack, type ToastMessage } from '../components/ui/feedback-controls'

export function PersistentBannerExample() {
  const [tone, setTone] = useState<'warning' | 'error' | null>(null)
  return <div className="feedback-demo-actions"><button onClick={() => setTone('warning')}>显示常驻警告</button><button onClick={() => setTone('error')}>显示常驻报错</button>{tone && <PersistentBanner tone={tone} onClose={() => setTone(null)}>{tone === 'warning' ? '体验环境：此处为演示数据，请勿填写真实敏感信息。' : '提交失败：2 处填写有误，请检查后重试（演示）。'}</PersistentBanner>}</div>
}
export function ToastStackExample() {
  const [items, setItems] = useState<ToastMessage[]>([])
  const dismiss = useCallback((id: string) => setItems(old => old.filter(item => item.id !== id)), [])
  return <div className="feedback-demo-actions">{(['success', 'info', 'error'] as const).map((tone, index) => <button key={tone} onClick={() => setItems(old => [...old.slice(-3), { id: crypto.randomUUID(), text: ['保存成功（演示）', '已复制链接（演示）', '操作失败，请重试（演示）'][index], tone }])}>{['成功轻提示', '消息轻提示', '错误轻提示'][index]}</button>)}<ToastStack items={items} onDismiss={dismiss} /></div>
}
export function DrawerExample() {
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState('秋季活动方案')
  const [draft, setDraft] = useState(saved)
  return <div className="feedback-demo-actions"><button onClick={() => { setDraft(saved); setOpen(true) }}>打开任务详情抽屉</button><span>{saved}</span><Drawer open={open} onClose={() => setOpen(false)} title="任务详情" footer={<><button onClick={() => setOpen(false)}>关闭</button><button onClick={() => { if (draft.trim()) { setSaved(draft.trim()); setOpen(false) } }} disabled={!draft.trim()}>保存</button></>}><label>任务名称<input value={draft} onChange={event => setDraft(event.target.value)} /></label><p>在此查看或编辑详情，保留原页面上下文。保存只修改本地演示。</p></Drawer></div>
}
