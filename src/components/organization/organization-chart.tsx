import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Building2, ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Maximize2, Minus, Plus, Users } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { PersonAvatar } from './organization-controls'
import { cn } from '../../lib/utils'
import type { EmploymentStatus, Organization, OrganizationPerson } from '../../data/demo-organization'
import { descendantIds, organizationConnector, organizationPath, visibleOrganizationIds } from './organization-model'

type ChartProps = {
  organizations: readonly Organization[]
  people: readonly OrganizationPerson[]
  rootId: string
  selectedId: string
  counts: ReadonlyMap<string, number>
  status?: EmploymentStatus
  onSelect: (id: string) => void
  direction?: 'vertical' | 'horizontal'
  appearance?: 'compact' | 'portrait' | 'ledger'
  maxDepth?: number
  showToolbar?: boolean
}

type Connector = { id: string; parentId: string; path: string }
type Geometry = { width: number; height: number; availableWidth: number; connectors: Connector[] }

export function OrganizationChart({ organizations, people, rootId, selectedId, counts, status = 'active', onSelect, direction = 'vertical', appearance = 'portrait', maxDepth = Infinity, showToolbar = true }: ChartProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [zoom, setZoom] = useState(1)
  const [geometry, setGeometry] = useState<Geometry>({ width: 0, height: 0, availableWidth: 0, connectors: [] })
  const stageRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const markerId = useId().replaceAll(':', '')
  const visible = visibleOrganizationIds(organizations, rootId, collapsed, maxDepth)
  const visibleKey = [...visible].join('|')
  const selectedPath = new Set(organizationPath(organizations, selectedId).map((organization) => organization.id))
  const root = organizations.find((organization) => organization.id === rootId)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const scroll = scrollRef.current
    if (!stage || !scroll) return
    let frame = 0
    const measure = () => {
      const bounds = stage.getBoundingClientRect()
      const nodes = new Map(Array.from(stage.querySelectorAll<HTMLElement>('[data-org-node]')).map((element) => [element.dataset.orgNode!, element.getBoundingClientRect()]))
      const connectors: Connector[] = []
      organizations.forEach((organization) => {
        const child = nodes.get(organization.id)
        const parent = organization.parentId ? nodes.get(organization.parentId) : undefined
        if (!child || !parent) return
        const from = direction === 'vertical'
          ? { x: (parent.left + parent.width / 2 - bounds.left) / zoom, y: (parent.bottom - bounds.top) / zoom }
          : { x: (parent.right - bounds.left) / zoom, y: (parent.top + parent.height / 2 - bounds.top) / zoom }
        const to = direction === 'vertical'
          ? { x: (child.left + child.width / 2 - bounds.left) / zoom, y: (child.top - bounds.top) / zoom - 3 }
          : { x: (child.left - bounds.left) / zoom - 3, y: (child.top + child.height / 2 - bounds.top) / zoom }
        connectors.push({ id: organization.id, parentId: organization.parentId!, path: organizationConnector(from, to, direction) })
      })
      // clientWidth rounds fractional CSS pixels up on some display scales.
      const next = { width: stage.offsetWidth, height: stage.offsetHeight, availableWidth: Math.max(0, scroll.clientWidth - 1), connectors }
      setGeometry((previous) => previous.width === next.width && previous.height === next.height && previous.availableWidth === next.availableWidth && previous.connectors.length === next.connectors.length && previous.connectors.every((connector, index) => connector.id === next.connectors[index].id && connector.path === next.connectors[index].path) ? previous : next)
    }
    measure()
    // ResizeObserver keeps the same connector endpoints after text layout, zoom, and viewport changes.
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    })
    observer.observe(stage)
    observer.observe(scroll)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [organizations, visibleKey, direction, appearance, zoom])

  useLayoutEffect(() => {
    if (direction !== 'vertical' || !scrollRef.current) return
    // Keep the root visible on narrow screens; later user panning is left untouched.
    scrollRef.current.scrollLeft = Math.max(0, (geometry.width * zoom - scrollRef.current.clientWidth) / 2)
  }, [direction, geometry.width, geometry.availableWidth, zoom])

  const toggle = (id: string) => {
    if (!collapsed.has(id) && selectedId !== id && descendantIds(organizations, id).has(selectedId)) onSelect(id)
    setCollapsed((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const render = (organization: Organization, depth: number) => {
    if (!visible.has(organization.id)) return null
    const children = organizations.filter((child) => child.parentId === organization.id)
    const manager = people.find((person) => person.personId === organization.managerId)
    const directMembers = people.filter((person) => person.organizationId === organization.id && person.status === status)
    return <li className="org-chart-branch" key={organization.id}>
      <div className="org-node-wrap">
        <Card className={cn('org-chart-node', selectedId === organization.id && 'is-selected')} data-org-node={organization.id} data-tone={organization.tone}>
          <Button variant="ghost" className="org-node-main" aria-pressed={selectedId === organization.id} aria-label={`选择组织：${organization.name}`} onClick={() => onSelect(organization.id)}>
            {appearance === 'compact' ? <><span className="org-node-symbol"><Building2 size={19} /></span><span className="org-node-title"><strong>{organization.name}</strong><small>{manager?.displayName ?? '未设置负责人'} · {counts.get(organization.id) ?? 0} 人</small></span><ChevronRight size={14} /></> : <>
              <span className="org-node-topline"><span><Building2 size={11} />{organization.kind}</span><span><Users size={11} />{counts.get(organization.id) ?? 0}</span></span>
              <strong className="org-node-name">{organization.name}</strong>
              <span className="org-node-owner">{manager && <PersonAvatar person={manager} />}<span>{manager?.displayName ?? '未设置负责人'}<small>{manager?.position ?? '负责人'}</small></span></span>
            </>}
          </Button>
          {appearance === 'ledger' && <div className="org-node-members"><span className="org-avatar-stack">{directMembers.slice(0, 3).map((person) => <PersonAvatar key={person.personId} person={person} />)}</span><span>直属 {directMembers.length} 人</span></div>}
        </Card>
        {children.length > 0 && depth < maxDepth && showToolbar && <Button variant="icon" className="org-node-collapse" aria-label={`${collapsed.has(organization.id) ? '展开' : '收起'}${organization.name}下级`} title={collapsed.has(organization.id) ? '展开下级' : '收起下级'} aria-expanded={!collapsed.has(organization.id)} onClick={() => toggle(organization.id)}>{collapsed.has(organization.id) ? <Plus size={10} /> : direction === 'vertical' ? <ChevronDown size={11} /> : <ChevronRight size={11} />}</Button>}
      </div>
      {children.some((child) => visible.has(child.id)) && <ul className="org-chart-children">{children.map((child) => render(child, depth + 1))}</ul>}
    </li>
  }

  const scaledWidth = Math.max(geometry.width * zoom, geometry.availableWidth)
  return <div className={cn('org-chart', `org-chart-${direction}`, `org-chart-${appearance}`)} id="organization-chart">
    <div ref={scrollRef} className="org-chart-scroll" tabIndex={0} role="region" aria-label={`${direction === 'vertical' ? '纵向' : '横向'}组织关系图，可滚动`}>
      <div className="org-chart-size" style={{ width: scaledWidth || '100%', height: geometry.height * zoom }}>
        <div ref={stageRef} className="org-chart-stage" style={{ transform: `scale(${zoom})`, left: (scaledWidth - geometry.width * zoom) / 2 }}>
          <svg className="org-connectors" width={geometry.width} height={geometry.height} aria-hidden>
            <defs><marker id={`${markerId}-arrow`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M 1 1 L 5 3 L 1 5" fill="none" stroke="#a7b5c4" strokeWidth="1" /></marker><marker id={`${markerId}-active`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M 1 1 L 5 3 L 1 5" fill="none" stroke="#3478f6" strokeWidth="1" /></marker></defs>
            {geometry.connectors.map((connector) => <path key={connector.id} data-connection={connector.id} data-parent={connector.parentId} d={connector.path} className={cn('org-connector', selectedPath.has(connector.id) && selectedPath.has(connector.parentId) && 'is-active')} markerEnd={`url(#${markerId}-${selectedPath.has(connector.id) && selectedPath.has(connector.parentId) ? 'active' : 'arrow'})`} />)}
          </svg>
          <ul className="org-chart-root">{root && render(root, 0)}</ul>
        </div>
      </div>
    </div>
    {showToolbar && <div className="org-chart-bottom"><span>{visible.size} 个组织节点</span><div className="org-chart-tools" role="toolbar" aria-label="组织图工具">
      <Button variant="icon" title="收起下级组织" aria-label="收起下级组织" onClick={() => { setCollapsed(new Set(organizations.map((organization) => organization.id))); onSelect(rootId) }}><ChevronsDownUp size={14} /></Button>
      <Button variant="icon" title="展开所有下级" aria-label="展开所有下级" onClick={() => setCollapsed(new Set())}><ChevronsUpDown size={14} /></Button>
      <span className="org-tool-divider" />
      <Button variant="icon" title="缩小组织图" aria-label="缩小组织图" disabled={zoom <= .1} onClick={() => setZoom((current) => Math.max(.1, Number((current - .1).toFixed(2))))}><Minus size={14} /></Button>
      <Button variant="ghost" className="org-zoom-value" title="还原为 100%" aria-label="还原组织图比例" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</Button>
      <Button variant="icon" title="放大组织图" aria-label="放大组织图" disabled={zoom >= 1.5} onClick={() => setZoom((current) => Math.min(1.5, Number((current + .1).toFixed(2))))}><Plus size={14} /></Button>
      <Button variant="icon" title="适应可用宽度" aria-label="适应组织图宽度" onClick={() => setZoom(Math.max(.1, Math.min(1.2, (geometry.availableWidth - 16) / geometry.width)))}><Maximize2 size={14} /></Button>
    </div></div>}
  </div>
}
