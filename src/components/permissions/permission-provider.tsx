import { useEffect, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight, Eye, MousePointer2, ShieldCheck, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Dialog } from '../ui/dialog'
import { Input } from '../ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { demoDepartmentData } from '../../data/figma-organization'
import { PermissionContext, usePermissions } from './permission-context'
import { buttonState, setButtonState, toggleCollapsed, visibilityCode, evaluatePermission, initialPermissions, parsePermissions, permissionActions, permissionPages, setGrant, STORAGE_KEY, type PermissionState } from './permission-model'

const people = [...new Map([
  ...demoDepartmentData.managers.map((p) => [p.personId, { id: p.personId, name: p.name }] as const),
  ...demoDepartmentData.groups.flatMap((g) => [...g.leaders.map((p) => [p.personId, { id: p.personId, name: p.name }] as const), ...g.members.map((p) => [p.id, { id: p.id, name: p.name }] as const)]),
]).values()]

function load() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { state: initialPermissions(), warning: '' }
    const state = parsePermissions(raw)
    return { state: state ?? initialPermissions(), warning: state ? '' : '权限示例缓存无效，已恢复默认；请重新检查配置。' }
  } catch { return { state: initialPermissions(), warning: '浏览器存储不可用，配置仅在当前页面内存保存。' } }
}

