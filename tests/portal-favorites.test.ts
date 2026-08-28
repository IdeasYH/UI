import assert from 'node:assert/strict'
import test from 'node:test'
import { PORTAL_FAVORITES_KEY, readPortalFavorites } from '../src/lib/portal-favorites.ts'

test('首次渲染及 StrictMode 重复初始化直接读取已保存收藏', () => {
  const stored = JSON.stringify(['hrm', 'operator'])
  const storage = { getItem(key: string) { assert.equal(key, PORTAL_FAVORITES_KEY); return stored } }
  assert.deepEqual(readPortalFavorites(storage), ['hrm', 'operator'])
  assert.deepEqual(readPortalFavorites(storage), ['hrm', 'operator'])
})

test('损坏、非数组和不可用的存储不阻断门户', () => {
  for (const stored of [null, '{', 'null', '{}', '"hrm"']) {
    assert.deepEqual(readPortalFavorites({ getItem: () => stored }), [])
  }
  assert.deepEqual(readPortalFavorites({ getItem() { throw new Error('Storage unavailable') } }), [])
  assert.deepEqual(readPortalFavorites({ getItem: () => '["hrm",null,7,"operator"]' }), ['hrm', 'operator'])
})
