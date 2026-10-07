import test from 'node:test'
import assert from 'node:assert/strict'
import { filterComponentCatalog } from '../src/data/template-catalog.ts'
import { matchesFilter, matchesFilterSearch, dateBounds, type FilterField, type FilterValue } from '../src/components/ui/condition-filter-model.ts'

const fields: FilterField[] = [{ id: 'name', label: '名称', type: 'text' }, { id: 'date', label: '日期', type: 'date' }, { id: 'amount', label: '数量', type: 'number' }]
test('稳定组件 ID 可直接搜索定位', () => {
  assert.equal(filterComponentCatalog('feishu-condition-filter')[0]?.id, 'feishu-condition-filter')
})
test('所有与任一组合条件；空草稿不参与，零值有效，缺失不作为零', () => {
  const value: FilterValue = { conjunction: 'all', conditions: [{ id: 'a', field: 'name', operator: 'contains', value: '甲' }, { id: 'b', field: 'amount', operator: 'eq', value: '0' }] }
  assert.equal(matchesFilter({ name: '甲乙', amount: 0 }, fields, value), true)
  assert.equal(matchesFilter({ name: '甲乙' }, fields, value), false)
  assert.equal(matchesFilter({ name: '甲乙', amount: 5 }, fields, { ...value, conjunction: 'any' }), true)
  assert.equal(matchesFilter({}, fields, { conjunction: 'any', conditions: [{ id: 'c', field: 'name', operator: 'eq', value: '' }] }), true)
})
test('日期快捷范围按本地日历含首尾，本周从周一开始，跨年与闰月正确', () => {
  assert.deepEqual(dateBounds('lastWeek', '', new Date(2026, 0, 1)), ['2025-12-22', '2025-12-28'])
  assert.deepEqual(dateBounds('lastMonth', '', new Date(2024, 2, 12)), ['2024-02-01', '2024-02-29'])
  assert.deepEqual(dateBounds('past7', '', new Date(2026, 0, 3)), ['2025-12-28', '2026-01-03'])
  assert.equal(dateBounds('exact', '2026-02-30', new Date()), null)
  const filter: FilterValue = { conjunction: 'all', conditions: [{ id: 'a', field: 'date', operator: 'eq', value: '', dateMode: 'thisWeek' }] }
  assert.equal(matchesFilter({ date: '2026-10-05' }, fields, filter, new Date(2026, 9, 7)), true)
  assert.equal(matchesFilter({ date: '2026-10-12' }, fields, filter, new Date(2026, 9, 7)), false)
})

test('字段和选项支持中文模糊、全拼和首字母，忽略大小写与空格', () => {
  const option = { label: '合作状态', pinyin: 'hezuozhuangtai', initials: 'hzzt' }
  for (const query of ['合态', 'hezuo', ' HZ ZT ', 'hzt', '']) assert.equal(matchesFilterSearch(option, query), true, query)
  assert.equal(matchesFilterSearch(option, '日期'), false)
  assert.equal(matchesFilterSearch({ label: '自定义' }, '自义'), true)
})
