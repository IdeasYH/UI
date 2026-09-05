import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import { BookOpen, ChevronDown, ChevronRight, ChevronUp, Database, GitFork, Hand, KeyRound, Maximize2, Minimize2, Minus, Network, Plus, RotateCcw, ShieldCheck, SquarePen, Trash2, UserRoundCog, Users } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { PersonAccess, TagManagerButton } from './person-access'
import { OrganizationBddGuide } from './organization-bdd-guide'
import type { GroupMember, ResponsiblePerson } from '../../data/figma-organization'
import { canvasScale, crossLevelResponsiblePersonIds, fitFigmaCanvas, kpiTone, type FigmaDepartment, type FigmaDialogAction, type FigmaGroup } from './figma-organization-model'

type Props = {
  department: FigmaDepartment
  groups: FigmaGroup[]
  query: string
  onClearSearch: () => void
  onAction: (action: FigmaDialogAction) => void
}

function KpiBadge({ rate, prefix = '' }: { rate: number | null; prefix?: string }) {
  const tone = kpiTone(rate)
  return <span className="fg-kpi-badge" data-tone={tone}>{tone === 'unknown' ? '待统计' : `${prefix}${rate}%`}</span>
}

function ResponsiblePeople({ people, label, tone, crossLevelIds, node }: { people: ResponsiblePerson[]; label: string; tone: 'department' | 'group'; crossLevelIds: Set<string>; node: string }) {
  return <div className="fg-responsible-block" data-responsible-tone={tone}>
    <div className="fg-responsible-heading"><span>{label}</span><strong>{people.length} 人 · 平级共同负责</strong></div>
    {people.length ? <div className="fg-responsible-list">
      {people.map((person) => <div className="fg-responsible-person" key={person.personId} data-person-id={person.personId}>
        <span className="fg-responsible-avatar" aria-hidden>{person.name.slice(0, 1)}</span>
        <div className="fg-responsible-identity"><div><strong>{person.name}</strong><span>{person.level}</span>{crossLevelIds.has(person.personId) && <em>跨层任职</em>}</div><p>{person.position} · {person.code}</p></div>
        <KpiBadge rate={person.kpiRate} />
        <PersonAccess person={{ id: person.personId, name: person.name, node, leader: true }} />
      </div>)}
    </div> : <p className="fg-responsible-empty">待指定负责人</p>}
  </div>
}

