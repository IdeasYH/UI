import assert from 'node:assert/strict'
import test from 'node:test'
import { monthDays, presetRange, shiftMonth, orderRange } from '../src/components/ui/date-range-model.ts'
test('本周为周一至周日，支持周日及跨年边界', () => {
  assert.deepEqual(presetRange('本周', '2026-10-03'), { start: '2026-09-28', end: '2026-10-04' })
  assert.deepEqual(presetRange('本周', '2026-10-04'), { start: '2026-09-28', end: '2026-10-04' })
  assert.deepEqual(presetRange('本周', '2026-01-01'), { start: '2025-12-29', end: '2026-01-04' })
})
test('快捷日期含首尾且正确跨年、闰月和季度', () => {
  assert.deepEqual(presetRange('近七天', '2026-01-03'), { start: '2025-12-28', end: '2026-01-03' })
  assert.deepEqual(presetRange('近三十天', '2026-10-03'), { start: '2026-09-04', end: '2026-10-03' })
  assert.deepEqual(presetRange('昨天', '2026-01-01'), { start: '2025-12-31', end: '2025-12-31' })
  assert.deepEqual(presetRange('上月', '2024-03-10'), { start: '2024-02-01', end: '2024-02-29' })
  assert.deepEqual(presetRange('本季度', '2026-10-03'), { start: '2026-10-01', end: '2026-12-31' })
  assert.equal(monthDays('2024-02').days.length, 29)
  assert.equal(shiftMonth('2026-01', -12), '2025-01')
  assert.deepEqual(orderRange('2026-10-20', '2026-10-01'), { start: '2026-10-01', end: '2026-10-20' })
})
