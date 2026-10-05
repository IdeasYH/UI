import PillNav from '../components/react-bits/PillNav'

const logo = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#0f766e"/><text x="20" y="27" text-anchor="middle" font-size="22" fill="white">U</text></svg>')
const items = [
  { label: '总览', href: '#pill-nav' },
  { label: '黏性导航', href: '#gooey-nav' },
  { label: '流动菜单', href: '#flowing-menu' },
]

export function PillNavExample() {
  return <div style={{ position: 'relative', minHeight: 130, width: '100%' }}><PillNav logo={logo} logoAlt="UIModel" items={items} activeHref="#pill-nav" baseColor="#17324d" pillColor="#53e0cd" hoveredPillTextColor="#17324d" /></div>
}
export default PillNavExample