function ArchitecturePermissionGuide({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  if (!expanded) return null
  return <Card className="fg-architecture-guide" id="figma-architecture-guide" role="region" aria-label="组织架构与权限 BDD 说明书">
    <div className="fg-architecture-guide-header">
      <span className="fg-architecture-guide-icon"><Network size={18} /></span>
      <div><div><h2>组织架构与权限原理</h2><span>实现阅读入口</span></div><p>拓扑表达组织节点、负责人任职、数据汇聚与权限所辖之间的关系。</p></div>
      <Button variant="ghost" className="fg-architecture-guide-toggle" aria-expanded={expanded} aria-controls="figma-architecture-guide-content" onClick={onToggle}>{expanded ? '收起说明' : '展开完整说明'}{expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</Button>
    </div>
    {expanded && <div id="figma-architecture-guide-content" className="fg-architecture-guide-content">
      <div className="fg-architecture-flow" aria-label="组织权限计算顺序">
        <span><Network size={13} />组织节点</span><ChevronRight size={13} /><span><UserRoundCog size={13} />负责人任职</span><ChevronRight size={13} /><span><ShieldCheck size={13} />节点数据范围</span><ChevronRight size={13} /><span><KeyRound size={13} />功能权限校验</span><ChevronRight size={13} /><span><Database size={13} />授权数据结果</span>
      </div>
      <div className="fg-architecture-rules">
        <section><span>01</span><div><h3>组织节点定义范围</h3><p>“部”和“组”是数据与权限的所辖节点，不是单人岗位。父节点覆盖其下辖子节点，同级节点保持各自范围。</p></div></section>
        <section><span>02</span><div><h3>负责人是任职关系</h3><p>节点允许多名平级负责人，默认看本人及下级。每个任职可单独配置看本人、看本人及下级或看本系统全部。</p></div></section>
        <section><span>03</span><div><h3>允许跨层与多节点任职</h3><p>同一人员可以跨层任职。权限按各次任职保存，基础范围与额外组织范围合并；组织树勾选上级包含全部下级。</p></div></section>
        <section><span>04</span><div><h3>查看范围与操作权限分开</h3><p>读取数据须同时满足 HRM 查看权限和数据查看范围。编辑、删除、审批另须动作专属的数据范围，不能把这里的查看范围直接当作修改范围。</p></div></section>
        <section><span>05</span><div><h3>汇总按稳定实体去重</h3><p>节点人数和业务指标按其自身及下级范围汇聚；跨层负责人按人员 ID 去重，负责人任职本身不增加人员总数。</p></div></section>
        <section><span>06</span><div><h3>特殊角色使用人员标签</h3><p>KA 等标签按人员身份共享，以稳定编码供其他程序识别。标签不授予权限；功能、按钮权限统一由 HRM 管理，额外查看范围不改变业绩归属。</p></div></section>
      </div>
      <div className="fg-architecture-formulas"><code>个人查看范围 = 并集（各有效任职的基础范围 + 额外组织范围）</code><code>读取须满足 HRM 对应读取权限与查看范围；写入范围另行定义</code></div>
      <p className="fg-architecture-boundary"><ShieldCheck size={12} />当前页面只表达 UI 与组织权限模型。生产接入必须由后端校验稳定人员 ID、组织 ID、有效任职关系、功能权限和数据范围；前端标签本身不授予权限。</p>
      <OrganizationBddGuide />
    </div>}
  </Card>
}

function MemberCard({ member, onAction, node }: { member: GroupMember; onAction: Props['onAction']; node: string }) {
  return <Card className="fg-member-card" data-member-id={member.id} data-tone={kpiTone(member.kpiRate)}>
    <div className="fg-progress-fill" style={{ width: `${kpiTone(member.kpiRate) === 'unknown' ? 0 : member.kpiRate}%` }} aria-hidden />
    <div className="fg-node-foreground">
      <div className="fg-member-identity">
        <div className="fg-member-name"><span className="fg-member-avatar" aria-hidden>{member.name.slice(0, 1)}</span><div><strong>{member.name}</strong><code>({member.code})</code></div></div>
        <div className="fg-member-badges"><span className="fg-level-badge">{member.level}</span><KpiBadge rate={member.kpiRate} /></div>
      </div>
      <PersonAccess person={{ id: member.id, name: member.name, node, leader: false }} />
      <div className="fg-member-bottom"><span className="fg-position" title={member.position}>{member.position}</span><div className="fg-member-actions">
        <Button variant="ghost" className="fg-transfer-button" title="跨组调岗" aria-label={`调岗 ${member.name}`} onClick={() => onAction({ type: 'transfer-member', memberId: member.id })}>调岗</Button>
        <Button variant="ghost" className="fg-edit-button" title="编辑资料" aria-label={`编辑 ${member.name}`} onClick={() => onAction({ type: 'edit-member', memberId: member.id })}>编辑</Button>
        <Button variant="ghost" className="fg-departure-button" title="办理离职" aria-label={`离职 ${member.name}`} onClick={() => onAction({ type: 'departure', memberId: member.id })}>离职</Button>
      </div></div>
    </div>
  </Card>
}

export function FigmaOrganizationGraph({ department, groups, query, onClearSearch, onAction }: Props) {
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [departmentCollapsed, setDepartmentCollapsed] = useState(false)
  const [guideExpanded, setGuideExpanded] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null)
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(['grp-op6']))
  const canvasRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; originX: number; originY: number } | null>(null)
  const width = Math.max(480, groups.length * 374.8 - 24)
  const percentage = Math.round(view.scale * 100)
  const expanded = query.length > 0 || !departmentCollapsed
  const crossLevelIds = crossLevelResponsiblePersonIds(department)

  const resetView = () => {
    const canvas = canvasRef.current
    const available = (canvas?.clientWidth ?? 1850) - 64
    const small = available < 700
    const scale = small ? canvasScale(Math.min(1, available / 480)) : 1
    setView({ scale, x: small ? (available - width * scale) / 2 : 0, y: small ? 24 : 0 })
  }

  useLayoutEffect(() => {
    if (!fullscreen) resetView()
    const canvas = canvasRef.current
    if (!canvas) return
    let previousWidth = canvas.clientWidth
    const observer = new ResizeObserver(() => {
      if (canvas.clientWidth === previousWidth) return
      const nextWidth = canvas.clientWidth
      // Opening a dialog removes the page scrollbar; that is not a viewport resize.
      const resized = Math.abs(nextWidth - previousWidth) > 32 || (nextWidth < 764) !== (previousWidth < 764)
      previousWidth = canvas.clientWidth
      if (resized) {
        if (fullscreen) fit()
        else resetView()
      }
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [width, query, fullscreen])

  const zoom = (step: number) => {
    const canvas = canvasRef.current
    const center = { x: ((canvas?.clientWidth ?? 900) - 64) / 2, y: ((canvas?.clientHeight ?? 750) - 64) / 2 }
    setView((previous) => {
      const scale = canvasScale(previous.scale + step)
      const ratio = scale / previous.scale
      return { scale, x: center.x - (center.x - previous.x) * ratio, y: center.y - (center.y - previous.y) * ratio }
    })
  }

  const fit = () => {
    const canvas = canvasRef.current
    const flow = flowRef.current
    if (canvas && flow) setView(fitFigmaCanvas({ width: canvas.clientWidth - 64, height: canvas.clientHeight - 64 }, { width, height: flow.offsetHeight }))
  }

  useLayoutEffect(() => {
    if (!fullscreen) return
    // Page fullscreen uses the browser viewport, without the browser Fullscreen API.
    const frame = requestAnimationFrame(fit)
    return () => cancelAnimationFrame(frame)
  }, [fullscreen])

  useEffect(() => {
    if (!fullscreen) return
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Hide covered page controls from keyboard navigation; portal dialogs opened
    // afterwards remain interactive and keep their own focus handling.
    const siblings: { element: HTMLElement; inert: boolean }[] = []
    let current: HTMLElement | null = workspaceRef.current
    while (current && current !== document.body) {
      const parent: HTMLElement | null = current.parentElement
      for (const sibling of Array.from(parent?.children ?? [])) {
        if (sibling !== current && sibling instanceof HTMLElement) {
          siblings.push({ element: sibling, inert: sibling.inert })
          sibling.inert = true
        }
      }
      current = parent
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented && !document.querySelector('[role="dialog"]')) {
        event.preventDefault()
        setFullscreen(false)
        fullscreenButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', escape)
    return () => {
      document.body.style.overflow = oldOverflow
      siblings.forEach(({ element, inert }) => { element.inert = inert })
      document.removeEventListener('keydown', escape)
    }
  }, [fullscreen])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Non-passive wheel handling keeps zoom/pan inside this canvas, not the whole document.
    const wheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const point = { x: event.clientX - rect.left - 32, y: event.clientY - rect.top - 32 }
      setView((previous) => {
        if (!event.ctrlKey && !event.metaKey) return { ...previous, x: previous.x - (event.shiftKey ? event.deltaY : event.deltaX), y: previous.y - (event.shiftKey ? 0 : event.deltaY) }
        const scale = canvasScale(previous.scale * Math.exp(-event.deltaY * 0.005))
        const ratio = scale / previous.scale
        return { scale, x: point.x - (point.x - previous.x) * ratio, y: point.y - (point.y - previous.y) * ratio }
      })
    }
    canvas.addEventListener('wheel', wheel, { passive: false })
    return () => canvas.removeEventListener('wheel', wheel)
  }, [])

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as Element).closest('button, a, input, [role="menu"]')) return
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, originX: view.x, originY: view.y }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const active = drag.current
    if (!active || active.id !== event.pointerId) return
    setView((previous) => ({ ...previous, x: active.originX + event.clientX - active.x, y: active.originY + event.clientY - active.y }))
  }
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    drag.current = null
    setDragging(false)
  }
  const toggleGroup = (id: string) => setCollapsed((previous) => {
    const next = new Set(previous)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  return <div ref={workspaceRef} className={`fg-graph-workspace${fullscreen ? ' is-page-fullscreen' : ''}`}>
    <section className="fg-toolbar" id="figma-controls" aria-label="组织画布工具栏">
      <div className="fg-toolbar-heading"><span className="fg-toolbar-icon"><GitFork size={20} /></span><div><div className="fg-toolbar-title"><h1>{department.deptName}</h1><span>组织与绩效</span></div><p>{department.groups.length} 个业务组 · {department.totalCount} 人 · 节点用于数据汇聚与权限所辖</p></div></div>
      <div className="fg-kpi-legend" aria-label="绩效完成率等级"><span data-tone="excellent"><i />完成率 ≥90% (优秀)</span><span data-tone="good"><i />完成率 75~89% (良好)</span><span data-tone="warning"><i />完成率 &lt;75% (预警)</span></div>
      <div className="fg-canvas-actions"><div className="fg-zoom-control"><Button variant="ghost" aria-label="缩小画布" title="缩小画布" disabled={view.scale <= 0.1} onClick={() => zoom(-0.1)}><Minus size={12} /></Button><output aria-label="画布缩放比例">{percentage}%</output><Button variant="ghost" aria-label="放大画布" title="放大画布" disabled={view.scale >= 1.4} onClick={() => zoom(0.1)}><Plus size={12} /></Button></div>
        <Button variant="ghost" className="fg-outline-button fg-reset-view" title="复位画布位置" onClick={resetView}><RotateCcw size={13} /><span>复位画布</span></Button>
        <Button ref={fullscreenButtonRef} variant="ghost" className="fg-outline-button fg-fit-view" aria-label={fullscreen ? '退出网页全屏' : '网页内全屏'} title={fullscreen ? '退出网页全屏（Esc）' : '网页内全屏'} aria-pressed={fullscreen} onClick={() => setFullscreen((value) => !value)}>{fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}{fullscreen ? '退出全屏' : '网页全屏'}</Button>
        <TagManagerButton />
        <Button variant="ghost" className="fg-outline-button" aria-expanded={guideExpanded} aria-controls="figma-architecture-guide" onClick={() => setGuideExpanded((value) => !value)}><BookOpen size={14} />{guideExpanded ? '收起说明书' : '组织与权限说明书'}</Button>
        <Button variant="ghost" className="fg-primary-button" onClick={() => onAction({ type: 'add-group' })}><Plus size={14} />新增业务组</Button>
        <Button variant="ghost" className="fg-outline-button" onClick={() => { setDepartmentCollapsed(false); setCollapsed(new Set()) }}>展开全部</Button>
        <Button variant="ghost" className="fg-outline-button" onClick={() => { onClearSearch(); setDepartmentCollapsed(true); setCollapsed(new Set(department.groups.map((group) => group.id))) }}>折叠全部</Button>
      </div>
    </section>

    <ArchitecturePermissionGuide expanded={guideExpanded} onToggle={() => setGuideExpanded((value) => !value)} />

    <div ref={canvasRef} className={`fg-canvas${dragging ? ' is-dragging' : ''}`} id="figma-canvas" role="region" aria-label="组织人员连线画布" tabIndex={0} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { drag.current = null; setDragging(false) }} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return
      const directions: Record<string, [number, number]> = { ArrowLeft: [50, 0], ArrowRight: [-50, 0], ArrowUp: [0, 50], ArrowDown: [0, -50] }
      const direction = directions[event.key]
      if (direction) { event.preventDefault(); setView((previous) => ({ ...previous, x: previous.x + direction[0], y: previous.y + direction[1] })) }
      else if (event.key === 'Home') { event.preventDefault(); resetView() }
      else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(0.1) }
      else if (event.key === '-') { event.preventDefault(); zoom(-0.1) }
    }}>
      <div className="fg-canvas-indicator"><Hand size={12} aria-hidden /><span>{percentage}%</span><span>组织关系</span></div>
      {query && !groups.length ? <div className="fg-search-empty"><Users size={28} /><h2>没有匹配的组织或人员</h2><Button variant="ghost" className="fg-outline-button" onClick={onClearSearch}>清除搜索</Button></div> : <div ref={flowRef} className="fg-flow" style={{ width, transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }} data-scale={view.scale}>
        <div className="fg-manager-node">
          <Card className={`fg-manager-card${!expanded ? ' is-collapsed' : ''}`} data-node="department">
            <div className="fg-progress-fill" style={{ width: `${department.kpiRate}%` }} aria-hidden />
            <div className="fg-node-foreground"><div className="fg-manager-top"><div><span className="fg-role-badge">L1 · 部门节点</span><h2>{department.deptName}</h2></div><div><span className="fg-manager-kpi">部门绩效: {department.kpiRate}%</span><Button variant="ghost" className="fg-purple-button" aria-expanded={expanded} disabled={!!query} onClick={() => setDepartmentCollapsed((value) => !value)}>{expanded ? '折叠部门' : '展开组树'}{expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</Button></div></div>
              <ResponsiblePeople people={department.managers} label="部门负责人" tone="department" crossLevelIds={crossLevelIds} node="department" />
              <div className="fg-manager-bottom"><span><ShieldCheck size={12} />数据与权限范围 · 下辖 {department.groups.length} 组 / 汇聚 {department.totalCount} 人</span><Button variant="ghost" className="fg-soft-purple-button" onClick={() => onAction({ type: 'add-group' })}><Plus size={12} />新增业务组</Button></div>
              <div className="fg-node-actions"><Button variant="ghost" aria-label={`编辑部门${department.deptName}`} onClick={() => onAction({ type: 'rename-department' })}><SquarePen size={13} />编辑节点</Button><Button variant="ghost" className="fg-node-delete" aria-label={`删除部门${department.deptName}`} onClick={() => onAction({ type: 'delete-department' })}><Trash2 size={13} />删除节点</Button></div>
            </div>
          </Card>
          {expanded && <div className="fg-department-line" aria-hidden />}
        </div>
        {expanded && <div className="fg-groups"><div className="fg-group-spine" style={{ width: groups.length === 1 ? 2 : '95%' }} aria-hidden /><div className="fg-group-grid" style={{ gridTemplateColumns: `repeat(${Math.max(1, groups.length)}, 350.8px)` }}>
          {groups.map((group) => {
            const isCollapsed = !query && collapsed.has(group.id)
            return <section className="fg-group-column" key={group.id} aria-label={group.groupName} data-group-id={group.id}>
              <div className="fg-group-line" aria-hidden />
              <Card className={`fg-group-card${isCollapsed ? ' is-collapsed' : ''}`} data-node="group"><div className="fg-progress-fill" style={{ width: `${group.kpiRate ?? 0}%` }} aria-hidden /><div className="fg-node-foreground">
                <div className="fg-group-top"><span className="fg-group-name">{group.groupName}</span><div><KpiBadge rate={group.kpiRate} prefix="组KPI: " /><Button variant="ghost" className="fg-indigo-button" aria-label={`${isCollapsed ? '展开' : '折叠'}${group.groupName}组员`} aria-expanded={!isCollapsed} disabled={!!query} onClick={() => toggleGroup(group.id)}>{isCollapsed ? '展开组员' : '折叠组'}{isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}</Button></div></div>
                <ResponsiblePeople people={group.leaders} label="组负责人" tone="group" crossLevelIds={crossLevelIds} node={group.id} />
                <div className="fg-group-scope"><span><ShieldCheck size={11} />数据与权限范围 · 汇聚 {group.memberCount} 人</span></div>
                <div className="fg-group-bottom"><Button variant="ghost" className="fg-add-member-button" onClick={() => onAction({ type: 'add-member', groupId: group.id })}><Plus size={12} />直接加组员</Button></div>
                <div className="fg-node-actions"><Button variant="ghost" aria-label={`编辑业务组${group.groupName}`} onClick={() => onAction({ type: 'rename-group', groupId: group.id })}><SquarePen size={13} />编辑节点</Button><Button variant="ghost" className="fg-node-delete" aria-label={`删除业务组${group.groupName}`} onClick={() => onAction({ type: 'delete-group', groupId: group.id })}><Trash2 size={13} />删除节点</Button></div>
              </div></Card>
              {!isCollapsed && <><div className="fg-members-line" aria-hidden /><div className="fg-member-list"><div className="fg-member-list-heading"><h3><Users size={14} />{group.groupName} · 组员名录</h3><Button variant="ghost" className="fg-add-member-link" onClick={() => onAction({ type: 'add-member', groupId: group.id })}><Plus size={10} />新增组员</Button></div><div className="fg-member-rows">{group.members.map((member) => <MemberCard key={member.id} member={member} node={group.id} onAction={onAction} />)}{!group.members.length && <div className="fg-no-members">暂无组员</div>}</div></div></>}
            </section>
          })}
        </div></div>}
      </div>}
    </div>
  </div>
}
