import { useId, useMemo, useState } from 'react'
import { ArrowDownUp, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsDownUp, ChevronsUpDown, Network, Search, Users, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Dialog } from '../ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { cn } from '../../lib/utils'
import { organizationStatuses, type EmploymentStatus, type Organization, type OrganizationPerson } from '../../data/demo-organization'
import { organizationPath } from './organization-model'

export function PersonAvatar({ person, large = false }: { person: OrganizationPerson; large?: boolean }) {
  const index = Number(person.personId.slice(-3)) % 4
  return <span aria-hidden className={cn('org-avatar', `org-avatar-${index}`, large && 'org-avatar-large')}>{person.displayName.slice(-2)}</span>
}

export function OrganizationSearch({ value, onChange }: { value: string; onChange: (query: string) => void }) {
  return <div className="org-search"><Search size={15} aria-hidden /><Input aria-label="搜索人员" placeholder="姓名 / 拼音 / 首字母 / 工号" value={value} onChange={(event) => onChange(event.target.value)} />{value && <Button variant="icon" title="清除人员搜索" aria-label="清除人员搜索" onClick={() => onChange('')}><X size={14} /></Button>}</div>
}

export function OrganizationStatus({ value, counts, onChange }: { value: EmploymentStatus; counts: Record<EmploymentStatus, number>; onChange: (status: EmploymentStatus) => void }) {
  return <div className="org-status-tabs" role="group" aria-label="任职状态">{organizationStatuses.map((status) => <Button key={status.id} variant="ghost" aria-pressed={value === status.id} className={cn('org-status-tab', value === status.id && 'is-active')} onClick={() => onChange(status.id)}>{status.label}<span>{counts[status.id]}</span></Button>)}</div>
}

