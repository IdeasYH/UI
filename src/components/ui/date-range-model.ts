export type DateRange = { start: string; end: string }
export const datePresets = ['今天', '昨天', '本周', '近七天', '近三十天', '本月', '上月', '本季度', '本年'] as const
export function dateKey(date: Date) { return date.toISOString().slice(0, 10) }
export function shiftDay(day: string, count: number) { const date = new Date(`${day}T00:00:00Z`); date.setUTCDate(date.getUTCDate() + count); return dateKey(date) }
export function shiftMonth(month: string, count: number) { const date = new Date(`${month}-01T00:00:00Z`); date.setUTCMonth(date.getUTCMonth() + count); return dateKey(date).slice(0, 7) }
export function monthDays(month: string) {
  const first = new Date(`${month}-01T00:00:00Z`)
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0))
  return { offset: (first.getUTCDay() + 6) % 7, days: Array.from({ length: last.getUTCDate() }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`) }
}
export function presetRange(preset: typeof datePresets[number], today: string): DateRange {
  if (preset === '本年') return { start: `${today.slice(0, 4)}-01-01`, end: `${today.slice(0, 4)}-12-31` }
  if (preset === '今天') return { start: today, end: today }
  if (preset === '本周') {
    const offset = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7
    const start = shiftDay(today, -offset)
    return { start, end: shiftDay(start, 6) }
  }
  if (preset === '昨天') { const day = shiftDay(today, -1); return { start: day, end: day } }
  if (preset === '近七天' || preset === '近三十天') return { start: shiftDay(today, preset === '近七天' ? -6 : -29), end: today }
  let month = today.slice(0, 7)
  let length = 1
  if (preset === '上月') month = shiftMonth(month, -1)
  if (preset === '本季度') { month = `${today.slice(0, 4)}-${String(Math.floor((Number(today.slice(5, 7)) - 1) / 3) * 3 + 1).padStart(2, '0')}`; length = 3 }
  return { start: `${month}-01`, end: shiftDay(`${shiftMonth(month, length)}-01`, -1) }
}
export function orderRange(first: string, second: string): DateRange { return first <= second ? { start: first, end: second } : { start: second, end: first } }
