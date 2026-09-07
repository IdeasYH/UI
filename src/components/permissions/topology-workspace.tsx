import { readOnsiteDraft, writeOnsiteDraft } from './topology-onsite'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Building2, ChevronDown, ChevronRight, Plus, Search, ShieldCheck, Users, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog } from '../ui/dialog'
import { OrganizationBddGuide } from '../figma-organization/organization-bdd-guide'
import { KEY, nodeIncludesChildren, toggleNode, actionState, admitted, allowedFact, catalog, depth, descendants, effectiveButton, emptyPage, emptyRole, grantErrors, initialTopology, moveOrg, pageAllowed, parseTopology, recipients, scope, scopeNodes, sources, validRanges, type Appointment, type Assignment, type ButtonState, type Org, type Role, type Scope, type TopologyState } from './topology-model'
import { demoDepartmentData } from '../../data/figma-organization'
import '../../figma-organization.css'
import '../../topology-authorization.css'

const scopeNames = { none: '无', self: '本人业务数据', org: '任职组织', tree: '任职组织及下级', all: '本系统全部', custom: '指定组织' }
const stateNames = { hidden: '隐藏', disabled: '可见不可用', enabled: '可见可用' }
const flip = (items: string[], id: string) => items.includes(id) ? items.filter(i => i !== id) : [...items, id]
const uid = () => crypto.randomUUID()
const orgName = (state: TopologyState, id: string) => state.orgs.find(o => o.id === id)?.name ?? id
function load() {
  try { const raw = sessionStorage.getItem(KEY); const parsed = raw ? parseTopology(raw) : null; return { state: parsed ?? initialTopology(), warning: raw && !parsed ? '旧的授权演示缓存无法读取，已重新载入示例。' : '' } }
  catch { return { state: initialTopology(), warning: '浏览器存储不可用，本次配置只能保留在当前页面。' } }
}
function ScopeEditor({ label, value, state, onChange }: { label: string; value: Scope; state: TopologyState; onChange: (s: Scope) => void }) {
  return <fieldset className="ta-scope"><legend>{label}</legend><select aria-label={label} value={value.mode} onChange={e => onChange({ ...value, mode: e.target.value as Scope['mode'] })}>{Object.entries(scopeNames).map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select>{value.mode === 'custom' && <><label><input type="checkbox" checked={value.descendants} onChange={e => onChange({ ...value, descendants: e.target.checked, subtreeNodes: undefined })} />统一设为包含全部下级（覆盖各节点选择）</label><div className="ta-scope-nodes">{state.orgs.map(o => <label key={o.id}><input type="checkbox" checked={value.nodes.includes(o.id)} onChange={() => onChange({ ...value, nodes: flip(value.nodes, o.id), subtreeNodes: value.subtreeNodes?.filter(id => id !== o.id) })} />L{depth(state.orgs, o.id)} · {o.name}</label>)}</div></>}</fieldset>
}
function RangeSummary({ value, state }: { value: Scope; state: TopologyState }) { return <>{scopeNames[value.mode]}{value.mode === 'custom' && `：${value.nodes.map(id => `${orgName(state,id)}${nodeIncludesChildren(value,id) ? '（含下级）' : ''}`).join('、') || '尚未选择'}`}</> }

export function TopologyWorkspace() {
  const [initial] = useState(load)
  const [state, setState] = useState(initial.state)
  const [message, setMessage] = useState(initial.warning)
  const [panel, setPanelValue] = useState<'overview' | 'roles' | 'assign' | 'person' | 'test'>('overview')
  const [panelOpen, setPanelOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const setPanel = (value: typeof panel) => { setPanelValue(value); setPanelOpen(true) }
  const [draft, setDraft] = useState<Assignment | null>(null)
  const [roleDraft, setRoleDraft] = useState<Role | null>(readOnsiteDraft)
  const [onsite, setOnsite] = useState(() => !!readOnsiteDraft())
  const [onsitePage, setOnsitePage] = useState('organization')
  const [onsiteAction, setOnsiteAction] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [treeQuery,setTreeQuery] = useState('')
  const [openPages,setOpenPages] = useState<string[]>([])
  const [hand,setHand] = useState(true)
  const suppressClick = useRef(false)
  const [quickActive, setQuickActive] = useState(false)
  const [personCard, setPersonCard] = useState<string>('')
  const [combined, setCombined] = useState(false)
  const [preview, setPreview] = useState<'recipients' | 'effective' | 'read' | 'write'>('recipients')
  const [collapsed, setCollapsed] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [zoom, setZoom] = useState(100)
  const [fullscreen, setFullscreen] = useState(false)
  const pan = useRef<{x:number;y:number;left:number;top:number} | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => { const el = canvasRef.current; if (el) el.scrollLeft = Math.max(0,(el.scrollWidth - el.clientWidth) / 2) }, [zoom,panelOpen,fullscreen])
  useLayoutEffect(() => { const el = canvasRef.current; if (el && el.clientWidth < 540) setZoom(Math.max(40,Math.floor((el.clientWidth - 24) / 480 * 100))) }, [])
  useEffect(() => { const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !document.querySelector('[role=dialog]')) setFullscreen(false) }; window.addEventListener('keydown',escape); return () => window.removeEventListener('keydown',escape) }, [])
  const [levelRoot, setLevelRoot] = useState(state.orgs[0].id)
  const [level, setLevel] = useState(2)
  const [testPerson, setTestPerson] = useState('admin')
  const [testPage, setTestPage] = useState('leads')
  const [future, setFuture] = useState(false)
  const [orgEditor, setOrgEditor] = useState<{ id: string; name: string; parent: string } | null>(null)
  const [memberEditor, setMemberEditor] = useState<string | null>(null)
  const [candidateRole, setCandidateRole] = useState('全部')
  const [candidatePerson, setCandidatePerson] = useState('')
  const [appointmentTitle, setAppointmentTitle] = useState('成员')
  const [appointmentKind, setAppointmentKind] = useState<'responsible' | 'member'>('member')
  const [transfer, setTransfer] = useState<{ appointment: string; target: string } | null>(null)
  const [confirm, setConfirm] = useState<{ title: string; text: string; run: () => void } | null>(null)
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(state)) } catch { setMessage('浏览器存储不可用，刷新会丢失本次配置。') } }, [state])
  useEffect(() => { const launch = () => { if (!draft) setPanel('roles') }; window.addEventListener('topology-roles', launch); return () => window.removeEventListener('topology-roles', launch) }, [draft])
  useEffect(() => {
    if (!roleDraft || !onsite) return
    try { writeOnsiteDraft(roleDraft) } catch { setMessage('跨页面草稿存储失败，请先保存角色再跳转。') }
  },[roleDraft,onsite])
  useEffect(() => { if (readOnsiteDraft()) { setPanel('roles'); setOpenPages(['organization']) } },[])
  const openOnsite = (page: typeof catalog[number]) => {
    if (!roleDraft) return
    try { writeOnsiteDraft(roleDraft) } catch { setMessage('跨页面草稿存储失败，暂不能跳转。'); return }
    if (page.href && page.id !== 'organization') { window.location.href = page.href; return }
    setOnsite(true); setOnsitePage(page.id); setOnsiteAction(null); setOpenPages([page.id])
  }
  const activeAppointments = state.appointments.filter(a => a.active)
  const peopleCount = new Set(activeAppointments.map(a => a.person)).size
  const newGrant = (appointment?: string) => {
    if (roleDraft) { setMessage('请先保存或取消角色草稿。'); return }
    setQuickActive(false); setOffset({x:0,y:0}); setDraft({ id: uid(), role: state.roles[0]?.id ?? '', nodes: [], descendants: false, appointments: appointment ? [appointment] : [], read: null, write: null }); setPanel('assign'); setPreview('recipients'); setQuery(''); setCollapsed([]); setMessage('')
  }
  const merged = draft ? { ...state, assignments: [...state.assignments.filter(g => g.id !== draft.id), draft] } : state
  const targets = draft ? recipients(state, draft) : []
  const effective = draft ? activeAppointments.filter(a => sources(merged, a.person, a.id).some(s => s.role.id === draft.role)) : []
  const highlighted = new Set((preview === 'effective' ? effective : targets).map(a => a.id))
  const rangeRole = state.roles.find(r => r.id === draft?.role)
  const rangeNodes = new Set(draft && rangeRole && ['read','write'].includes(preview) ? (() => { const value = preview === 'read' ? draft.read ?? rangeRole.read : draft.write ?? rangeRole.write; return value.mode === 'custom' ? value.nodes.flatMap(id => nodeIncludesChildren(value,id) ? descendants(state.orgs,id) : [id]) : targets.flatMap(a => scopeNodes(state,value,a)) })() : [])
  const selectedNodes = new Set(draft ? draft.nodes.flatMap(id => nodeIncludesChildren(draft,id) ? descendants(state.orgs, id) : [id]) : [])
  const roleSources = (a: Appointment) => [...new Set(sources(state, a.person, a.id).map(s => s.role.name))]
  const cancelGrant = () => { setDraft(null); setPanel('overview'); setPanelOpen(false); setMessage('已取消授权草稿，现有授权未改变。') }
  const saveGrant = () => {
    if (!draft) return
    const errors = grantErrors(state, draft)
    if (errors.length) { setMessage(errors[0]); return }
    setState(merged); setDraft(null); setPanel('overview'); setPanelOpen(false); setMessage('授权已保存；荧光预览已关闭，权限测试立即使用新规则。')
  }
  const assignmentLabel = (g: Assignment) => `${g.nodes.map(id => `${orgName(state,id)}${nodeIncludesChildren(g,id) ? '及全部下级' : '（仅当前节点）'}`).join('、')}${g.appointments.length ? `${g.nodes.length ? '；' : ''}${g.appointments.length} 条指定任职` : ''}`
  const saveRole = () => {
    if (!roleDraft) return
    if (!roleDraft.name.trim() || state.roles.some(r => r.id !== roleDraft.id && r.name === roleDraft.name.trim())) { setMessage('请输入不重复的角色名称。'); return }
    if (state.orgs.some(o => !validRanges(state, roleDraft.read, roleDraft.write, { id: '', person: '__person__', org: o.id, title: '', active: true }))) { setMessage('角色操作范围不能超过查看范围。'); return }
    const next = { ...state, roles: [...state.roles.filter(r => r.id !== roleDraft.id), { ...roleDraft, name: roleDraft.name.trim() }] }
    if (next.assignments.some(g => grantErrors(next, g).length)) { setMessage('此修改会使已有授权的操作范围超过查看范围，请先调整相关授权。'); return }
    writeOnsiteDraft(null); setState(next); setRoleDraft(null); setOnsite(false); setMessage('角色已保存，所有引用它的组织和任职同步生效。')
  }
  const button = (r: Role, page: string, action: string, value: ButtonState) => ({ ...r, pages: { ...r.pages, [page]: { ...(r.pages[page] ?? emptyPage()), buttons: { ...(r.pages[page]?.buttons ?? {}), [action]: value } } } })
  const setFull = (r: Role, page: string, full: boolean) => {
    const old = r.pages[page] ?? emptyPage()
    // Removing a wildcard materializes today's effective buttons, but future actions stop inheriting.
    const buttons = !full && old.full ? Object.fromEntries(catalog.find(p => p.id === page)!.actions.map(a => [a.id, actionState(r,page,a.id)])) : old.buttons
    return { ...r, pages: { ...r.pages, [page]: { ...old, access: full || old.access, full, buttons } } }
  }
  // Quick selection replaces the organization portion; explicit appointments remain independent.
  const chooseLevel = (root: string, nextLevel: number) => {
    if (!draft) return
    const nodes = descendants(state.orgs,root).filter(id => depth(state.orgs,id) === nextLevel)
    setDraft({ ...draft, nodes, descendants:false, subtreeNodes:[] })
    setPreview('recipients'); setQuickActive(true)
    setMessage(`已替换为 ${nodes.length} 个组织；单独勾选的人员保留。未来新增同级不自动获权。`)
  }
  const affectedMove = (next: TopologyState) => {
    const signature = (s: TopologyState, a: Appointment) => JSON.stringify(sources(s,a.person,a.id).map(x => ({ id:x.grant.id, read:scopeNodes(s,x.grant.read ?? x.role.read,x.appointment).sort(), write:scopeNodes(s,x.grant.write ?? x.role.write,x.appointment).sort() })).sort((a,b) => a.id.localeCompare(b.id)))
    return activeAppointments.filter(a => signature(state,a) !== signature(next,a)).map(a => {
      const before = [...new Set(sources(state,a.person,a.id).map(s => s.role.name))].join('、') || '无'
      const after = [...new Set(sources(next,a.person,a.id).map(s => s.role.name))].join('、') || '无'
      return `${state.people.find(p => p.id === a.person)?.name} · ${orgName(state,a.org)}：${before === after ? `${after}的数据范围变化` : `${before} → ${after}`}`
    })
  }
  // The legacy design separates responsible people from the member roster.
  // Placement is explicit appointment metadata; it never grants any permission.
  function isResponsible(a: Appointment) {
    if (a.kind) return a.kind === 'responsible'
    return a.org === 'department'
      ? demoDepartmentData.managers.some(p => p.personId === a.person)
      : !!demoDepartmentData.groups.find(g => g.id === a.org)?.leaders.some(p => p.personId === a.person)
  }
  function renderPerson(a: Appointment, org: Org, responsible: boolean) {
    const person = state.people.find(p => p.id === a.person)!
    const isRange = preview === 'read' || preview === 'write'
    const selfScope = draft && rangeRole && isRange && (preview === 'read' ? draft.read ?? rangeRole.read : draft.write ?? rangeRole.write).mode === 'self'
    const glow = !!draft && ((!isRange && highlighted.has(a.id)) || (!!selfScope && targets.some(t => t.person === a.person)))
    const group = demoDepartmentData.groups.find(g => g.id === a.org)
    const original = a.org === 'department' ? demoDepartmentData.managers.find(p => p.personId === a.person) : group?.leaders.find(p => p.personId === a.person) ?? group?.members.find(p => p.id === a.person)
    const kpi = original?.kpiRate ?? null
    const tone = kpi === null ? 'unknown' : kpi >= 90 ? 'excellent' : kpi >= 75 ? 'good' : 'warning'
    return <button key={a.id} className={`${responsible ? 'fg-responsible-person' : 'fg-member-card'} ta-legacy-person${glow ? ' ta-glow' : ''}`} data-permission-page="organization" data-permission-action="read" data-appointment={a.id} data-tone={tone} aria-label={`${draft ? '选择任职' : '查看权限'} ${person.name} ${org.name}`} role={draft && !isRange ? 'checkbox' : undefined} aria-checked={draft && !isRange ? highlighted.has(a.id) : undefined} onClick={() => {
      if (draft) {
        if (isRange) { setMessage('当前正在选择数据组织；切回“勾选授权人员”后可选择任职人员。'); return }
        if (targets.some(t => t.id === a.id) && !draft.appointments.includes(a.id)) { setMessage('此人已被组织授权覆盖，不支持单独排除；可取消组织选择，改选人员卡片。'); return }
        setDraft({ ...draft, appointments: flip(draft.appointments,a.id) })
      } else { setPersonCard(a.id); setCombined(false); setPanel('person') }
    }}>
      {!responsible && kpi !== null && <span className="fg-progress-fill" style={{ width: `${kpi}%` }} aria-hidden/>}
      <span className={responsible ? 'fg-responsible-avatar' : 'fg-member-avatar'}>{person.name.slice(0,1)}</span>
      <span className="fg-responsible-identity"><span className="ta-person-name"><strong>{person.name}</strong>{original && <span>{original.level}</span>}{activeAppointments.filter(x => x.person === a.person).length > 1 && <em>跨层任职</em>}</span><small>{a.title}{original ? ` · ${original.code}` : ''}</small></span>
      <span className="fg-kpi-badge" data-tone={tone}>{kpi === null ? '待统计' : `${kpi}%`}</span>
      <span className="fg-person-access"><span className="ta-role-chip">角色权限 · {roleSources(a).join('、') || '尚未授权'}</span>{draft && !isRange && <span className="ta-person-selection">{selectedNodes.has(a.org) ? '✓ 随组织选中' : <><span aria-hidden>{draft.appointments.includes(a.id) ? '☑' : '☐'}</span> {draft.appointments.includes(a.id) ? '已单独选择此人' : '单独选择此人'}</>}</span>}</span>
    </button>
  }
  function renderNode(org: Org) {
    const children = state.orgs.filter(o => o.parent === org.id)
    const appointments = activeAppointments.filter(a => a.org === org.id)
    const leaders = appointments.filter(isResponsible)
    const members = appointments.filter(a => !isResponsible(a))
    const keyword = query.trim().toLowerCase()
    const matches = !keyword || descendants(state.orgs,org.id).some(id => orgName(state,id).toLowerCase().includes(keyword) || activeAppointments.filter(a => a.org === id).some(a => state.people.find(p => p.id === a.person)?.name.toLowerCase().includes(keyword)))
    if (!matches) return null
    const root = org.parent === null
    const isRange = preview === 'read' || preview === 'write'
    const lit = !!draft && (isRange ? rangeNodes.has(org.id) : selectedNodes.has(org.id))
    const kpi = org.id === 'department' ? demoDepartmentData.kpiRate : demoDepartmentData.groups.find(g => g.id === org.id)?.kpiRate
    const currentSelection = isRange && draft && rangeRole ? (preview === 'read' ? draft.read ?? rangeRole.read : draft.write ?? rangeRole.write) : draft
    const chosen = (tree: boolean) => !!currentSelection?.nodes.includes(org.id) && nodeIncludesChildren(currentSelection,org.id) === tree
    const selectOrg = (tree = false) => {
      if (!draft) return
      if (isRange && rangeRole) {
        const current = preview === 'read' ? draft.read ?? rangeRole.read : draft.write ?? rangeRole.write
        const next = toggleNode(current.mode === 'custom' ? current : { ...current, mode:'custom' as const,nodes:[],subtreeNodes:[] },org.id,tree)
        setDraft({ ...draft,read:preview === 'read' ? next : draft.read ?? structuredClone(rangeRole.read),write:preview === 'write' ? next : draft.write ?? structuredClone(rangeRole.write) })
      } else setDraft(toggleNode(draft,org.id,tree))
    }
    return <div className="ta-branch ta-legacy-branch" key={org.id}>
      <section className={`${root ? 'fg-manager-card' : 'fg-group-card'} ta-legacy-node${lit ? ' ta-glow' : ''}`} data-org={org.id} aria-label={`${org.name}负责人节点`}>
        {kpi != null && <div className="fg-progress-fill" style={{ width:`${kpi}%` }} aria-hidden/>}
        <div className="fg-node-foreground">
          <div className={root ? 'fg-manager-top' : 'fg-group-top'}><button className="ta-legacy-org-select" aria-label={`${draft ? '选择组织' : '组织'} ${org.name}`} aria-pressed={draft ? isRange ? rangeNodes.has(org.id) : draft.nodes.includes(org.id) : undefined} onClick={() => selectOrg()}><span className="fg-role-badge">L{depth(state.orgs,org.id)} · {root ? '部门节点' : '组织节点'}</span><strong className={root ? 'ta-department-title' : 'fg-group-name'}>{org.name}</strong></button><div><span className="fg-kpi-badge">{kpi == null ? '待统计' : `${root ? '部门绩效' : '组KPI'}: ${kpi}%`}</span><button className="ta-legacy-collapse" aria-label={`展开或折叠${org.name}`} aria-expanded={!collapsed.includes(org.id)} onClick={() => setCollapsed(flip(collapsed,org.id))}>{collapsed.includes(org.id) ? '展开' : '折叠'}<ChevronDown size={12}/></button></div></div>
          {draft && <div className="ta-node-checks" role="group" aria-label={`${org.name}范围选择`}>{lit && !currentSelection?.nodes.includes(org.id) && <small>已被其他所选范围覆盖</small>}<label><input type="checkbox" aria-label={`仅当前节点 ${org.name}`} checked={chosen(false)} onChange={() => selectOrg(false)}/>本组织人员</label><label><input type="checkbox" aria-label={`当前节点及全部下级 ${org.name}`} checked={chosen(true)} onChange={() => selectOrg(true)}/>本组织及下级组织人员</label><small className="ta-node-hint">本组织含负责人和下方组员，共 {appointments.length} 条任职。{descendants(state.orgs,org.id).length === 1 ? '当前没有下级组织，两种选法目前人数相同；含下级会覆盖未来新增子组。' : `下级另有 ${descendants(state.orgs,org.id).length - 1} 个组织。`}</small></div>}
          <div className="fg-responsible-block" data-responsible-tone={root ? 'department' : 'group'}><div className="fg-responsible-heading"><span>{root ? '部门负责人' : '组负责人'}</span><strong>{leaders.length} 人 · 平级共同负责</strong></div><div className="fg-responsible-list">{leaders.map(a => renderPerson(a,org,true))}</div>{!leaders.length && <p className="fg-responsible-empty">待指定负责人</p>}</div>
          <div className="fg-group-scope"><span><ShieldCheck size={12}/>数据与权限范围 · {appointments.length} 条直属任职 / {children.length} 个下级节点</span></div>
          {!draft && <div className="fg-node-actions"><button data-permission-page="organization" data-permission-action="appoint" onClick={() => { setMemberEditor(org.id); setCandidatePerson('') }}>＋ 添加任职</button><button data-permission-page="organization" data-permission-action="create" onClick={() => setOrgEditor({ id:'',name:'',parent:org.id })}>＋ 下级节点</button><button data-permission-page="organization" data-permission-action="edit" aria-label={`编辑组织 ${org.name}`} onClick={() => setOrgEditor({ id:org.id,name:org.name,parent:org.parent ?? '' })}>编辑 / 移动节点</button></div>}
        </div>
      </section>
      {!collapsed.includes(org.id) && members.length > 0 && <><div className="fg-members-line" aria-hidden/><section className={`fg-member-list ta-legacy-members${lit ? ' ta-glow' : ''}`} aria-label={`${org.name}组员名录`}><div className="fg-member-list-heading"><h3><Users size={14}/>{org.name} · 组员名录</h3><span>{members.length} 人</span></div><div className="fg-member-rows">{members.map(a => renderPerson(a,org,false))}</div></section></>}
      {children.length > 0 && !collapsed.includes(org.id) && <div className="ta-children">{children.map(renderNode)}</div>}
    </div>
  }
  const selectedAppointment = state.appointments.find(a => a.id === personCard)
  const selectedPerson = state.people.find(p => p.id === selectedAppointment?.person)
  const selectedSources = selectedPerson ? sources(state,selectedPerson.id,combined ? undefined : personCard) : []
  return <div className={`ta-workspace ta-legacy-workspace${panelOpen ? ' has-panel' : ''}${fullscreen ? ' ta-fullscreen' : ''}${onsite ? ' ta-onsite' : ''}`} onClickCapture={e => {
    if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); suppressClick.current=false; return }
    if (!onsite || !roleDraft) return
    const target = (e.target as Element).closest<HTMLElement>('[data-permission-action],[data-permission-page]')
    if (!target) return
    e.preventDefault(); e.stopPropagation(); setOnsitePage(target.dataset.permissionPage ?? onsitePage); setOnsiteAction(target.dataset.permissionAction ?? null)
  }}>
    <header className="ta-legacy-header"><div><span className="ta-brand-mark"><Building2 size={18}/></span><strong>尚毅</strong><span>人员与组织中台</span><small>组织架构 · 鲜花事业部</small></div><span className="ta-admin">admin · 系统管理员</span></header>
    <div className="ta-legacy-context"><Building2 size={16}/><button className="ta-page-target" data-permission-page="organization">拓扑结构 · 组织与人员{onsite && ' · 点击配置页面权限'}</button><span>部门 / 业务组 / 成员</span><small>组织 · 人员 · 绩效</small></div>
    <div className="ta-toolbar" id="figma-controls"><div className="ta-search"><Search size={16}/><Input aria-label="搜索组织或人员" placeholder="搜索组织或人员…" value={query} onChange={e => setQuery(e.target.value)}/></div><span>{state.orgs.length} 个组织 · {peopleCount} 名示例人员</span><div className="ta-toolbar-actions"><Button variant="outline" aria-haspopup="dialog" onClick={() => setGuideOpen(true)}>A 拓扑说明书</Button><Button variant="outline" data-permission-page="organization" data-permission-action="authorize" disabled={!!draft || (!!roleDraft && !onsite)} onClick={() => setPanel('overview')}>授权记录</Button><Button variant="outline" data-permission-page="organization" data-permission-action="authorize" disabled={!!draft} onClick={() => { setPanel('roles'); setMessage('') }}>角色库</Button><Button variant="outline" disabled={!!draft || !!roleDraft} onClick={() => setPanel('test')}>权限试用</Button><Button data-permission-page="organization" data-permission-action="authorize" disabled={!!draft || (!!roleDraft && !onsite) || !state.roles.length} onClick={() => newGrant()}><Plus size={15}/>分配角色</Button></div></div>
    <Dialog open={guideOpen} onOpenChange={setGuideOpen} labelledBy="topology-guide-title" className="ta-guide-dialog"><header className="ta-guide-heading"><div><h2 id="topology-guide-title">A 拓扑结构说明书</h2><p>当前 v2 · 使用流程、权限与汇总案例、实现方式及接入边界</p></div><Button variant="outline" aria-label="关闭 A 拓扑说明书" onClick={() => setGuideOpen(false)}><X size={16}/>关闭说明书</Button></header><OrganizationBddGuide /></Dialog>
    {message && <div className="ta-message" role="status">{message}<button aria-label="关闭提示" onClick={() => setMessage('')}><X size={14}/></button></div>}
    <div className="ta-layout"><main className="ta-canvas-wrap" id="figma-canvas"><div className="ta-canvas-bar"><span>{draft ? ['read','write'].includes(preview) ? '数据范围 · 边勾选边实时高亮' : '实时荧光预览 · 无需保存' : '组织拓扑 · 按住卡片或空白处拖动画布'}</span><div><button aria-pressed={hand} onClick={() => setHand(!hand)}>{hand ? '拖动画布：开启' : '拖动画布：关闭'}</button><button onClick={() => setFullscreen(!fullscreen)}>{fullscreen ? '退出网页全屏' : '网页全屏'}</button><button onClick={() => { setZoom(100); setOffset({x:0,y:0}); if (canvasRef.current) canvasRef.current.scrollTop = 0 }}>复位画布</button><button onClick={() => setCollapsed([])}>展开全部</button><button onClick={() => setCollapsed(state.orgs.map(o => o.id))}>折叠全部</button><button aria-label="缩小拓扑" disabled={zoom <= 40} onClick={() => setZoom(zoom - 10)}>−</button><output>{zoom}%</output><button aria-label="放大拓扑" disabled={zoom >= 120} onClick={() => setZoom(zoom + 10)}>＋</button></div></div>
      {draft && <div className="ta-preview-tabs">{([['recipients','勾选授权人员'],['effective','合并已有授权预览'],['read','勾选查看范围'],['write','勾选操作范围']] as const).map(([id,label]) => <button key={id} aria-pressed={preview === id} onClick={() => setPreview(id)}>{label}</button>)}</div>}
      {onsite && onsitePage !== 'organization' && <section className="ta-onsite-business"><button data-permission-page={onsitePage} className="ta-page-target">{catalog.find(p => p.id === onsitePage)?.name} · 点击配置页面权限</button><p>本地示例业务页面 · 点选按钮配置当前角色</p><div>{catalog.find(p => p.id === onsitePage)!.actions.map(a => <Button key={a.id} variant="outline" data-permission-action={a.id}>{a.name}</Button>)}</div><table><thead><tr><th>示例记录</th><th>所属组织</th><th>状态</th></tr></thead><tbody>{state.facts.slice(0,6).map(f => <tr key={f.id}><td>{f.name}</td><td>{orgName(state,f.org)}</td><td>{f.closed ? '已结案' : '处理中'}</td></tr>)}</tbody></table></section>}
      <div hidden={onsite && onsitePage !== 'organization'} className="ta-canvas" ref={canvasRef} onPointerDownCapture={e => {
        const target=e.target as Element
        if (!hand || e.button!==0 || target.closest('input,select,textarea,a,label') || (target.closest('button') && !(hand && target.closest('[data-appointment],.ta-legacy-org-select')))) return
        suppressClick.current=false
        pan.current={x:e.clientX,y:e.clientY,left:offset.x,top:offset.y}
      }} onPointerMove={e => {
        if (!pan.current) return
        const dx=e.clientX-pan.current.x,dy=e.clientY-pan.current.y
        if (!suppressClick.current && Math.hypot(dx,dy)<5) return
        suppressClick.current=true; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId)
        setOffset({x:pan.current.left+dx,y:pan.current.top+dy})
      }} onPointerUp={e => {pan.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{pan.current=null;suppressClick.current=false}} onLostPointerCapture={()=>{pan.current=null}} onPointerLeave={()=>{if(!suppressClick.current)pan.current=null}} onDragStart={e=>e.preventDefault()}><div className="ta-tree figma-replica" style={{ zoom: zoom / 100, transform:`translate(${offset.x / (zoom / 100)}px,${offset.y / (zoom / 100)}px)` }}>{state.orgs.filter(o => o.parent === null).map(renderNode)}</div></div>
      <div className="ta-canvas-foot"><span className={draft ? 'ta-dot-active' : 'ta-dot'}/>{draft ? `${new Set(targets.map(a => a.person)).size} 人 · ${targets.length} 条任职将获得此角色${['read','write'].includes(preview) ? ' · 本人范围以人员卡表示，其余以组织框表示' : ''}` : '层级数字仅帮助选择，不持续决定权限。节点可继续向下扩展。'}</div>
    </main><aside className="ta-panel" hidden={!panelOpen}><div className="ta-panel-close"><button disabled={!!draft || !!roleDraft} aria-label="关闭授权面板" onClick={() => setPanelOpen(false)}><X size={16}/>关闭面板</button></div>
      {panel === 'overview' && <><div className="ta-panel-heading"><div><span className="ta-eyebrow">授权规则</span><h2>已分配的角色</h2></div><span className="ta-count">{state.assignments.length}</span></div><p className="ta-note">组织规则覆盖未来加入的人员；指定任职只作用于选中的人员卡片。</p>{!state.assignments.length && <div className="ta-start"><ShieldCheck size={32}/><h3>从一条授权开始</h3><p>示例人员尚未获权。先查看角色库，再点击“分配角色”，在左侧组织上选择接收人员。</p><Button onClick={() => newGrant()}>分配第一个角色</Button></div>}{state.assignments.map(g => <article className="ta-rule" key={g.id}><strong>{state.roles.find(r => r.id === g.role)?.name}</strong><p>{assignmentLabel(g)}</p><small>{new Set(recipients(state,g).map(a => a.person)).size} 人 · {recipients(state,g).length} 条任职</small><div><Button variant="ghost" onClick={() => { setDraft(structuredClone(g)); setPreview('recipients'); setPanel('assign'); setCollapsed([]) }}>调整</Button><Button variant="ghost" onClick={() => setConfirm({ title: '撤销这条授权', text: '只撤销此授权来源；其他角色或上级组织提供的权限仍会保留。', run: () => { setState({ ...state, assignments: state.assignments.filter(x => x.id !== g.id) }); setMessage('已撤销此授权，其他来源保持有效。') } })}>撤销</Button></div></article>)}<details className="ta-guide"><summary>设计规则与演示边界</summary><p>HRM 仅提供账号与准入；候选角色变化不会撤销已建立任职。组织与任职由本系统独立维护。</p><p>角色统一配置功能及数据范围，多来源取允许并集；动作不能与另一角色的范围拼接扩权。全页覆盖未来按钮，例外仅限制当前角色。</p><p>只有分配期间荧光高亮。节点移动保留直接授权，按新上级重新继承。调组结束旧任职并创建新任职；业务事实不自动转移。</p><p>当前是浏览器内规则验证，刷新保留本标签页配置；服务端鉴权、真实 HRM、真实业务交接和历史业绩结算未接入。</p></details><Button variant="ghost" onClick={() => setConfirm({ title: '恢复演示数据', text: '将清除本标签页的角色、授权和组织调整，恢复虚构示例；不影响任何业务系统。', run: () => { setState(initialTopology()); setRoleDraft(null); setDraft(null); setPanel('overview') } })}>恢复默认演示</Button></>}
      {panel === 'assign' && draft && <><div className="ta-panel-heading"><div><span className="ta-eyebrow">角色 → 接收人员 → 数据范围</span><h2>分配角色</h2></div></div><label className="ta-field">要分配的角色<select aria-label="要分配的角色" value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value })}>{state.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label><h3>授给哪些人</h3><p className="ta-note">直接勾选左侧组织框上的“本组织人员”或“本组织及下级组织人员”；每个节点独立选择。勾选后立即荧光预览，无需保存。</p><div className="ta-level-picker"><label>快捷选择范围<select aria-label="同级选择范围" value={levelRoot} onChange={e => { setLevelRoot(e.target.value); if (quickActive) chooseLevel(e.target.value,level) }}>{state.orgs.map(o => <option value={o.id} key={o.id}>{o.name}</option>)}</select></label><label>层级<select aria-label="选择层级" value={level} onChange={e => { setLevel(Number(e.target.value)); if (quickActive) chooseLevel(levelRoot,Number(e.target.value)) }}>{Array.from({ length: Math.max(...state.orgs.map(o => depth(state.orgs,o.id))) },(_,i) => i+1).map(n => <option key={n} value={n}>L{n}</option>)}</select></label><Button variant="outline" onClick={() => chooseLevel(levelRoot,level)}>勾选同级</Button><small className="ta-quick-hint">{quickActive ? '切换范围或层级即替换组织勾选；单独选人保留。' : '点击后替换组织勾选，随后切换选项会实时更新。'}</small></div><div className="ta-selection"><strong>{new Set(targets.map(a => a.person)).size} 人 / {targets.length} 条任职</strong><button onClick={() => { setQuickActive(false); setDraft({ ...draft, nodes: [], subtreeNodes: [], appointments: [] }) }}>清空选择</button><p>{assignmentLabel(draft) || '尚未选择接收人员'}</p>{targets.length > 0 && <details><summary>查看人员与选择来源</summary>{targets.map(a => <p key={a.id}>{state.people.find(p => p.id === a.person)?.name} · {orgName(state,a.org)}<small>{draft.appointments.includes(a.id) ? '指定任职；' : ''}{draft.nodes.filter(id => (nodeIncludesChildren(draft,id) ? descendants(state.orgs,id) : [id]).includes(a.org)).map(id => `来自 ${orgName(state,id)}${nodeIncludesChildren(draft,id) ? '及下级' : ''}`).join('；')}</small></p>)}</details>}</div><h3>数据范围</h3>{rangeRole && <><label className="ta-checkline"><input type="checkbox" checked={draft.read !== null || draft.write !== null} onChange={e => setDraft({ ...draft, read: e.target.checked ? structuredClone(rangeRole.read) : null, write: e.target.checked ? structuredClone(rangeRole.write) : null })}/>为本次授权指定范围</label>{draft.read && draft.write ? <><ScopeEditor label="本次查看范围" state={state} value={draft.read} onChange={read => { setDraft({ ...draft, read }); setPreview('read') }}/><ScopeEditor label="本次操作范围" state={state} value={draft.write} onChange={write => { setDraft({ ...draft, write }); setPreview('write') }}/></> : <div className="ta-range-summary"><p>查看：<RangeSummary state={state} value={rangeRole.read}/></p><p>操作：<RangeSummary state={state} value={rangeRole.write}/></p><small>跟随角色模板；“任职组织”按每名接收人的对应任职计算。</small></div>}</>}<p className="ta-note">仅增加访问授权，不改变人员和业绩归属。保存前可切换左侧预览检查范围。</p><footer className="ta-sticky"><Button variant="outline" onClick={cancelGrant}>取消</Button><Button onClick={saveGrant}>保存授权</Button></footer></>}
      {panel === 'roles' && <><div className="ta-panel-heading"><h2>{roleDraft ? '编辑角色' : '角色库'}</h2><Button variant="ghost" disabled={!!roleDraft} onClick={() => setPanel('overview')}>返回</Button></div>{!roleDraft ? <><p className="ta-note">功能和数据范围放在同一个角色里，按组织或任职复用。</p><article className="ta-rule"><strong>admin · 内置超级管理员</strong><p>所有当前及未来功能和数据，不受普通角色限制；业务流程规则仍生效。</p></article>{state.roles.map(r => <article className="ta-rule" key={r.id}><strong>{r.name}</strong><p>查看：<RangeSummary state={state} value={r.read}/></p><p>操作：<RangeSummary state={state} value={r.write}/></p><small>{state.assignments.filter(g => g.role === r.id).length} 条授权引用</small><Button variant="ghost" onClick={() => setRoleDraft(structuredClone(r))}>编辑角色</Button></article>)}<Button onClick={() => setRoleDraft(emptyRole(uid(),''))}>＋ 新建角色</Button></> : <><label className="ta-field">角色名称<Input aria-label="角色名称" maxLength={30} value={roleDraft.name} onChange={e => setRoleDraft({ ...roleDraft, name: e.target.value })}/></label><ScopeEditor label="默认查看范围" state={state} value={roleDraft.read} onChange={read => setRoleDraft({ ...roleDraft, read })}/><ScopeEditor label="默认操作范围" state={state} value={roleDraft.write} onChange={write => setRoleDraft({ ...roleDraft, write })}/><h3>页面和按钮</h3><Button variant="outline" onClick={() => { if (onsite) { writeOnsiteDraft(null); setOnsite(false) } else openOnsite(catalog.find(p=>p.id==='organization')!) }}>{onsite ? '退出页面点选' : '在页面中点选授权'}</Button>{onsite && <div className="ta-onsite-inspector"><p>点击左侧页面标题配置页面访问；点击实际按钮配置动作。此时点击只配置权限，不执行业务操作。</p><label className="ta-field">配置页面<select aria-label="现场配置页面" value={onsitePage} onChange={e => openOnsite(catalog.find(p=>p.id===e.target.value)!)}>{catalog.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><strong>{catalog.find(p => p.id === onsitePage)?.name} · {onsiteAction ? catalog.find(p => p.id === onsitePage)?.actions.find(a => a.id === onsiteAction)?.name : '页面权限'}</strong>{onsiteAction ? <select aria-label="点选按钮权限" value={actionState(roleDraft,onsitePage,onsiteAction)} onChange={e => setRoleDraft(button(roleDraft,onsitePage,onsiteAction,e.target.value as ButtonState))}>{Object.entries(stateNames).map(([id,name]) => <option key={id} value={id}>{name}</option>)}</select> : <><label><input type="checkbox" checked={roleDraft.pages[onsitePage]?.access ?? false} onChange={e => setRoleDraft({ ...roleDraft,pages:{...roleDraft.pages,[onsitePage]:{...(roleDraft.pages[onsitePage] ?? emptyPage()),access:e.target.checked}} })}/>允许进入当前页面</label><label><input type="checkbox" checked={roleDraft.pages[onsitePage]?.full ?? false} onChange={e => setRoleDraft(setFull(roleDraft,onsitePage,e.target.checked))}/>当前页面全页授权（含未来按钮）</label></>}</div>}<p className="ta-note">全页包含未来新增按钮。设置例外仅限制此角色，其他角色仍可允许。</p><div className="ta-permission-tree"><Input aria-label="搜索权限树" placeholder="搜索页面或按钮…" value={treeQuery} onChange={e=>setTreeQuery(e.target.value)}/><div className="ta-tree-tools"><button onClick={()=>setOpenPages(catalog.map(p=>p.id))}>展开全部页面</button><button onClick={()=>{setOpenPages([]);setTreeQuery('')}}>折叠全部页面</button></div>{catalog.filter(page=>!treeQuery || [page.name,...page.actions.map(a=>a.name)].some(name=>name.includes(treeQuery))).map(page => { const pg = roleDraft.pages[page.id] ?? emptyPage(); return <section className="ta-permission-branch" key={page.id}><div className="ta-permission-page-row"><button aria-label={`展开或折叠${page.name}权限`} aria-expanded={!!treeQuery || openPages.includes(page.id)} onClick={()=>setOpenPages(flip(openPages,page.id))}>{openPages.includes(page.id) || treeQuery ? '▾' : '▸'} {page.name}</button><small>{page.actions.length} 个按钮</small><button onClick={()=>openOnsite(page)}>{page.href ? '打开并点选' : '打开示例并点选'}</button></div>{(!!treeQuery || openPages.includes(page.id)) && <div className="ta-permission-children"><label><input type="checkbox" checked={pg.access} onChange={e => setRoleDraft({ ...roleDraft, pages: { ...roleDraft.pages, [page.id]: { ...pg, access: e.target.checked } } })}/>允许进入页面</label><label><input type="checkbox" checked={pg.full} onChange={e => setRoleDraft(setFull(roleDraft,page.id,e.target.checked))}/>全页授权（含未来按钮）</label>{page.actions.map(a => <div className="ta-action" key={a.id}><span>{a.name}{pg.full && pg.buttons[a.id] && <small>单独配置</small>}</span><select aria-label={`${page.name} ${a.name} 状态`} value={actionState(roleDraft,page.id,a.id)} onChange={e => setRoleDraft(button(roleDraft,page.id,a.id,e.target.value as ButtonState))}>{Object.entries(stateNames).map(([id,name]) => <option value={id} key={id}>{name}</option>)}</select>{pg.buttons[a.id] && <button title="移除单独配置，跟随全页或默认隐藏" aria-label={`恢复默认 ${a.name}`} onClick={() => { const buttons = { ...pg.buttons }; delete buttons[a.id]; setRoleDraft({ ...roleDraft, pages: { ...roleDraft.pages, [page.id]: { ...pg, buttons } } }) }}>↺</button>}</div>)}{!pg.access && <small>本角色不授予页面访问；人员可由另一角色获得页面访问。</small>}{!page.actions.length && <small>内部按钮尚未登记；当前仅配置页面访问。</small>}</div>}</section> })}</div><p className="ta-note">保存影响 {state.assignments.filter(g => g.role === roleDraft.id).length} 条已有授权；显式指定的数据范围保持原配置。</p><footer className="ta-sticky"><Button variant="outline" onClick={() => { writeOnsiteDraft(null); setRoleDraft(null); setOnsite(false) }}>取消角色草稿</Button><Button onClick={saveRole}>保存角色</Button></footer></>}</>}
      {panel === 'person' && selectedAppointment && selectedPerson && <><div className="ta-panel-heading"><div><h2>{selectedPerson.name}</h2><p>{orgName(state,selectedAppointment.org)} · {selectedAppointment.title}</p></div><Button variant="ghost" onClick={() => setPanel('overview')}>返回</Button></div><div className="ta-segment"><button aria-pressed={!combined} onClick={() => setCombined(false)}>当前任职</button><button aria-pressed={combined} onClick={() => setCombined(true)}>全部任职合并</button></div><p className="ta-note">{admitted(state,selectedPerson.id) ? 'HRM 账号有效、允许进入（模拟）' : 'HRM 账号或准入已关闭，以下授权当前不能放行'}</p>{selectedSources.length ? selectedSources.map(s => <article className="ta-rule" key={`${s.grant.id}:${s.appointment.id}`}><strong>{s.role.name}</strong><p>任职：{orgName(state,s.appointment.org)}</p><p>来源：{assignmentLabel(s.grant)}</p><small>查看：<RangeSummary state={state} value={s.grant.read ?? s.role.read}/><br/>操作：<RangeSummary state={state} value={s.grant.write ?? s.role.write}/></small></article>) : <p className="ta-empty">没有适用授权</p>}<h3>有效页面和按钮</h3>{catalog.map(p => <div className="ta-result" key={p.id}><strong>{p.name} · {pageAllowed(state,selectedPerson.id,p.id,combined ? undefined : selectedAppointment.id) ? '允许进入' : '禁止进入'}</strong>{p.actions.map(a => <small key={a.id}>{a.name}：{stateNames[effectiveButton(state,selectedPerson.id,p.id,a.id,combined ? undefined : selectedAppointment.id)]}</small>)}</div>)}<Button onClick={() => newGrant(selectedAppointment.id)}>给这条任职分配角色</Button><div className="ta-person-admin"><Button variant="outline" onClick={() => { setTestPerson(selectedPerson.id); setPanel('test') }}>试用此人权限</Button><Button variant="outline" onClick={() => setTransfer({ appointment: selectedAppointment.id, target: state.orgs.find(o => o.id !== selectedAppointment.org)?.id ?? '' })}>调组</Button><Button variant="ghost" onClick={() => setConfirm({ title: '结束这条任职', text: '当前任职的直接和继承授权不再生效，其他有效任职保留。业务记录和历史归属不变。', run: () => { setState({ ...state, appointments: state.appointments.map(a => a.id === selectedAppointment.id ? { ...a, active: false } : a) }); setPanel('overview') } })}>结束任职</Button></div></>}
      {panel === 'test' && <><div className="ta-panel-heading"><h2>权限试用</h2><Button variant="ghost" onClick={() => setPanel('overview')}>返回</Button></div><p className="ta-note">以所选身份试用下方示例业务区；管理工作台仍由 admin 操作。每次点击按当前配置重新判断。</p><label className="ta-field">测试人员<select aria-label="测试人员" value={testPerson} onChange={e => setTestPerson(e.target.value)}><option value="admin">admin · 全部权限</option>{state.people.filter(p => p.id !== 'admin').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>{(() => { const p = state.people.find(p => p.id === testPerson)!; return <div className="ta-hrm"><label><input type="checkbox" checked={p.enabled} onChange={e => setState({ ...state, people: state.people.map(x => x.id === p.id ? { ...x, enabled: e.target.checked } : x) })}/>账号有效</label><label><input type="checkbox" checked={p.admitted} onChange={e => setState({ ...state, people: state.people.map(x => x.id === p.id ? { ...x, admitted: e.target.checked } : x) })}/>允许进入系统</label><label>HRM 候选角色<select aria-label="模拟 HRM 角色" value={p.hrmRole} onChange={e => setState({ ...state, people: state.people.map(x => x.id === p.id ? { ...x, hrmRole: e.target.value } : x) })}>{['业务人员','业务管理','其他','系统管理'].map(r => <option key={r}>{r}</option>)}</select></label><small>角色只用于选人，修改不会撤销既有任职和授权。</small></div> })()}<label className="ta-field">试用页面<select aria-label="试用页面" value={testPage} onChange={e => setTestPage(e.target.value)}>{catalog.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>{!pageAllowed(state,testPerson,testPage) ? <div className="ta-denied"><ShieldCheck size={25}/><h3>无法进入此页面</h3><p>{admitted(state,testPerson) ? '所有角色均未授予此页面访问。' : 'HRM 账号或系统准入已关闭。'}</p></div> : <div className="ta-sandbox"><h3>{catalog.find(p => p.id === testPage)?.name}</h3><p>当前身份可见 {state.facts.filter(f => allowedFact(state,testPerson,testPage,'read',f)).length} 条示例记录</p><div className="ta-sandbox-actions">{catalog.find(p => p.id === testPage)!.actions.map(a => { const bs = effectiveButton(state,testPerson,testPage,a.id); return bs === 'hidden' ? null : <Button key={a.id} variant="outline" disabled={bs === 'disabled'} onClick={() => setMessage(`${a.name}：${state.facts.filter(f => allowedFact(state,testPerson,testPage,a.id,f)).length} 条记录在该动作的授权范围内；这是模拟判权，未调用真实业务接口。`)}>{a.name}</Button> })}</div>{state.facts.filter(f => allowedFact(state,testPerson,testPage,'read',f)).map(f => <article className="ta-fact" key={f.id}><strong>{f.name}</strong><small>{orgName(state,f.org)} · {f.closed ? '已结案' : '处理中'}</small>{testPage === 'leads' && effectiveButton(state,testPerson,testPage,'edit') !== 'hidden' && <button disabled={!allowedFact(state,testPerson,testPage,'edit',f) || f.closed} onClick={() => { if (!allowedFact(state,testPerson,testPage,'edit',f) || f.closed) { setMessage('当前权限或业务状态不允许操作。'); return } setMessage(`已验证可编辑 ${f.id}；业务归属不变。`) }}>编辑{f.closed ? '（已结案）' : ''}</button>}</article>)}</div>}<label className="ta-checkline"><input type="checkbox" checked={future} onChange={e => setFuture(e.target.checked)}/>模拟该页新增一个按钮</label>{future && <div className="ta-result">新增“批量标记”：{stateNames[effectiveButton(state,testPerson,testPage,'future-action')]}<small>全页规则自动包含未来动作；逐项授权不会自动扩大。</small></div>}</>}
    </aside></div>
    {orgEditor && <Dialog open onOpenChange={() => setOrgEditor(null)} labelledBy="ta-org-title" className="ta-dialog"><h2 id="ta-org-title">{orgEditor.id ? '编辑组织 / 移动节点' : '新增下级组织'}</h2><label className="ta-field">组织名称<Input aria-label="组织名称" value={orgEditor.name} maxLength={40} onChange={e => setOrgEditor({ ...orgEditor,name:e.target.value })}/></label>{orgEditor.parent && <label className="ta-field">上级节点<select aria-label="上级节点" value={orgEditor.parent} onChange={e => setOrgEditor({ ...orgEditor,parent:e.target.value })}>{state.orgs.filter(o => !orgEditor.id || !descendants(state.orgs,orgEditor.id).includes(o.id)).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></label>}<p>层级数字自动计算。移动后直接授权保留，上级继承按新位置重算。</p><footer><Button variant="outline" onClick={() => setOrgEditor(null)}>取消</Button><Button onClick={() => { const name = orgEditor.name.trim(); if (!name || state.orgs.some(o => o.id !== orgEditor.id && o.parent === (orgEditor.parent || null) && o.name === name)) { setMessage('请填写不重复的同级组织名称。'); return } let next = { ...state, orgs: orgEditor.id ? state.orgs.map(o => o.id === orgEditor.id ? { ...o,name } : o) : [...state.orgs,{ id:uid(),name,parent:orgEditor.parent }] }; const previous = state.orgs.find(o => o.id === orgEditor.id); if (previous?.parent && previous.parent !== orgEditor.parent) { next = moveOrg(next,orgEditor.id,orgEditor.parent); const changes = affectedMove(next); const affected = descendants(state.orgs,orgEditor.id); setOrgEditor(null); setConfirm({ title:'确认移动及权限变化', text:`${name} 将移动到 ${orgName(state,orgEditor.parent)}。${changes.length} 条任职的授权来源或数据范围发生变化；${activeAppointments.filter(a => affected.includes(a.org)).length} 条子树任职的“本组织及下级”范围随新树重算。直接授权保留，原业务事实不迁移。${changes.length ? '\n\n' + changes.join('\n') : ''}`, run:() => setState(next) }); } else { setState(next); setOrgEditor(null) } }}>保存组织</Button></footer>{orgEditor.id && state.orgs.find(o => o.id === orgEditor.id)?.parent && <Button variant="ghost" disabled={activeAppointments.some(a => a.org === orgEditor.id) || state.orgs.some(o => o.parent === orgEditor.id) || state.assignments.some(g => g.nodes.includes(orgEditor.id) || g.read?.nodes.includes(orgEditor.id) || g.write?.nodes.includes(orgEditor.id)) || state.facts.some(f => f.org === orgEditor.id) || state.appointments.some(a => a.org === orgEditor.id) || state.roles.some(r => r.read.nodes.includes(orgEditor.id) || r.write.nodes.includes(orgEditor.id))} onClick={() => { setState({ ...state,orgs:state.orgs.filter(o => o.id !== orgEditor.id) }); setOrgEditor(null) }}>删除空节点（有任职、事实或授权引用时不可删除）</Button>}</Dialog>}
    {memberEditor && <Dialog open onOpenChange={() => setMemberEditor(null)} labelledBy="ta-member-title" className="ta-dialog"><h2 id="ta-member-title">从 HRM 示例名册添加任职</h2><p>加入 {orgName(state,memberEditor)}；不复制人员身份，不改变其其他任职。</p><label className="ta-field">按 HRM 角色筛选<select aria-label="按 HRM 角色筛选" value={candidateRole} onChange={e => { setCandidateRole(e.target.value); setCandidatePerson('') }}>{['全部',...new Set(state.people.map(p => p.hrmRole))].map(r => <option key={r}>{r}</option>)}</select></label><label className="ta-field">选择人员<select aria-label="选择 HRM 人员" value={candidatePerson} onChange={e => setCandidatePerson(e.target.value)}><option value="">请选择</option>{state.people.filter(p => p.id !== 'admin' && p.enabled && p.admitted && (candidateRole === '全部' || p.hrmRole === candidateRole) && !activeAppointments.some(a => a.person === p.id && a.org === memberEditor)).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="ta-field">卡片位置<select aria-label="任职卡片位置" value={appointmentKind} onChange={e => setAppointmentKind(e.target.value as typeof appointmentKind)}><option value="member">组员名录</option><option value="responsible">负责人节点框</option></select></label><label className="ta-field">任职称谓<Input aria-label="任职称谓" maxLength={30} value={appointmentTitle} onChange={e => setAppointmentTitle(e.target.value)}/></label><p>称谓不自动授予权限；新任职只继承适用的组织授权。</p><footer><Button variant="outline" onClick={() => setMemberEditor(null)}>取消</Button><Button disabled={!candidatePerson || !appointmentTitle.trim()} onClick={() => { setState({ ...state,appointments:[...state.appointments,{ id:uid(),person:candidatePerson,org:memberEditor,title:appointmentTitle.trim(),kind:appointmentKind,active:true }] }); setMemberEditor(null) }}>添加任职</Button></footer></Dialog>}
    {transfer && <Dialog open onOpenChange={() => setTransfer(null)} labelledBy="ta-transfer-title" className="ta-dialog"><h2 id="ta-transfer-title">调组</h2><p>结束旧任职并创建新任职，旧任职的指定授权不跟随；新组织授权自动适用。测试业务记录不自动交接。</p><select aria-label="调入组织" value={transfer.target} onChange={e => setTransfer({ ...transfer,target:e.target.value })}>{state.orgs.filter(o => o.id !== selectedAppointment?.org).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select><footer><Button variant="outline" onClick={() => setTransfer(null)}>取消</Button><Button onClick={() => { const old = state.appointments.find(a => a.id === transfer.appointment)!; if (!transfer.target || activeAppointments.some(a => a.person === old.person && a.org === transfer.target)) { setMessage('目标组织已有此人的有效任职，请选择其他组织。'); return } setState({ ...state,appointments:[...state.appointments.map(a => a.id === old.id ? { ...a,active:false } : a),{ ...old,id:uid(),org:transfer.target,kind:isResponsible(old) ? 'responsible' : 'member',active:true }] }); setTransfer(null); setPanel('overview') }}>确认调组</Button></footer></Dialog>}
    {confirm && <Dialog open onOpenChange={() => setConfirm(null)} labelledBy="ta-confirm-title" className="ta-dialog"><h2 id="ta-confirm-title">{confirm.title}</h2><p>{confirm.text}</p><footer><Button variant="outline" onClick={() => setConfirm(null)}>取消</Button><Button onClick={() => { confirm.run(); setConfirm(null) }}>确认</Button></footer></Dialog>}
  </div>
}