function Choice({ label, value, items, onChange, disabled = false }: { label: string; value: string; items: { id: string; name: string }[]; onChange: (id: string) => void; disabled?: boolean }) {
  return <DropdownMenu><DropdownMenuTrigger variant="outline" aria-label={label} disabled={disabled}>{label}：{items.find((item) => item.id === value)?.name ?? '未选择'}<ChevronDown size={14} /></DropdownMenuTrigger><DropdownMenuContent className="perm-menu">{items.map((item) => <DropdownMenuItem key={item.id} onSelect={() => onChange(item.id)}>{item.name}{item.id === value && ' ✓'}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
}

function ButtonAccess({ code, grants, onChange }: { code: string; grants: string[]; onChange: (value: 'hidden' | 'disabled' | 'enabled') => void }) {
  return <div className="perm-access-options" role="group" aria-label={`按钮状态 ${code}`}>{(['hidden', 'disabled', 'enabled'] as const).map((value, i) => <Button key={value} variant="outline" aria-pressed={buttonState(grants, code) === value} onClick={() => onChange(value)}>{['隐藏', '可见不可用', '可见可用'][i]}</Button>)}</div>
}

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(load)
  const [state, setState] = useState<PermissionState>(initial.state)
  const [warning, setWarning] = useState(initial.warning)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'tree' | 'test'>('tree')
  const [activeRole, setActiveRole] = useState(state.draft?.roleId ?? state.roles[0].id)
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<string[]>([])
  const [newName, setNewName] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState<string | null>(null)
  const [assignment, setAssignment] = useState<{ id: string; name: string } | null>(null)
  const [assignmentRoles, setAssignmentRoles] = useState<string[]>([])
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
    catch { setWarning('浏览器存储不可用，跨页面配置可能丢失；当前内存设置仍可测试。') }
  }, [state])
  const role = state.roles.find((r) => r.id === (state.draft?.roleId ?? activeRole)) ?? state.roles[0]
  const grants = state.draft?.grants ?? role.grants
  const dirtyCount = new Set([...role.grants, ...grants].filter((code) => role.grants.includes(code) !== grants.includes(code))).size
  const toggle = (code: string, enabled: boolean) => setState((old) => ({ ...old, draft: { roleId: role.id, grants: setGrant(old.draft?.grants ?? role.grants, code, enabled) } }))
  const changeButton = (code: string, value: 'hidden' | 'disabled' | 'enabled') => setState((old) => ({ ...old, draft: { roleId: role.id, grants: setButtonState(old.draft?.grants ?? role.grants, code, value) } }))
  const save = () => {
    setState((old) => ({ ...old, mode: old.mode === 'patrol' ? 'admin' : old.mode, roles: old.roles.map((r) => r.id === role.id ? { ...r, grants } : r), draft: null }))
    setMessage(`已保存「${role.name}」；影响 ${(Object.values(state.bindings).filter((ids) => ids.includes(role.id))).length} 名已分配人员。`)
  }
  const cancel = () => { setState((old) => ({ ...old, draft: null, mode: old.mode === 'patrol' ? 'admin' : old.mode })); setTarget(null); setMessage('已放弃权限草稿。') }
  const can = (code: string) => state.mode !== 'test' || evaluatePermission(state, code).allowed
  const inspect = (code: string) => { if (state.mode === 'patrol') setTarget(code) }
  const launch = () => { setOpen(true); setMessage('') }
  const subjectName = state.subject.type === 'role' ? state.roles.find((r) => r.id === state.subject.id)?.name : people.find((p) => p.id === state.subject.id)?.name ?? state.subject.id
  const resources = [...permissionPages, ...permissionActions]
  return <PermissionContext.Provider value={{ state, can, reason: (code) => evaluatePermission(state, code).reason, inspect, launch, assign: (person) => { setAssignment(person); setAssignmentRoles(state.bindings[person.id] ?? []) } }}>
    {state.mode !== 'admin' && <div className={`perm-mode-bar is-${state.mode}`} role="status"><span>{state.mode === 'patrol' ? `现场配置 · ${role.name} · 点击带虚线按钮只配置权限` : `测试身份 · ${subjectName} · 使用已保存授权`}</span><Button variant="outline" onClick={launch}>权限控制台{state.draft ? ` · 草稿 ${dirtyCount} 项` : ''}</Button><Button variant="outline" onClick={() => state.mode === 'patrol' ? cancel() : setState((old) => ({ ...old, mode: 'admin' }))}>{state.mode === 'patrol' ? '取消现场配置' : '退出测试'}</Button></div>}
    {warning && <p className="perm-warning" role="alert">{warning}</p>}
    {children}
    {open && <Dialog open onOpenChange={() => setOpen(false)} labelledBy="perm-title" className="perm-dialog">
      <header className="perm-heading"><div><span className="perm-eyebrow">UIModel · 本系统独立权限 · 本地演示</span><h2 id="perm-title">页面与按钮权限</h2><p>HRM 只管是否能进入系统。功能角色由本系统维护，与 KA 标签、数据范围分别配置。</p></div><Button variant="ghost" aria-label="关闭权限控制台" onClick={() => setOpen(false)}><X size={20} /></Button></header>
      <div className="perm-tabs"><Button variant={tab === 'tree' ? 'primary' : 'outline'} onClick={() => setTab('tree')}>按页面树配置</Button><Button variant={tab === 'test' ? 'primary' : 'outline'} onClick={() => setTab('test')}><Eye size={15} />角色 / 人员测试</Button></div>
      {tab === 'tree' ? <>
        <div className="perm-row"><Choice label="配置角色" value={role.id} items={state.roles} disabled={!!state.draft} onChange={(id) => { setActiveRole(id); setMessage('') }} /><span>修改影响拥有此角色的所有人；先保存或取消，再切换角色。</span></div>
        <form className="perm-row" onSubmit={(event) => { event.preventDefault(); const name = newName.trim(); if (!name || state.roles.some((r) => r.name === name)) { setMessage('请输入不重复的角色名称。'); return } const id = crypto.randomUUID(); setState((old) => ({ ...old, roles: [...old.roles, { id, name, grants: [] }] })); setActiveRole(id); setNewName(''); setMessage('已创建空角色，默认没有任何页面和按钮权限。') }}><Input aria-label="新功能角色名称" placeholder="新功能角色名称" maxLength={30} value={newName} onChange={(e) => setNewName(e.target.value)} disabled={!!state.draft} /><Button variant="outline" type="submit" disabled={!!state.draft}>新增角色</Button></form>
        <div className="perm-row"><Input aria-label="搜索页面和按钮权限" placeholder="搜索页面、按钮或权限编码…" value={query} onChange={(e) => { setQuery(e.target.value); setCollapsed([]) }} /><Button variant="outline" onClick={() => setCollapsed([])}>展开树</Button><Button variant="outline" onClick={() => setCollapsed(permissionPages.map((p) => p.code))}>折叠树</Button></div>
        <p className="perm-note">勾选页面只控制页面访问；关闭页面会使下方按钮授权暂不生效，但保留配置。“允许整页”包含该页所有已登记按钮。按钮支持隐藏、可见不可用、可见可用。已接入 A 拓扑及门户系统入口；其余内部按钮尚未登记。</p>
        <div className="perm-tree">{permissionPages.map((page) => {
          const actions = permissionActions.filter((a) => a.page === page.code)
          const q = query.trim().toLowerCase()
          const match = `${page.title} ${page.code}`.toLowerCase().includes(q)
          const visible = actions.filter((a) => match || `${a.title} ${a.code}`.toLowerCase().includes(q))
          if (!match && !visible.length) return null
          return <section key={page.code} className="perm-page-node"><div className="perm-tree-row"><Button variant="ghost" disabled={!actions.length} aria-label={actions.length ? `展开或折叠${page.title}权限` : `${page.title}暂无已登记按钮`} aria-expanded={!collapsed.includes(page.code)} onClick={() => setCollapsed((old) => toggleCollapsed(old, page.code))}>{collapsed.includes(page.code) ? <ChevronRight size={15} /> : <ChevronDown size={15} />}</Button><Button variant="outline" role="checkbox" aria-checked={grants.includes(page.code)} aria-label={`允许页面${page.title}`} onClick={() => toggle(page.code, !grants.includes(page.code))}>{grants.includes(page.code) ? '✓' : '—'}</Button><div className="perm-resource-name"><strong>{page.title}</strong><code>{page.code}</code></div><Button variant="ghost" onClick={() => setState((old) => ({ ...old, draft: { roleId: role.id, grants: [...new Set([...(old.draft?.grants ?? role.grants), page.code, ...actions.flatMap((a) => [a.code, visibilityCode(a.code)])])] } }))}>允许整页</Button><Button variant="ghost" href={page.href}>打开页面</Button></div>
            {(!collapsed.includes(page.code)) && visible.map((action) => <div key={action.code} className="perm-tree-row perm-action-node"><div className="perm-resource-name"><span>{action.title}</span><code>{action.code}</code></div><ButtonAccess code={action.code} grants={grants} onChange={(value) => changeButton(action.code, value)} />{!grants.includes(page.code) && <small>页面关闭，按钮授权不生效</small>}</div>)}
          </section>
        })}</div>
        <footer className="perm-footer"><span>待保存 {dirtyCount} 项</span><Button variant="outline" onClick={() => { setState((old) => ({ ...old, mode: 'patrol', draft: old.draft ?? { roleId: role.id, grants: [...role.grants] } })); setOpen(false) }}><MousePointer2 size={15} />进入现场配置</Button><Button variant="outline" disabled={!state.draft} onClick={cancel}>取消草稿</Button><Button disabled={!state.draft} onClick={save}>保存角色权限</Button></footer>
      </> : <>
        <Card className="perm-test-card"><h3>选择测试身份</h3><div className="perm-row"><Button variant={state.subject.type === 'role' ? 'primary' : 'outline'} onClick={() => setState((old) => ({ ...old, subject: { type: 'role', id: old.roles[0].id } }))}>单个角色</Button><Button variant={state.subject.type === 'person' ? 'primary' : 'outline'} onClick={() => setState((old) => ({ ...old, subject: { type: 'person', id: people[0].id } }))}>具体人员（角色并集）</Button><Choice label="测试身份" value={state.subject.id} items={state.subject.type === 'role' ? state.roles : people} onChange={(id) => setState((old) => ({ ...old, subject: { ...old.subject, id } }))} /></div>
          {state.subject.type === 'person' && <><p>功能角色：{(state.bindings[state.subject.id] ?? []).map((id) => state.roles.find((r) => r.id === id)?.name).join('、') || '未分配角色'}</p><div className="perm-row"><Button variant="outline" onClick={() => { const person = people.find((p) => p.id === state.subject.id)!; setAssignment(person); setAssignmentRoles(state.bindings[person.id] ?? []); setOpen(false) }}>配置此人角色</Button><Button variant="outline" role="switch" aria-checked={state.entry[state.subject.id] !== false} onClick={() => setState((old) => ({ ...old, entry: { ...old.entry, [old.subject.id]: old.entry[old.subject.id] === false } }))}>模拟 HRM 准入：{state.entry[state.subject.id] === false ? '禁止进入本系统' : '允许进入本系统'}</Button></div></>}
          <p>角色测试假设已获得 HRM 系统准入；人员测试同时检查准入。准入被关时，任何本系统角色都不能放行。</p>
          <p>按钮的可见和可用状态来自角色配置；多角色取并集：可用优先于仅可见，仅可见优先于隐藏。</p>
          <Button disabled={!!state.draft} onClick={() => { setState((old) => ({ ...old, mode: 'test' })); setOpen(false) }}>应用到真实页面进行测试</Button>{state.draft && <p>请先保存或取消草稿。测试只读取已保存配置。</p>}
        </Card>
        <h3>当前身份的有效权限与来源</h3><div className="perm-decisions">{resources.map((resource) => { const decision = evaluatePermission(state, resource.code); return <div key={resource.code}><strong>{resource.title}</strong><span data-allowed={decision.allowed}>{decision.allowed ? '可用' : permissionActions.some((a) => a.code === resource.code) && evaluatePermission(state, visibilityCode(resource.code)).allowed ? '仅可见' : '无权'}</span><small>{decision.reason}</small></div> })}</div>
      </>}
      {message && <p className="perm-message" role="status">{message}</p>}
      <div className="perm-bottom"><span>配置保存在本标签页 sessionStorage；不是真实登录或服务端安全控制。</span><Button variant="ghost" onClick={() => { setState(initialPermissions()); setActiveRole('manager'); setMessage('已恢复本系统权限示例；组织业务数据未更改。') }}>恢复权限示例</Button></div>
    </Dialog>}
    {target && <Dialog open onOpenChange={() => setTarget(null)} labelledBy="perm-target-title" className="perm-inspector"><h2 id="perm-target-title">配置：{resources.find((r) => r.code === target)?.title}</h2><p>角色：{role.name} · 当前按钮不会执行业务操作</p><code>{target}</code><p>修改进入共用草稿，也会显示在页面权限树中。</p>{permissionActions.some((a) => a.code === target) ? <ButtonAccess code={target} grants={grants} onChange={(value) => changeButton(target, value)} /> : <Button variant="outline" role="switch" aria-checked={grants.includes(target)} onClick={() => toggle(target, !grants.includes(target))}>{grants.includes(target) ? '允许访问页面 · 点击关闭' : '禁止访问页面 · 点击开启'}</Button>}<div className="perm-row"><Button onClick={() => setTarget(null)}>继续现场配置</Button><Button variant="outline" onClick={() => { setTarget(null); setOpen(true); setTab('tree') }}>查看权限树 / 保存</Button></div></Dialog>}
    {assignment && <Dialog open onOpenChange={() => setAssignment(null)} labelledBy="perm-assignment-title" className="perm-inspector"><h2 id="perm-assignment-title">{assignment.name} · 本系统功能角色</h2><p>按人员 ID 保存，跨层任职共享；多个角色取允许权限并集，不改变 KA 标签或数据范围。</p><div className="perm-role-options">{state.roles.map((r) => <Button key={r.id} variant="outline" aria-pressed={assignmentRoles.includes(r.id)} onClick={() => setAssignmentRoles((old) => old.includes(r.id) ? old.filter((id) => id !== r.id) : [...old, r.id])}>{r.name}{assignmentRoles.includes(r.id) && ' ✓'}</Button>)}</div><div className="perm-row"><Button variant="outline" onClick={() => setAssignment(null)}>取消</Button><Button onClick={() => { setState((old) => ({ ...old, bindings: { ...old.bindings, [assignment.id]: assignmentRoles } })); setAssignment(null) }}>保存人员角色</Button></div></Dialog>}
  </PermissionContext.Provider>
}

