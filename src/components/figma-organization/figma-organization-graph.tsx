import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import { ChevronDown, ChevronRight, GitFork, Hand, Maximize2, Minus, Plus, RotateCcw, SquarePen, Users } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import type { GroupMember } from '../../data/figma-organization'
import { canvasScale, fitFigmaCanvas, kpiTone, type FigmaDepartment, type FigmaDialogAction, type FigmaGroup } from './figma-organization-model'

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

function MemberCard({ member, onAction }: { member: GroupMember; onAction: Props['onAction'] }) {
  return <Card className="fg-member-card" data-member-id={member.id} data-tone={kpiTone(member.kpiRate)}>
    <div className="fg-progress-fill" style={{ width: `${kpiTone(member.kpiRate) === 'unknown' ? 0 : member.kpiRate}%` }} aria-hidden />
    <div className="fg-node-foreground">
      <div className="fg-member-identity">
        <div className="fg-member-name"><span className="fg-member-avatar" aria-hidden>{member.name.slice(0, 1)}</span><div><strong>{member.name}</strong><code>({member.code})</code></div></div>
        <div className="fg-member-badges"><span className="fg-level-badge">{member.level}</span><KpiBadge rate={member.kpiRate} /></div>
      </div>
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
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(['grp-op6']))
  const canvasRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; originX: number; originY: number } | null>(null)
  const width = Math.max(480, groups.length * 374.8 - 24)
  const percentage = Math.round(view.scale * 100)
  const expanded = query.length > 0 || !departmentCollapsed

  const resetView = () => {
    const canvas = canvasRef.current
    const available = (canvas?.clientWidth ?? 1850) - 64
    const small = available < 700
    const scale = small ? canvasScale(Math.min(1, available / 480)) : 1
    setView({ scale, x: small ? (available - width * scale) / 2 : 0, y: small ? 24 : 0 })
  }

  useLayoutEffect(() => {
    resetView()
    const canvas = canvasRef.current
    if (!canvas) return
    let previousWidth = canvas.clientWidth
    const observer = new ResizeObserver(() => {
      if (canvas.clientWidth === previousWidth) return
      const nextWidth = canvas.clientWidth
      // Opening a dialog removes the page scrollbar; that is not a viewport resize.
      const resized = Math.abs(nextWidth - previousWidth) > 32 || (nextWidth < 764) !== (previousWidth < 764)
      previousWidth = canvas.clientWidth
      if (resized) resetView()
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [width, query])

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

  return <div className="fg-graph-workspace">
    <section className="fg-toolbar" id="figma-controls" aria-label="组织画布工具栏">
      <div className="fg-toolbar-heading"><span className="fg-toolbar-icon"><GitFork size={20} /></span><div><div className="fg-toolbar-title"><h1>{department.deptName}</h1><span>组织与绩效</span></div><p>{department.groups.length} 个业务组 · {department.totalCount} 人</p></div></div>
      <div className="fg-kpi-legend" aria-label="绩效完成率等级"><span data-tone="excellent"><i />完成率 ≥90% (优秀)</span><span data-tone="good"><i />完成率 75~89% (良好)</span><span data-tone="warning"><i />完成率 &lt;75% (预警)</span></div>
      <div className="fg-canvas-actions"><div className="fg-zoom-control"><Button variant="ghost" aria-label="缩小画布" title="缩小画布" disabled={view.scale <= 0.1} onClick={() => zoom(-0.1)}><Minus size={12} /></Button><output aria-label="画布缩放比例">{percentage}%</output><Button variant="ghost" aria-label="放大画布" title="放大画布" disabled={view.scale >= 1.4} onClick={() => zoom(0.1)}><Plus size={12} /></Button></div>
        <Button variant="ghost" className="fg-outline-button fg-reset-view" title="复位画布位置" onClick={resetView}><RotateCcw size={13} /><span>复位画布</span></Button>
        <Button variant="ghost" className="fg-outline-button fg-fit-view" aria-label="适应画布" title="适应画布" onClick={fit}><Maximize2 size={14} /></Button>
        <Button variant="ghost" className="fg-primary-button" onClick={() => onAction({ type: 'add-group' })}><Plus size={14} />新增业务组</Button>
        <Button variant="ghost" className="fg-outline-button" onClick={() => { setDepartmentCollapsed(false); setCollapsed(new Set()) }}>展开全部</Button>
      </div>
    </section>

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
            <div className="fg-progress-fill" style={{ width: `${department.manager.kpiRate}%` }} aria-hidden />
            <div className="fg-node-foreground"><div className="fg-manager-top"><div><span className="fg-role-badge">L1 · 部门经理框</span><h2>{department.deptName}</h2></div><div><span className="fg-manager-kpi">部门绩效: {department.manager.kpiRate}%</span><Button variant="ghost" className="fg-purple-button" aria-expanded={expanded} disabled={!!query} onClick={() => setDepartmentCollapsed((value) => !value)}>{expanded ? '折叠部门' : '展开组树'}{expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</Button></div></div>
              <div className="fg-manager-details"><div><span className="fg-manager-avatar" aria-hidden>{department.manager.name.slice(0, 1)}</span><div><div className="fg-manager-name"><strong>【部门经理】 {department.manager.name}</strong><span>{department.manager.level}</span></div><p>工号: {department.manager.code} · {department.manager.email}</p></div></div><div className="fg-manager-rate"><span>完成率配比:</span><strong>{department.manager.kpiRate}%</strong></div></div>
              <div className="fg-manager-bottom"><span>下辖 {department.groups.length} 个业务运营组</span><Button variant="ghost" className="fg-soft-purple-button" onClick={() => onAction({ type: 'add-group' })}><Plus size={12} />新增业务组</Button></div>
            </div>
          </Card>
          {expanded && <div className="fg-department-line" aria-hidden />}
        </div>
        {expanded && <div className="fg-groups"><div className="fg-group-spine" style={{ width: groups.length === 1 ? 2 : '95%' }} aria-hidden /><div className="fg-group-grid" style={{ gridTemplateColumns: `repeat(${Math.max(1, groups.length)}, 350.8px)` }}>
          {groups.map((group) => {
            const isCollapsed = !query && collapsed.has(group.id)
            return <section className="fg-group-column" key={group.id} aria-label={group.groupName} data-group-id={group.id}>
              <div className="fg-group-line" aria-hidden />
              <Card className={`fg-group-card${isCollapsed ? ' is-collapsed' : ''}`} data-node="group"><div className="fg-progress-fill" style={{ width: `${group.leader?.kpiRate ?? 0}%` }} aria-hidden /><div className="fg-node-foreground">
                <div className="fg-group-top"><span className="fg-group-name">{group.groupName}</span><div><KpiBadge rate={group.leader?.kpiRate ?? null} prefix="组KPI: " /><Button variant="ghost" className="fg-indigo-button" aria-label={`${isCollapsed ? '展开' : '折叠'}${group.groupName}组员`} aria-expanded={!isCollapsed} disabled={!!query} onClick={() => toggleGroup(group.id)}>{isCollapsed ? '展开组员' : '折叠组'}{isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}</Button></div></div>
                <div className="fg-group-details"><div><span className="fg-leader-avatar" aria-hidden>组</span><div><div className="fg-leader-name"><strong>{group.leader ? `【组长】 ${group.leader.name}` : '待指定组长'}</strong>{group.leader && <span>{group.leader.level}</span>}</div><p>工号: {group.leader?.code ?? '待分配'}</p></div></div><strong className="fg-group-count">{group.memberCount}人</strong></div>
                <div className="fg-group-bottom"><Button variant="ghost" className="fg-add-member-button" onClick={() => onAction({ type: 'add-member', groupId: group.id })}><Plus size={12} />直接加组员</Button><Button variant="ghost" className="fg-rename-button" title="重命名组" aria-label={`重命名${group.groupName}`} onClick={() => onAction({ type: 'rename-group', groupId: group.id })}><SquarePen size={12} /></Button></div>
              </div></Card>
              {!isCollapsed && <><div className="fg-members-line" aria-hidden /><div className="fg-member-list"><div className="fg-member-list-heading"><h3><Users size={14} />{group.groupName} · 组员名录</h3><Button variant="ghost" className="fg-add-member-link" onClick={() => onAction({ type: 'add-member', groupId: group.id })}><Plus size={10} />新增组员</Button></div><div className="fg-member-rows">{group.members.map((member) => <MemberCard key={member.id} member={member} onAction={onAction} />)}{!group.members.length && <div className="fg-no-members">暂无组员</div>}</div></div></>}
            </section>
          })}
        </div></div>}
      </div>}
    </div>
  </div>
}
