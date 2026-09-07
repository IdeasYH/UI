import { permissionPages, permissionActions } from './permission-model.ts'
import { demoDepartmentData } from '../../data/figma-organization.ts'

export type Org = { id: string; name: string; parent: string | null }
export type Person = { id: string; name: string; hrmRole: string; enabled: boolean; admitted: boolean }
export type Appointment = { id: string; person: string; org: string; title: string; kind?: 'responsible' | 'member'; active: boolean }
export type Scope = { mode: 'none' | 'self' | 'org' | 'tree' | 'all' | 'custom'; nodes: string[]; descendants: boolean; subtreeNodes?: string[] }
export type ButtonState = 'hidden' | 'disabled' | 'enabled'
export type PageGrant = { access: boolean; full: boolean; buttons: Record<string, ButtonState> }
export type Role = { id: string; name: string; pages: Record<string, PageGrant>; read: Scope; write: Scope }
export type Assignment = { id: string; role: string; nodes: string[]; descendants: boolean; subtreeNodes?: string[]; appointments: string[]; read: Scope | null; write: Scope | null }
export type Fact = { id: string; name: string; org: string; owner: string; closed: boolean }
export type TopologyState = { version: 2; orgs: Org[]; people: Person[]; appointments: Appointment[]; roles: Role[]; assignments: Assignment[]; facts: Fact[] }
export const KEY = 'uimodel:topology-authorization:v2'
export const catalog: { id:string; name:string; href?:string; actions:{id:string;name:string}[] }[] = [
  { id: 'leads', name: '线索管理', actions: [{ id: 'read', name: '查看线索' }, { id: 'edit', name: '编辑线索' }, { id: 'assign', name: '分配线索' }, { id: 'delete', name: '删除线索' }, { id: 'export', name: '导出线索' }] },
  { id: 'reports', name: '业务报表', actions: [{ id: 'read', name: '查看报表' }, { id: 'export', name: '导出报表' }] },
  { id: 'organization', name: '组织管理', href: '/organization/figma', actions: [{ id: 'read', name: '查看组织' }, { id: 'create', name: '新增下级节点' }, { id: 'appoint', name: '添加任职' }, { id: 'edit', name: '编辑或移动组织' }, { id: 'authorize', name: '管理授权' }] },
]
catalog.push(...permissionPages.filter(p => p.id !== 'organization-figma').map(p => ({id:p.id,name:p.title,href:p.href,actions:permissionActions.filter(a => a.page === p.code).map(a => ({id:a.code,name:a.title}))})))
export const scope = (mode: Scope['mode']): Scope => ({ mode, nodes: [], descendants: false })
export const emptyRole = (id: string, name: string): Role => ({ id, name, pages: {}, read: scope('none'), write: scope('none') })
export const emptyPage = (): PageGrant => ({ access: false, full: false, buttons: {} })
export function initialTopology(): TopologyState {
  const orgs: Org[] = [{ id: 'department', name: demoDepartmentData.deptName, parent: null }, ...demoDepartmentData.groups.map(g => ({ id: g.id, name: g.groupName, parent: 'department' }))]
  const people = new Map<string, Person>([['admin', { id: 'admin', name: 'admin', hrmRole: '系统管理', enabled: true, admitted: true }]])
  const appointments: Appointment[] = []
  const add = (id: string, name: string, org: string, title: string) => {
    people.set(id, { id, name, hrmRole: title.includes('负责人') ? '业务管理' : '业务人员', enabled: true, admitted: true })
    appointments.push({ id: `appointment:${org}:${id}`, person: id, org, title, active: true })
  }
  demoDepartmentData.managers.forEach(p => add(p.personId, p.name, 'department', '部门负责人'))
  demoDepartmentData.groups.forEach(g => { g.leaders.forEach(p => add(p.personId, p.name, g.id, '组负责人')); g.members.forEach(p => add(p.id, p.name, g.id, p.position)) })
  const member = emptyRole('member', '业务专员'); member.read = scope('self'); member.write = scope('self'); member.pages.leads = { access: true, full: false, buttons: { read: 'enabled', edit: 'enabled' } }
  const manager = emptyRole('manager', '组织管理'); manager.read = scope('tree'); manager.write = scope('tree'); manager.pages.leads = { access: true, full: true, buttons: { delete: 'hidden' } }; manager.pages.reports = { access: true, full: true, buttons: {} }
  const viewer = emptyRole('viewer', '组织只读'); viewer.read = scope('tree'); viewer.pages.leads = { access: true, full: false, buttons: { read: 'enabled', edit: 'disabled' } }; viewer.pages.reports = { access: true, full: false, buttons: { read: 'enabled' } }
  return { version: 2, orgs, people: [...people.values()], appointments, roles: [member, manager, viewer], assignments: [], facts: appointments.map((a, i) => ({ id: `F${i + 1}`, name: `${people.get(a.person)!.name}的示例线索`, org: a.org, owner: a.person, closed: i === 1 })) }
}
export function descendants(orgs: Org[], root: string): string[] {
  const found = new Set<string>(); const queue = [root]
  while (queue.length) { const id = queue.shift()!; if (found.has(id) || !orgs.some(o => o.id === id)) continue; found.add(id); queue.push(...orgs.filter(o => o.parent === id).map(o => o.id)) }
  return [...found]
}
export function depth(orgs: Org[], id: string): number {
  const seen = new Set<string>(); let node = orgs.find(o => o.id === id); let level = 0
  while (node && !seen.has(node.id)) { seen.add(node.id); level++; node = orgs.find(o => o.id === node!.parent) }
  return level
}
// An explicit per-node choice preserves mixed node-only/subtree intent.
export function nodeIncludesChildren(value: { descendants: boolean; subtreeNodes?: string[] }, id: string) {
  return value.subtreeNodes ? value.subtreeNodes.includes(id) : value.descendants
}
export function toggleNode<T extends { nodes: string[]; descendants: boolean; subtreeNodes?: string[] }>(value: T, id: string, tree: boolean): T {
  const remove = value.nodes.includes(id) && nodeIncludesChildren(value,id) === tree
  const nodes = remove ? value.nodes.filter(n => n !== id) : [...new Set([...value.nodes,id])]
  const subtreeNodes = (value.subtreeNodes ?? (value.descendants ? value.nodes : [])).filter(n => n !== id && nodes.includes(n))
  if (!remove && tree) subtreeNodes.push(id)
  return { ...value,nodes,subtreeNodes }
}
export function recipients(state: TopologyState, grant: Assignment): Appointment[] {
  const nodes = new Set(grant.nodes.flatMap(id => nodeIncludesChildren(grant,id) ? descendants(state.orgs, id) : [id]))
  return state.appointments.filter(a => a.active && state.orgs.some(o => o.id === a.org) && (nodes.has(a.org) || grant.appointments.includes(a.id)))
}
export function sources(state: TopologyState, person: string, appointment?: string) {
  return state.assignments.flatMap(grant => {
    const role = state.roles.find(r => r.id === grant.role)
    return role ? recipients(state, grant).filter(a => a.person === person && (!appointment || a.id === appointment)).map(a => ({ grant, role, appointment: a })) : []
  })
}
export function scopeNodes(state: TopologyState, value: Scope, appointment: Appointment): string[] {
  if (value.mode === 'all') return state.orgs.map(o => o.id)
  if (value.mode === 'org') return [appointment.org]
  if (value.mode === 'tree') return descendants(state.orgs, appointment.org)
  if (value.mode === 'custom') return [...new Set(value.nodes.flatMap(id => nodeIncludesChildren(value,id) ? descendants(state.orgs, id) : [id]))]
  return []
}
function scopeContains(state: TopologyState, value: Scope, a: Appointment, org: string, owner: string) {
  return value.mode === 'all' || (value.mode === 'self' ? owner === a.person : scopeNodes(state, value, a).includes(org))
}
// Structural subset validation uses symbolic owners, not current fact rows: an empty
// organization must not accidentally make an over-broad write policy look safe.
export function validRanges(state: TopologyState, read: Scope, write: Scope, a: Appointment) {
  if (write.mode === 'none') return true
  if (read.mode === 'all') return true
  if (write.mode === 'all') return false
  const orgs = [...state.orgs.map(o => o.id), '__unassigned__']
  return orgs.every(org => [a.person, '__other__'].every(owner => !scopeContains(state, write, a, org, owner) || scopeContains(state, read, a, org, owner)))
}
export function grantErrors(state: TopologyState, grant: Assignment): string[] {
  const role = state.roles.find(r => r.id === grant.role)
  if (!role) return ['请选择有效角色。']
  if (!grant.nodes.length && !grant.appointments.length) return ['请在拓扑上选择组织或人员。']
  const targets = recipients(state, grant)
  const contexts = targets.length ? targets : state.orgs.filter(o => grant.nodes.includes(o.id)).map(o => ({ id: '', person: '__person__', org: o.id, title: '', active: true }))
  if (contexts.some(a => !validRanges(state, grant.read ?? role.read, grant.write ?? role.write, a))) return ['操作范围不能超过查看范围，请调整角色或本次指定范围。']
  return []
}
export function actionState(role: Role, page: string, action: string): ButtonState {
  const policy = role.pages[page]; return policy?.buttons[action] ?? (policy?.full ? 'enabled' : 'hidden')
}
export function admitted(state: TopologyState, person: string) { const p = state.people.find(p => p.id === person); return !!p?.enabled && !!p.admitted }
export function pageAllowed(state: TopologyState, person: string, page: string, appointment?: string) {
  return admitted(state, person) && (person === 'admin' || sources(state, person, appointment).some(s => s.role.pages[page]?.access))
}
export function effectiveButton(state: TopologyState, person: string, page: string, action: string, appointment?: string): ButtonState {
  if (!pageAllowed(state, person, page, appointment)) return 'hidden'
  if (person === 'admin') return 'enabled'
  const states = sources(state, person, appointment).map(s => actionState(s.role, page, action))
  return states.includes('enabled') ? 'enabled' : states.includes('disabled') ? 'disabled' : 'hidden'
}
export function allowedFact(state: TopologyState, person: string, page: string, action: string, fact: Fact, appointment?: string) {
  if (!pageAllowed(state, person, page, appointment)) return false
  if (person === 'admin') return true
  // Never combine the action from one grant with the data range of another grant.
  return sources(state, person, appointment).some(({ grant, role, appointment: a }) => {
    const read = grant.read ?? role.read; const write = grant.write ?? role.write
    return actionState(role, page, action) === 'enabled' && scopeContains(state, read, a, fact.org, fact.owner) && (['read', 'export'].includes(action) || scopeContains(state, write, a, fact.org, fact.owner))
  })
}
export function moveOrg(state: TopologyState, id: string, parent: string): TopologyState {
  const node = state.orgs.find(o => o.id === id)
  if (!node?.parent || !state.orgs.some(o => o.id === parent) || descendants(state.orgs, id).includes(parent)) throw new Error('根节点不能移动，组织不能移到自身或下级。')
  return { ...state, orgs: state.orgs.map(o => o.id === id ? { ...o, parent } : o) }
}
export function parseTopology(raw: string): TopologyState | null {
  try {
    const v = JSON.parse(raw) as TopologyState
    if (v.version !== 2 || ![v.orgs, v.people, v.appointments, v.roles, v.assignments, v.facts].every(Array.isArray) || !v.orgs.length) return null
    const unique = (items: { id: string }[]) => items.every(x => typeof x.id === 'string' && !!x.id) && new Set(items.map(x => x.id)).size === items.length
    if (![v.orgs, v.people, v.appointments, v.roles, v.assignments, v.facts].every(unique)) return null
    if (v.orgs.filter(o => o.parent === null).length !== 1 || v.orgs.some(o => typeof o.name !== 'string' || (o.parent !== null && !v.orgs.some(p => p.id === o.parent)))) return null
    if (v.orgs.some(o => o.parent !== null && descendants(v.orgs, o.id).includes(o.parent))) return null
    const strings = (x: unknown): x is string[] => Array.isArray(x) && x.every(i => typeof i === 'string')
    const validScope = (s: Scope) => s && ['none','self','org','tree','all','custom'].includes(s.mode) && strings(s.nodes) && s.nodes.every(id => v.orgs.some(o => o.id === id)) && typeof s.descendants === 'boolean' && (s.subtreeNodes === undefined || (strings(s.subtreeNodes) && s.subtreeNodes.every(id => s.nodes.includes(id))))
    if (!v.people.some(p => p.id === 'admin') || v.people.some(p => typeof p.name !== 'string' || typeof p.hrmRole !== 'string' || typeof p.enabled !== 'boolean' || typeof p.admitted !== 'boolean')) return null
    if (v.appointments.some(a => (a.kind !== undefined && !['responsible','member'].includes(a.kind)) || !v.people.some(p => p.id === a.person) || !v.orgs.some(o => o.id === a.org) || typeof a.title !== 'string' || typeof a.active !== 'boolean')) return null
    if (v.roles.some(r => typeof r.name !== 'string' || !validScope(r.read) || !validScope(r.write) || !r.pages || typeof r.pages !== 'object' || Object.entries(r.pages).some(([id,p]) => !catalog.some(c => c.id === id) || typeof p.access !== 'boolean' || typeof p.full !== 'boolean' || !p.buttons || Object.values(p.buttons).some(b => !['hidden','disabled','enabled'].includes(b))))) return null
    if (v.assignments.some(g => !v.roles.some(r => r.id === g.role) || !strings(g.nodes) || g.nodes.some(id => !v.orgs.some(o => o.id === id)) || !strings(g.appointments) || g.appointments.some(id => !v.appointments.some(a => a.id === id)) || typeof g.descendants !== 'boolean' || (g.subtreeNodes !== undefined && (!strings(g.subtreeNodes) || g.subtreeNodes.some(id => !g.nodes.includes(id)))) || (g.read !== null && !validScope(g.read)) || (g.write !== null && !validScope(g.write)))) return null
    if (v.facts.some(f => typeof f.name !== 'string' || typeof f.org !== 'string' || typeof f.owner !== 'string' || typeof f.closed !== 'boolean')) return null
    return v
  } catch { return null }
}
