import { useState } from 'react'
import { BookmarkButton } from '../components/uiverse/bookmark-button'

export function UiverseExpandingBookmarkSaveExample() {
  const [count, setCount] = useState(0)
  return <div style={{ display: 'grid', placeItems: 'center', gap: 16, minHeight: 150, padding: 20, borderRadius: 8, background: '#212121', color: '#ddd' }}>
    <BookmarkButton onClick={() => setCount(value => value + 1)} />
    <small role="status">演示点击 {count} 次；实际保存由宿主接入。</small>
  </div>
}
