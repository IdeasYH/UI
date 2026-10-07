export type FilterField = { id: string; label: string; pinyin?: string; initials?: string; type: 'text' | 'select' | 'number' | 'date'; options?: readonly { value: string; label: string; pinyin?: string; initials?: string; color?: string }[] }
export type FilterOperator = 'eq' | 'neq' | 'contains' | 'notContains' | 'gt' | 'lt' | 'empty' | 'notEmpty'
export type DateMode = 'exact' | 'today' | 'tomorrow' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'past7' | 'next7' | 'past30' | 'next30'
export type FilterCondition = { id: string; field: string; operator: FilterOperator; value: string; dateMode?: DateMode }
export type FilterValue = { conjunction: 'all' | 'any'; conditions: FilterCondition[] }
export const operatorLabels: Record<FilterOperator, string> = { eq: '等于', neq: '不等于', contains: '包含', notContains: '不包含', gt: '大于', lt: '小于', empty: '为空', notEmpty: '不为空' }
export const dateLabels: Record<DateMode, string> = { exact: '具体日期', today: '今天', tomorrow: '明天', yesterday: '昨天', thisWeek: '本周', lastWeek: '上周', thisMonth: '本月', lastMonth: '上月', past7: '过去 7 天内', next7: '未来 7 天内', past30: '过去 30 天内', next30: '未来 30 天内' }
export function operatorsFor(type: FilterField['type']): FilterOperator[] {
  return ['eq', 'neq', ...(type === 'text' ? ['contains', 'notContains'] as const : type === 'number' || type === 'date' ? ['gt', 'lt'] as const : []), 'empty', 'notEmpty']
}
export function formatDay(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
function validDay(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && formatDay(new Date(`${value}T12:00:00`)) === value }
/** Local calendar arithmetic avoids DST and UTC date-boundary shifts. Includes today in rolling ranges. */
export function dateBounds(mode: DateMode, value: string, now = new Date()): [string, string] | null {
  const day = (offset: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
  const monday = -((now.getDay() + 6) % 7)
  let start = day(0), end = day(0)
  switch (mode) {
    case 'exact': return validDay(value) ? [value, value] : null
    case 'tomorrow': start = end = day(1); break
    case 'yesterday': start = end = day(-1); break
    case 'thisWeek': start = day(monday); end = day(monday + 6); break
    case 'lastWeek': start = day(monday - 7); end = day(monday - 1); break
    case 'thisMonth': start = new Date(now.getFullYear(), now.getMonth(), 1); end = new Date(now.getFullYear(), now.getMonth() + 1, 0); break
    case 'lastMonth': start = new Date(now.getFullYear(), now.getMonth() - 1, 1); end = new Date(now.getFullYear(), now.getMonth(), 0); break
    case 'past7': start = day(-6); break
    case 'next7': end = day(6); break
    case 'past30': start = day(-29); break
    case 'next30': end = day(29); break
  }
  return [formatDay(start), formatDay(end)]
}
export function isConditionReady(condition: FilterCondition, fields: readonly FilterField[]) {
  const field = fields.find(item => item.id === condition.field)
  if (!field || !operatorsFor(field.type).includes(condition.operator)) return false
  if (condition.operator === 'empty' || condition.operator === 'notEmpty') return true
  if (field.type === 'date') return condition.dateMode !== undefined && condition.dateMode !== 'exact' || validDay(condition.value)
  if (!condition.value.trim()) return false
  if (field.type === 'number') return Number.isFinite(Number(condition.value))
  if (field.type === 'select') return !!field.options?.some(option => option.value === condition.value)
  return true
}
export function matchesFilter(record: Record<string, unknown>, fields: readonly FilterField[], filter: FilterValue, now = new Date()): boolean {
  const active = filter.conditions.filter(condition => isConditionReady(condition, fields))
  if (!active.length) return true
  const match = (condition: FilterCondition) => {
    const field = fields.find(item => item.id === condition.field)!
    const raw = record[field.id]
    const empty = raw === null || raw === undefined || raw === ''
    if (condition.operator === 'empty') return empty
    if (condition.operator === 'notEmpty') return !empty
    if (empty) return false
    let equal: boolean, greater: boolean, less: boolean
    if (field.type === 'date') {
      const bounds = dateBounds(condition.dateMode ?? 'exact', condition.value, now)
      if (!bounds || typeof raw !== 'string' || !validDay(raw)) return false
      equal = raw >= bounds[0] && raw <= bounds[1]; greater = raw > bounds[1]; less = raw < bounds[0]
    } else if (field.type === 'number') {
      if (typeof raw !== 'number' || !Number.isFinite(raw)) return false
      equal = raw === Number(condition.value); greater = raw > Number(condition.value); less = raw < Number(condition.value)
    } else {
      equal = String(raw) === condition.value; greater = false; less = false
    }
    switch (condition.operator) {
      case 'eq': return equal
      case 'neq': return !equal
      case 'gt': return greater
      case 'lt': return less
      case 'contains': return String(raw).toLocaleLowerCase().includes(condition.value.toLocaleLowerCase())
      case 'notContains': return !String(raw).toLocaleLowerCase().includes(condition.value.toLocaleLowerCase())
      default: return false
    }
  }
  return filter.conjunction === 'all' ? active.every(match) : active.some(match)
}

/** Ordered fuzzy matching; phonetics are supplied by the host to handle polyphonic names. */
export function matchesFilterSearch(option: { label: string; pinyin?: string; initials?: string }, query: string) {
  const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, '')
  const needle = normalize(query)
  return [option.label, option.pinyin, option.initials].some(text => {
    if (text === undefined) return false
    let index = 0
    for (const character of normalize(text)) if (character === needle[index]) index++
    return index === needle.length
  })
}
