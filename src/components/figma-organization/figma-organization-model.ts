import type { GroupMember, GroupNode, SingleDepartmentDemo } from '../../data/figma-organization.ts'
import { normalizePersonSearch } from '../person-picker/person-search.ts'
import { matchesOrganization } from './organization-search.ts'

export type FigmaGroup = GroupNode
export type FigmaDepartment = SingleDepartmentDemo
export type MemberDraft = Pick<GroupMember, 'name' | 'code' | 'position' | 'level'>
export type FigmaAction =
  | { type: 'rename-department'; name: string }
  | { type: 'delete-department' }
  | { type: 'add-group'; id: string; name: string }
  | { type: 'rename-group'; groupId: string; name: string }
  | { type: 'delete-group'; groupId: string }
  | { type: 'add-member'; groupId: string; id: string; draft: MemberDraft }
  | { type: 'edit-member'; memberId: string; draft: Pick<MemberDraft, 'name' | 'position' | 'level'> }
  | { type: 'transfer-member'; memberId: string; groupId: string }
  | { type: 'departure'; memberId: string }

export type FigmaDialogAction =
  | { type: 'rename-department' }
  | { type: 'delete-department' }
  | { type: 'add-group' }
  | { type: 'rename-group'; groupId: string }
  | { type: 'delete-group'; groupId: string }
  | { type: 'add-member'; groupId: string }
  | { type: 'edit-member'; memberId: string }
  | { type: 'transfer-member'; memberId: string }
  | { type: 'departure'; memberId: string }

export function kpiTone(rate: number | null) {
  if (rate === null || !Number.isFinite(rate) || rate < 0 || rate > 100) return 'unknown'
  return rate >= 90 ? 'excellent' : rate >= 75 ? 'good' : 'warning'
}

export function findFigmaMember(department: FigmaDepartment, memberId: string) {
  for (const group of department.groups) {
    const member = group.members.find((candidate) => candidate.id === memberId)
    if (member) return { group, member }
  }
  return null
}

export function responsibleAssignmentCounts(department: FigmaDepartment) {
  const counts = new Map<string, number>()
  const record = (personId: string) => counts.set(personId, (counts.get(personId) ?? 0) + 1)
  department.managers.forEach((person) => record(person.personId))
  department.groups.forEach((group) => group.leaders.forEach((person) => record(person.personId)))
  return counts
}

export function crossLevelResponsiblePersonIds(department: FigmaDepartment) {
  const departmentIds = new Set(department.managers.map((person) => person.personId))
  return new Set(department.groups.flatMap((group) => group.leaders).filter((person) => departmentIds.has(person.personId)).map((person) => person.personId))
}

export function filterFigmaGroups(department: FigmaDepartment, query: string): FigmaGroup[] {
  const keyword = normalizePersonSearch(query)
  if (!keyword) return department.groups
  const matches = (...values: (string | undefined)[]) => values.some((value) => normalizePersonSearch(value).includes(keyword))
  if (matchesOrganization(department.deptName, query) || matches(...department.managers.flatMap((person) => [person.name, person.code]))) return department.groups
  return department.groups.flatMap((group) => {
    if (matchesOrganization(group.groupName, query) || matches(...group.leaders.flatMap((person) => [person.name, person.code]))) return [group]
    const members = group.members.filter((member) => matches(member.name, member.code, member.loginAccount))
    return members.length ? [{ ...group, members }] : []
  })
}

export function nextDemoCode(department: FigmaDepartment) {
  const used = new Set([...department.managers.map((person) => person.code), ...department.groups.flatMap((group) => [...group.leaders.map((person) => person.code), ...group.members.map((member) => member.code)])].map((code) => code.toUpperCase()))
  let number = 350
  while (used.has(`E${String(number).padStart(6, '0')}`)) number++
  return `E${String(number).padStart(6, '0')}`
}

