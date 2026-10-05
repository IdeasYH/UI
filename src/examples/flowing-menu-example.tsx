import FlowingMenu from '../components/react-bits/FlowingMenu'

const items = [
  { text: '作品', link: '#flowing-menu', image: '/images/one.jpg' },
  { text: '团队', link: '#flowing-menu', image: '/images/two.jpg' },
  { text: '联系', link: '#flowing-menu', image: '/images/three.jpg' },
]

export function FlowingMenuExample() {
  return <div style={{ width: '100%', height: 310, position: 'relative' }}><FlowingMenu items={items} speed={12} bgColor="#17324d" /></div>
}
export default FlowingMenuExample
