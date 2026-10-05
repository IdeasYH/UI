import assert from 'node:assert/strict'
import test from 'node:test'
import { componentReferences } from '../src/data/component-references.ts'
import { reactBitsFavorites } from '../src/data/react-bits-favorites.ts'
import { componentCatalog } from '../src/data/template-catalog.ts'

// 2026-10-04 用户浏览器收藏页的完整快照；后续收藏变更需显式同步清单和说明。
const favoriteIds = [
  'voice-pill', 'flex-carousel', 'peek-rating', 'swipe-toast', 'card-nav',
  'pill-nav', 'gooey-nav', 'animated-list', 'flowing-menu', 'dock',
  'fuse-button', 'hold-button', 'lattice-loader', 'jelly-radio', 'paper-crumple',
  'rubber-segment', 'spring-check', 'squish-switch', 'code-slots',
  'bell-toggle', 'branched-menu',
]

test('收藏页 21 项均有可运行目录条目和完整复用包', () => {
  const integrated = new Set([...reactBitsFavorites.map(item => item.id), 'flex-carousel', 'peek-rating'])
  assert.deepEqual([...integrated].sort(), favoriteIds.toSorted())
  for (const id of favoriteIds) {
    const entry = componentCatalog.find(item => item.id === id)
    assert.ok(entry, `${id} 未登记目录`)
    assert.equal(entry.preview, 'live', `${id} 未提供实时示例`)
    assert.ok(componentReferences[id], `${id} 未提供复制包`)
  }
})