export function PermissionLauncher() {
  const permissions = usePermissions()
  if (window.location.pathname.replace(/\/+$/, '') === '/organization/figma') return <Button variant="outline" className="perm-launcher" onClick={() => window.dispatchEvent(new Event('topology-roles'))}><ShieldCheck size={14}/>角色与授权</Button>
  return <Button variant="outline" className="perm-launcher" onClick={permissions?.launch}><ShieldCheck size={14} />功能权限</Button>
}

export function FunctionRoleButton({ person }: { person: { id: string; name: string } }) {
  const permissions = usePermissions()
  const labels = permissions?.state.roles.filter((r) => permissions.state.bindings[person.id]?.includes(r.id)).map((r) => r.name)
  return <Button variant="outline" permission="roles.assign" aria-label={`功能角色 ${person.name}`} onClick={() => permissions?.assign(person)}>功能角色{labels?.length ? ` · ${labels.join('、')}` : ''}</Button>
}

export function PermissionPage({ pageId, children }: { pageId: string; children: ReactNode }) {
  const permissions = usePermissions()
  if (!permissions) return children
  const code = `page:${pageId}`
  if (!permissions.can(code)) return <Card className="perm-denied"><ShieldCheck size={32} /><h1>当前测试身份无法访问此页面</h1><p>{permissions.reason(code)}</p><p>直接访问地址也会拦截。此处是本地演示，管理员控制台始终保留以便恢复测试。</p><PermissionLauncher /></Card>
  return <>{permissions.state.mode === 'patrol' && <div className="perm-page-marker"><Button variant="outline" onClick={() => permissions.inspect(code)}>配置当前页面：{permissionPages.find((p) => p.code === code)?.title}</Button><span>虚线标记仅覆盖已登记权限的业务按钮；页面跳转、缩放等导航工具不执行业务修改。</span></div>}{children}</>
}
