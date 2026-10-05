import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import './collapse-panel.css'

export type CollapseItem = { id: string; title: string; content: ReactNode }

/** 单项展开的面板；展开状态只在当前组件内保存。 */
export function CollapsePanel({ items, defaultOpenId = null }: { items: readonly CollapseItem[]; defaultOpenId?: string | null }) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId)
  return <div className="collapse-panel">
    {items.map(item => <section key={item.id} className="collapse-panel-item" data-open={openId === item.id}>
      <h3><button type="button" aria-expanded={openId === item.id} onClick={() => setOpenId(openId === item.id ? null : item.id)}><ChevronDown aria-hidden="true" size={18} /><span>{item.title}</span></button></h3>
      {openId === item.id && <div className="collapse-panel-content">{item.content}</div>}
    </section>)}
  </div>
}
