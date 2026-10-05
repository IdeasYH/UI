import { useState } from 'react'
import { SocialTooltip, type SocialNetwork } from '../components/uiverse/social-tooltip'

export function UiverseSocialTooltipExample() {
  const [selected, setSelected] = useState<SocialNetwork | null>(null)
  return <div style={{ display: 'grid', placeItems: 'center', minHeight: 280, padding: '90px 80px 24px', borderRadius: 8, background: '#e8e8e8', color: '#414141' }}>
    <SocialTooltip onSelect={setSelected} />
    <small role="status" style={{ marginTop: 80 }}>{selected ? `已选择 ${selected}；演示不会发布或跳转。` : '悬停或 Tab 聚焦纸飞机，展开八个社交图标。'}</small>
  </div>
}
