import { useState } from 'react'
import PeekRating from '../components/react-bits/PeekRating'

export function PeekRatingExample() {
  const [rating, setRating] = useState(3)
  return <div>
    <PeekRating
      defaultValue={3}
      count={5}
      shape="star"
      labels={['Poor', 'Fair', 'Good', 'Great', 'Superb']}
      activeColor="#f5b400"
      idleColor="#52525b"
      tipColor="#27272a"
      tipTextColor="#f5f5f5"
      size={32}
      lift={7}
      magnify={1.15}
      riseDuration={320}
      popScale={1.3}
      showTip
      allowClear
      onChange={(value: number) => setRating(value)}
    />
    <p role="status" style={{ margin: '10px 0 0', color: '#64748b', fontSize: 13 }}>已确认 {rating} / 5 分</p>
  </div>
}
