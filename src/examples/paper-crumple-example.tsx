import PaperCrumple from '../components/react-bits/PaperCrumple'

const sampleImage = '/images/one.jpg'

export function PaperCrumpleExample() {
  return <div style={{ width: '100%', minHeight: 360, display: 'grid', placeItems: 'center' }}>
    <PaperCrumple src={sampleImage} alt="可揉皱的示例纸张" width={220} height={280} sceneHeight={340} />
  </div>
}
export default PaperCrumpleExample