export function OrganizationSelector({ organizations, value, onChange }: { organizations: readonly Organization[]; value: string; onChange: (id: string) => void }) {
  const selected = organizations.find((organization) => organization.id === value)
  return <DropdownMenu><DropdownMenuTrigger variant="outline" className="org-root-trigger" aria-label={`切换根组织：${selected?.name}`}><Building2 size={15} /><span>{selected?.name}</span><ChevronDown size={14} /></DropdownMenuTrigger><DropdownMenuContent className="org-root-menu"><DropdownMenuLabel>选择组织</DropdownMenuLabel>{organizations.map((organization) => <DropdownMenuItem key={organization.id} className="org-root-option" onSelect={() => onChange(organization.id)}><span style={{ paddingLeft: (organizationPath(organizations, organization.id).length - 1) * 12 }}>{organization.name}</span>{value === organization.id && <Check size={14} />}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
}

export function OrganizationTree({ organizations, counts, selectedId, onSelect }: { organizations: readonly Organization[]; counts: ReadonlyMap<string, number>; selectedId: string; onSelect: (id: string) => void }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const visible = useMemo(() => {
    if (!query.trim()) return null
    const ids = new Set<string>()
    organizations.filter((organization) => organization.name.includes(query.trim()) || organization.code.toLowerCase().includes(query.trim().toLowerCase())).forEach((organization) => organizationPath(organizations, organization.id).forEach((ancestor) => ids.add(ancestor.id)))
    return ids
  }, [organizations, query])
  const toggle = (id: string) => setCollapsed((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
  const render = (organization: Organization) => {
    if (visible && !visible.has(organization.id)) return null
    const children = organizations.filter((child) => child.parentId === organization.id)
    const expanded = Boolean(query.trim()) || !collapsed.has(organization.id)
    return <li key={organization.id}>
      <div className={cn('org-tree-row', selectedId === organization.id && 'is-selected')}>
        {children.length ? <Button variant="icon" className="org-tree-toggle" aria-expanded={expanded} aria-label={`${expanded ? '收起' : '展开'}${organization.name}`} onClick={() => toggle(organization.id)} disabled={Boolean(query.trim())}>{expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</Button> : <span className="org-tree-toggle-spacer" />}
        <Button variant="ghost" className="org-tree-select" aria-pressed={selectedId === organization.id} onClick={() => onSelect(organization.id)}><span className="org-tree-dot" data-tone={organization.tone} /><span>{organization.name}</span><small>{counts.get(organization.id) ?? 0}</small></Button>
      </div>
      {children.length > 0 && expanded && <ul>{children.map(render)}</ul>}
    </li>
  }
  return <aside className="org-tree-sidebar" id="organization-tree">
    <div className="org-section-heading"><h2><Network size={16} />组织架构</h2><div className="org-icon-actions"><Button variant="icon" title="展开全部组织" aria-label="展开全部组织" onClick={() => setCollapsed(new Set())}><ChevronsUpDown size={14} /></Button><Button variant="icon" title="收起全部组织" aria-label="收起全部组织" onClick={() => setCollapsed(new Set(organizations.filter((organization) => organization.parentId).map((organization) => organization.id)))}><ChevronsDownUp size={14} /></Button></div></div>
    <div className="org-tree-search"><Search size={14} /><Input aria-label="搜索组织" placeholder="搜索组织" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <Button variant="icon" aria-label="清除组织搜索" title="清除组织搜索" onClick={() => setQuery('')}><X size={13} /></Button>}</div>
    <nav aria-label="组织层级" className="org-tree-navigation"><ul>{organizations.filter((organization) => !organization.parentId).map(render)}</ul>{visible?.size === 0 && <p className="org-small-empty">没有匹配的组织</p>}</nav>
    <div className="org-tree-footer"><span><span data-tone="blue" />鲜花</span><span><span data-tone="mint" />水果</span><span><span data-tone="peach" />职能</span></div>
  </aside>
}

export function PersonnelTable({ people, onPerson }: { people: readonly OrganizationPerson[]; onPerson: (person: OrganizationPerson) => void }) {
  const [page, setPage] = useState(1)
  const [reverse, setReverse] = useState(false)
  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(people.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const sorted = [...people].sort((left, right) => (left.employeeNumber ?? '').localeCompare(right.employeeNumber ?? '') * (reverse ? -1 : 1))
  return <div className="org-roster" id="organization-roster">
    <Table containerClassName="org-table-scroll" containerProps={{ tabIndex: 0, role: 'region', 'aria-label': '人员表格，可横向滚动' }} aria-label="组织人员名册">
      <TableHeader><TableRow><TableHead aria-sort={reverse ? 'descending' : 'ascending'}><Button variant="ghost" className="org-table-sort" onClick={() => { setReverse(!reverse); setPage(1) }}>姓名 / 工号<ArrowDownUp size={12} /></Button></TableHead><TableHead>所属组织</TableHead><TableHead>岗位 / 职级</TableHead><TableHead>入职日期</TableHead><TableHead>状态</TableHead><TableHead><span className="sr-only">操作</span></TableHead></TableRow></TableHeader>
      <TableBody>{sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((person) => <TableRow key={person.personId}>
        <TableCell><Button variant="ghost" className="org-person-link" aria-label={`查看${person.displayName}`} onClick={() => onPerson(person)}><PersonAvatar person={person} /><span><strong>{person.displayName}</strong><small>{person.employeeNumber}</small></span></Button></TableCell>
        <TableCell>{person.organizationName}</TableCell><TableCell><span className="org-position">{person.position}</span><span className="org-level">{person.level}</span></TableCell><TableCell className="org-date">{person.joinedAt}</TableCell><TableCell><Badge className={`org-employment org-employment-${person.status}`}>{organizationStatuses.find((status) => status.id === person.status)?.shortLabel}</Badge></TableCell><TableCell><Button variant="icon" title={`${person.displayName}的人员详情`} aria-label={`${person.displayName}的人员详情`} onClick={() => onPerson(person)}><ChevronRight size={15} /></Button></TableCell>
      </TableRow>)}{!people.length && <TableRow><TableCell colSpan={6}><div className="org-empty"><Users size={26} /><strong>没有匹配的人员</strong><span>当前组织与筛选条件下为 0 人</span></div></TableCell></TableRow>}</TableBody>
    </Table>
    <div className="org-table-footer"><span aria-live="polite">共 {people.length} 人</span><div><span>{currentPage} / {totalPages}</span><Button variant="icon" aria-label="上一页人员" title="上一页" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={15} /></Button><Button variant="icon" aria-label="下一页人员" title="下一页" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}><ChevronRight size={15} /></Button></div></div>
  </div>
}

export function MemberList({ people, onPerson, emptyLabel = '暂无匹配人员' }: { people: readonly OrganizationPerson[]; onPerson: (person: OrganizationPerson) => void; emptyLabel?: string }) {
  return <div className="org-member-list">{people.map((person) => <Button key={person.personId} variant="ghost" className="org-member-row" aria-label={`查看${person.displayName}`} onClick={() => onPerson(person)}><PersonAvatar person={person} /><span><strong>{person.displayName}</strong><small>{person.position} · {person.employeeNumber}</small></span><ChevronRight size={13} /></Button>)}{!people.length && <div className="org-small-empty">{emptyLabel}</div>}</div>
}

export function PersonDetail({ person, organizations, people, onClose }: { person: OrganizationPerson | null; organizations: readonly Organization[]; people: readonly OrganizationPerson[]; onClose: () => void }) {
  const titleId = useId()
  if (!person) return null
  const path = organizationPath(organizations, person.organizationId)
  const organization = path.at(-1)!
  const managerId = organization.managerId === person.personId ? path.at(-2)?.managerId : organization.managerId
  const manager = people.find((candidate) => candidate.personId === managerId)
  return <Dialog open onOpenChange={(open) => { if (!open) onClose() }} labelledBy={titleId} className="org-person-dialog">
    <div className="org-dialog-top"><span>人员详情</span><Button variant="icon" aria-label="关闭人员详情" title="关闭" onClick={onClose}><X size={18} /></Button></div>
    <div className="org-profile-identity"><PersonAvatar person={person} large /><div><h2 id={titleId}>{person.displayName}</h2><p>{person.position} <span>·</span> {person.employeeNumber}</p><Badge className={`org-employment org-employment-${person.status}`}>{organizationStatuses.find((status) => status.id === person.status)?.shortLabel}</Badge></div></div>
    <dl className="org-profile-fields"><div><dt>所属组织</dt><dd>{person.organizationName}</dd></div><div><dt>岗位职级</dt><dd>{person.position} · {person.level}</dd></div><div><dt>{person.status === 'pending' ? '预计入职' : '入职日期'}</dt><dd>{person.joinedAt}</dd></div><div><dt>办公地点</dt><dd>{person.office}</dd></div><div><dt>姓名拼音</dt><dd>{person.namePinyin}</dd></div><div><dt>直属负责人</dt><dd>{manager?.displayName ?? '无上级负责人'}</dd></div></dl>
    <div className="org-profile-path"><span>组织归属</span><ol>{path.map((item) => <li key={item.id}><Building2 size={13} />{item.name}</li>)}</ol></div>
    <div className="org-dialog-footer"><Badge className="org-demo-badge">虚构示例</Badge><Button variant="outline" className="org-action" onClick={onClose}>关闭</Button></div>
  </Dialog>
}
