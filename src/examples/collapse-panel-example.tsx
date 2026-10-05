import { CollapsePanel } from '../components/ui/collapse-panel'

export function CollapsePanelExample() {
  return <CollapsePanel defaultOpenId="usage" items={[
    { id: 'install', title: '如何在页面中使用？', content: <p>传入稳定的条目 ID、标题和内容；需要接入业务数据时由页面提供内容。</p> },
    { id: 'usage', title: '可以再次收起吗？', content: <p>可以。点击已展开的标题会收起；点击另一项会切换到该项，保持面板紧凑。</p> },
    { id: 'keyboard', title: '键盘能操作吗？', content: <p>可以通过 Tab 聚焦标题，再按 Enter 或空格展开和收起。</p> },
  ]} />
}
