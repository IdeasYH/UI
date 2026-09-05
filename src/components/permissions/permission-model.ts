import { templatePages } from '../../data/template-catalog.ts'

export const APPLICATION_ID = 'uimodel'
export const STORAGE_KEY = 'uimodel:system-permissions:v1'
export const permissionPages = templatePages.map((page) => ({ ...page, code: `page:${page.id}` }))
export const permissionActions = [
  ['org.create', '新增业务组'], ['org.edit', '编辑组织名称'], ['org.delete', '删除组织节点'],
  ['member.create', '录入组员'], ['member.edit', '编辑人员资料'], ['member.transfer', '调岗'], ['member.departure', '离职'],
  ['scope.configure', '配置数据查看范围'], ['tags.configure', '配置人员标签'], ['tags.manage', '管理标签库'], ['roles.assign', '分配功能角色'],
  ['org.reset', '恢复组织示例数据'],
].map(([code, title]) => ({ code, title, page: 'page:organization-figma' }))
permissionActions.push({ code: 'portal.enter', title: '进入工作台 / 系统入口', page: 'page:portal' })
export const visibilityCode = (code: string) => `visible:${code}`
export const allPermissionCodes = [...permissionPages, ...permissionActions].map((item) => item.code).concat(permissionActions.map((item) => visibilityCode(item.code)))
export type FunctionRole = { id: string; name: string; grants: string[] }
export type Subject = { type: 'role' | 'person'; id: string }
export type PermissionState = {
  applicationId: typeof APPLICATION_ID; version: 1; roles: FunctionRole[];
  bindings: Record<string, string[]>; entry: Record<string, boolean>;
  mode: 'admin' | 'test' | 'patrol'; subject: Subject; deniedStyle: 'hide' | 'disable';
  draft: { roleId: string; grants: string[] } | null;
}

export function initialPermissions(): PermissionState {
  return {
    applicationId: APPLICATION_ID, version: 1,
    roles: [{ id: 'manager', name: '组织管理员', grants: [...allPermissionCodes] }, { id: 'viewer', name: '只读成员', grants: permissionPages.map((p) => p.code).concat(permissionActions.map((a) => visibilityCode(a.code))) }],
    bindings: { 'person-zhou-lin': ['manager'], 'person-tian-jing': ['viewer'] }, entry: {},
    mode: 'admin', subject: { type: 'role', id: 'viewer' }, deniedStyle: 'disable', draft: null,
  }
}

export function evaluatePermission(state: PermissionState, code: string) {
  if (!allPermissionCodes.includes(code)) return { allowed: false, reason: '未登记的权限编码', sources: [] as string[] }
  if (state.subject.type === 'person' && state.entry[state.subject.id] === false) return { allowed: false, reason: 'HRM 系统准入已关闭（模拟）', sources: [] as string[] }
  const ids = state.subject.type === 'role' ? [state.subject.id] : state.bindings[state.subject.id] ?? []
  const roles = state.roles.filter((role) => ids.includes(role.id))
  const page = permissionActions.find((action) => action.code === code || visibilityCode(action.code) === code)?.page
  if (page && !roles.some((role) => role.grants.includes(page))) return { allowed: false, reason: '所属页面不可访问，按钮授权暂不生效', sources: [] as string[] }
  const sources = roles.filter((role) => role.grants.includes(code)).map((role) => role.name)
  return { allowed: sources.length > 0, sources, reason: sources.length ? `来自角色：${sources.join('、')}` : '本系统角色未授予此权限' }
}

export function buttonState(grants: string[], code: string): 'hidden' | 'disabled' | 'enabled' {
  return grants.includes(code) ? 'enabled' : grants.includes(visibilityCode(code)) ? 'disabled' : 'hidden'
}

export function setButtonState(grants: string[], code: string, state: 'hidden' | 'disabled' | 'enabled') {
  if (!permissionActions.some((a) => a.code === code)) return grants
  const next = grants.filter((item) => item !== code && item !== visibilityCode(code))
  if (state !== 'hidden') next.push(visibilityCode(code))
  if (state === 'enabled') next.push(code)
  return next
}

export function toggleCollapsed(collapsed: string[], code: string) {
  return collapsed.includes(code) ? collapsed.filter((id) => id !== code) : [...collapsed, code]
}

export function setGrant(grants: string[], code: string, enabled: boolean) {
  if (!allPermissionCodes.includes(code)) return grants
  return enabled ? [...new Set([...grants, code])] : grants.filter((item) => item !== code)
}

export const actionPermission = {
  'add-group': 'org.create', 'rename-group': 'org.edit', 'rename-department': 'org.edit',
  'delete-group': 'org.delete', 'delete-department': 'org.delete',
  'add-member': 'member.create', 'edit-member': 'member.edit', 'transfer-member': 'member.transfer', departure: 'member.departure',
} as const

// Only accept this demo's version and registered permission codes. A different
// application's state must never be imported as this system's role grants.
export function parsePermissions(raw: string): PermissionState | null {
  try {
    const value = JSON.parse(raw) as PermissionState
    if (value.applicationId !== APPLICATION_ID || value.version !== 1 || !Array.isArray(value.roles) || !value.roles.length) return null
    const validGrants = (items: unknown): items is string[] => Array.isArray(items) && items.every((item) => typeof item === 'string' && allPermissionCodes.includes(item))
    if (!value.roles.every((role) => typeof role.id === 'string' && typeof role.name === 'string' && !!role.name.trim() && validGrants(role.grants))) return null
    if (new Set(value.roles.map((role) => role.id)).size !== value.roles.length) return null
    const object = (item: unknown) => !!item && typeof item === 'object' && !Array.isArray(item)
    if (!object(value.bindings) || !Object.values(value.bindings).every((ids) => Array.isArray(ids) && ids.every((id) => value.roles.some((role) => role.id === id)))) return null
    if (!object(value.entry) || !Object.values(value.entry).every((enabled) => typeof enabled === 'boolean')) return null
    if (!['admin', 'test', 'patrol'].includes(value.mode) || !['hide', 'disable'].includes(value.deniedStyle)) return null
    if (!value.subject || !['role', 'person'].includes(value.subject.type) || typeof value.subject.id !== 'string') return null
    if (value.subject.type === 'role' && !value.roles.some((role) => role.id === value.subject.id)) return null
    if (value.draft !== null && (!value.draft || !value.roles.some((role) => role.id === value.draft!.roleId) || !validGrants(value.draft.grants))) return null
    if (value.mode === 'patrol' && !value.draft) return null
    return value
  } catch { return null }
}
