import assert from 'node:assert/strict'
import test from 'node:test'
import { filterOptions, leafIds, selectionState, toggleBranch } from '../src/components/ui/selection-model.ts'

test('下拉搜索支持中文片段、全拼和首字母，不改变源选项', () => {
  const options = [{ value: 'sz', label: '深圳', pinyin: 'shenzhen', initials: 'sz' }, { value: 'hz', label: '杭州', pinyin: 'hangzhou', initials: 'hz' }]
  for (const query of ['深', 'shen', ' SZ ']) assert.deepEqual(filterOptions(options, query).map(item => item.value), ['sz'])
  assert.equal(filterOptions(options, '').length, 2)
  assert.equal(filterOptions(options, '不存在').length, 0)
  assert.equal(options.length, 2)
})

test('树节点联动选择后代，半选可补全且不影响兄弟节点', () => {
  const branch = { value: 'front', label: '前端组', children: [{ value: 'framework', label: '框架' }, { value: 'infra', label: '基建' }] }
  const root = { value: 'root', label: '中心', children: [branch, { value: 'back', label: '后端' }] }
  assert.deepEqual(leafIds(root), ['framework', 'infra', 'back'])
  assert.equal(selectionState(root, []), 'none')
  assert.equal(selectionState(root, ['framework']), 'mixed')
  assert.deepEqual(toggleBranch(branch, ['framework', 'back']), ['framework', 'back', 'infra'])
  assert.deepEqual(toggleBranch(branch, ['framework', 'infra', 'back']), ['back'])
  assert.equal(selectionState(root, toggleBranch(root, [])), 'all')
  assert.deepEqual(toggleBranch(root, leafIds(root)), [])
})
