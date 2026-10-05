import CardNav from '../components/react-bits/CardNav'

const logo = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 32"><rect width="80" height="32" rx="10" fill="#17324d"/><text x="40" y="22" text-anchor="middle" font-size="17" fill="white">UI</text></svg>')
const items = [
  { label: '组件', bgColor: '#dceff5', textColor: '#17324d', links: [{ label: '选择器', href: '#card-nav' }, { label: '按钮', href: '#card-nav' }] },
  { label: '指南', bgColor: '#e8e3f8', textColor: '#38215f', links: [{ label: '复用方法', href: '/guide' }] },
]

export function CardNavExample() {
  return <div style={{ position: 'relative', minHeight: 310, width: '100%' }}><CardNav logo={logo} logoAlt="UI 示例" items={items} baseColor="#ffffff" menuColor="#17324d" buttonBgColor="#17324d" buttonTextColor="#ffffff" /></div>
}
export default CardNavExample