export function applyFigmaAction(department: FigmaDepartment, action: FigmaAction): { department: FigmaDepartment; error: string | null } {
  const reject = (error: string) => ({ department, error })
  const accept = (groups: FigmaGroup[], totalCount = department.totalCount) => ({ department: { ...department, groups, totalCount }, error: null })

  if (action.type === 'rename-department') {
    const name = action.name.trim()
    if (!name || name.length > 40) return reject('请输入 1 至 40 个字符的部门名称。')
    return { department: { ...department, deptName: name }, error: null }
  }

  if (action.type === 'delete-department') {
    // The demo has one mandatory root; deleting it must not pretend to succeed or cascade.
    if (department.groups.length || department.managers.length || department.totalCount !== 0) {
      return reject('部门仍有子组、负责人或人员，请先迁移人员与子组并解除负责人任职；当前单根示例不支持删除根部门。')
    }
    return reject('当前单根示例不支持删除根部门；本次没有删除任何组织或人员。')
  }

  if (action.type === 'delete-group') {
    const group = department.groups.find((item) => item.id === action.groupId)
    if (!group) return reject('业务组已不存在。')
    // memberCount is a source summary, while members is only a sample list: check both.
    if (group.leaders.length || group.memberCount !== 0 || group.members.length) {
      return reject('业务组仍有负责人或人员，请先迁移人员并解除负责人任职，再删除空组织；删除不会自动移除人员。')
    }
    return accept(department.groups.filter((item) => item.id !== action.groupId))
  }

  if (action.type === 'add-group' || action.type === 'rename-group') {
    const name = action.name.trim()
    if (!name || name.length > 40) return reject('请输入 1 至 40 个字符的业务组名称。')
    if (department.groups.some((group) => normalizePersonSearch(group.groupName) === normalizePersonSearch(name) && (action.type === 'add-group' || group.id !== action.groupId))) return reject('已有同名业务组，请使用其他名称。')
    if (action.type === 'add-group') {
      if (department.groups.some((group) => group.id === action.id)) return reject('业务组编号重复。')
      return accept([...department.groups, { id: action.id, groupName: name, kpiRate: null, leaders: [], memberCount: 0, members: [] }])
    }
    if (!department.groups.some((group) => group.id === action.groupId)) return reject('业务组已不存在。')
    return accept(department.groups.map((group) => group.id === action.groupId ? { ...group, groupName: name } : group))
  }

  if (action.type === 'add-member' || action.type === 'edit-member') {
    const { name, position, level } = action.draft
    if (![name, position, level].every((value) => value.trim())) return reject('请填写姓名、岗位和职级。')
    if (name.trim().length > 20 || position.trim().length > 40 || level.trim().length > 30) return reject('姓名最多 20 字，岗位最多 40 字，职级最多 30 字。')
    if (action.type === 'edit-member') {
      if (!findFigmaMember(department, action.memberId)) return reject('该组员已不在当前名录中。')
      return accept(department.groups.map((group) => ({ ...group, members: group.members.map((member) => member.id === action.memberId ? { ...member, name: name.trim(), position: position.trim(), level: level.trim() } : member) })))
    }
    const code = action.draft.code.trim()
    if (!code || code.length > 30) return reject('请输入有效工号，最多 30 个字符。')
    if (!department.groups.some((group) => group.id === action.groupId)) return reject('业务组已不存在。')
    const codes = [...department.managers.map((person) => person.code), ...department.groups.flatMap((group) => [...group.leaders.map((person) => person.code), ...group.members.map((member) => member.code)])]
    if (codes.some((value) => normalizePersonSearch(value) === normalizePersonSearch(code))) return reject('工号已存在，请检查后重新填写。')
    if (findFigmaMember(department, action.id)) return reject('人员编号重复。')
    const member: GroupMember = { id: action.id, name: name.trim(), code, position: position.trim(), level: level.trim(), joinDate: '', accountStatus: 'unopened', loginAccount: '未开通', onboardingDocs: 'pending', kpiRate: null }
    // Keep the source's summary count independent of its deliberately abbreviated member list.
    return accept(department.groups.map((group) => group.id === action.groupId ? { ...group, memberCount: group.memberCount + 1, members: [...group.members, member] } : group), department.totalCount + 1)
  }

  const current = findFigmaMember(department, action.memberId)
  if (!current) return reject('该组员已不在当前名录中。')
  if (action.type === 'transfer-member') {
    if (action.groupId === current.group.id) return reject('请选择不同于原业务组的目标组织。')
    if (!department.groups.some((group) => group.id === action.groupId)) return reject('请选择有效的目标业务组。')
    return accept(department.groups.map((group) => {
      if (group.id === current.group.id) return { ...group, memberCount: group.memberCount - 1, members: group.members.filter((member) => member.id !== action.memberId) }
      if (group.id === action.groupId) return { ...group, memberCount: group.memberCount + 1, members: [...group.members, current.member] }
      return group
    }))
  }
  return accept(department.groups.map((group) => group.id === current.group.id ? { ...group, memberCount: group.memberCount - 1, members: group.members.filter((member) => member.id !== action.memberId) } : group), department.totalCount - 1)
}

export function canvasScale(value: number) {
  return Math.min(1.4, Math.max(0.1, Math.round(value * 100) / 100))
}

export function fitFigmaCanvas(viewport: { width: number; height: number }, content: { width: number; height: number }) {
  const scale = canvasScale(Math.min((viewport.width - 32) / content.width, (viewport.height - 64) / content.height, 1))
  return { scale, x: (viewport.width - content.width * scale) / 2, y: 48 }
}
