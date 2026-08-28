import type { PersonnelRecord } from '../../data/demo-personnel'

// 输入已经限定组织范围；统计不随列表的任职状态或搜索词改变。
export function personnelOverview(people: readonly PersonnelRecord[], month: string) {
  const active = people.filter((person) => person.status === 'active')
  return {
    active: active.length,
    pending: people.filter((person) => person.status === 'pending').length,
    joinedThisMonth: active.filter((person) => person.joinedAt.startsWith(`${month}-`)).length,
    withoutAccount: active.filter((person) => person.accountStatus === '未开通').length,
  }
}

export function personnelPagination<T>(rows: readonly T[], requestedPage: number, size: number) {
  const pages = Math.max(1, Math.ceil(rows.length / size))
  const page = Math.min(Math.max(1, requestedPage), pages)
  const items = rows.slice((page - 1) * size, page * size)
  const buttons: (number | '…')[] = []
  for (let number = 1; number <= pages; number++) {
    if (number === 1 || number === pages || Math.abs(number - page) <= 1) buttons.push(number)
    else if (buttons.at(-1) !== '…') buttons.push('…')
  }
  return { items, page, pages, buttons }
}
