import FlexCarousel from '../components/react-bits/FlexCarousel'

const items = [
  { src: '/images/one.jpg', alt: 'A chrome sculpture', title: 'Iridescence' },
  { src: '/images/two.jpg', alt: 'A figure on a white set', title: 'White Room' },
  { src: '/images/three.jpg', alt: 'A clay bust in profile', title: 'Clay Study', subtitle: 'Studio 04' },
]

export function FlexCarouselExample() {
  return <div style={{ width: '100%', height: '560px', position: 'relative' }}>
    <FlexCarousel items={items} preset="liquid" intro="rise" cardHeight={0.5} gap={12} squeeze={0.2} focusOnClick captions />
  </div>
}
