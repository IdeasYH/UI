import GooeyNav from '../components/react-bits/GooeyNav'

const items = [
  { label: '总览', href: '#gooey-nav' },
  { label: '组件', href: '#gooey-nav' },
  { label: '示例', href: '#gooey-nav' },
]

export function GooeyNavExample() {
  return <div style={{ minHeight: 105, display: 'grid', placeItems: 'center' }}><GooeyNav items={items} /></div>
}
export default GooeyNavExample
