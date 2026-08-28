import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowUpRight, Check, ChevronDown, ChevronRight, Clock3, Diamond, Info, Layers3, LockKeyhole, RotateCw, Search, Upload, UserPlus, Users } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle } from '../components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { descendantIds, organizationCounts, organizationMembers, organizationPath } from '../components/organization/organization-model'
import { personnelOverview, personnelPagination } from '../components/organization/personnel-management-model'
import { demoOrganizations, organizationStatuses, type EmploymentStatus, type Organization } from '../data/demo-organization'
import { personnelDemoMonth, personnelRecords } from '../data/demo-personnel'
import { organizationVariants } from '../data/template-catalog'
import { cn } from '../lib/utils'
import '../personnel-management.css'

const statusTones = { active: 'green', pending: 'warn', departed: 'red' }
const fieldTones = { 已开通: 'green', 未开通: 'gray', 已归档: 'green', 待补充: 'warn', 已提交: 'blue', 不适用: 'gray' }

function Highlight({ name, query }: { name: string; query: string }) {
  const index = name.toLowerCase().indexOf(query.toLowerCase())
  if (!query || index < 0) return <>{name}</>
  return <>{name.slice(0, index)}<mark>{name.slice(index, index + query.length)}</mark>{name.slice(index + query.length)}</>
}

function PersonnelOrganizationTree({ selectedId, counts, onSelect }: {
  selectedId: string | null
  counts: ReadonlyMap<string, number>
  onSelect: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(new Set(['company', 'flower', 'flower-operations']))
  const navigationRef = useRef<HTMLElement>(null)
  const search = query.trim()
  const visible = useMemo(() => {
    if (!search) return null
    const ids = new Set<string>()
    demoOrganizations.filter((organization) => organization.name.toLowerCase().includes(search.toLowerCase()))
      .forEach((organization) => organizationPath(demoOrganizations, organization.id).forEach((ancestor) => ids.add(ancestor.id)))
    return ids
  }, [search])

  const toggle = (id: string, open: boolean) => setExpanded((current) => {
    const next = new Set(current)
    if (open) next.add(id)
    else next.delete(id)
    return next
  })
  const select = (id: string) => { toggle(id, true); onSelect(id) }
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, organization: Organization, hasChildren: boolean) => {
    if (event.key === 'ArrowRight' && hasChildren) { event.preventDefault(); toggle(organization.id, true) }
    else if (event.key === 'ArrowLeft' && hasChildren && !search) { event.preventDefault(); toggle(organization.id, false) }
    else if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      const buttons = Array.from(navigationRef.current?.querySelectorAll<HTMLButtonElement>('.personnel-tree-select') ?? [])
      const index = buttons.indexOf(event.currentTarget)
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : index + (event.key === 'ArrowDown' ? 1 : -1)
      buttons[next]?.focus()
    }
  }
  const render = (organization: Organization) => {
    if (visible && !visible.has(organization.id)) return null
    const children = demoOrganizations.filter((child) => child.parentId === organization.id)
    const open = Boolean(search) || expanded.has(organization.id)
    const count = counts.get(organization.id) ?? 0
    return <li key={organization.id}>
      <div className={cn('personnel-tree-row', selectedId === organization.id && 'is-selected')}>
        {children.length > 0 ? <Button variant="icon" className="personnel-tree-caret" aria-label={`${open ? '收起' : '展开'}${organization.name}`} aria-expanded={open} disabled={Boolean(search)} onClick={() => toggle(organization.id, !open)}><ChevronRight size={12} className={open ? 'is-open' : undefined} /></Button> : <span className="personnel-tree-spacer" />}
        <Button variant="ghost" className="personnel-tree-select" aria-label={`选择${organization.name}`} aria-pressed={selectedId === organization.id} onClick={() => select(organization.id)} onKeyDown={(event) => navigate(event, organization, children.length > 0)}><span><Highlight name={organization.name} query={search} /></span><span className={cn('personnel-tree-count', !count && 'is-zero')}>{count}</span></Button>
      </div>
      {children.length > 0 && open && <ul className="personnel-tree-children">{children.map(render)}</ul>}
    </li>
  }

  return <>
    <label className="personnel-field personnel-tree-search"><Search size={15} aria-hidden /><Input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索组织名称" aria-label="搜索组织名称" /></label>
    <nav ref={navigationRef} className="personnel-tree" aria-label="组织树"><ul>{demoOrganizations.filter((organization) => !organization.parentId).map(render)}</ul>{visible?.size === 0 && <p className="personnel-tree-empty" role="status">没有匹配的组织</p>}</nav>
  </>
}

export function PersonnelManagementPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [status, setStatus] = useState<EmploymentStatus>('active')
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [panelOpen, setPanelOpen] = useState(() => window.location.hash === '#personnel-organization')
  const [notice, setNotice] = useState<{ text: string; sequence: number } | null>(null)
  const counts = useMemo(() => organizationCounts(demoOrganizations, personnelRecords, status), [status])
  const scopedPeople = useMemo(() => {
    if (!selectedId) return personnelRecords
    const ids = descendantIds(demoOrganizations, selectedId)
    return personnelRecords.filter((person) => ids.has(person.organizationId))
  }, [selectedId])
  const overview = personnelOverview(scopedPeople, personnelDemoMonth)
  const members = useMemo(() => {
    // 共用现有组织与人员检索口径，同时保留本页自己的展示字段。
    const matches = new Set(organizationMembers(demoOrganizations, personnelRecords, selectedId ?? 'company', status, query).map((person) => person.personId))
    return personnelRecords.filter((person) => matches.has(person.personId))
  }, [selectedId, status, query])
  const pagination = personnelPagination(members, page, size)
  const path = selectedId ? organizationPath(demoOrganizations, selectedId) : []
  const scopeName = path.at(-1)?.name ?? '全部组织'
  const statusLabel = organizationStatuses.find((item) => item.id === status)!.shortLabel
  const showNotice = (text: string) => setNotice((current) => ({ text, sequence: (current?.sequence ?? 0) + 1 }))
  const demonstrate = (action: string) => showNotice(`原型演示：${action}。未接入业务服务，不会修改人员或账号。`)

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const selectOrganization = (id: string | null) => { setSelectedId(id); setPage(1) }
  const search = () => { setQuery(draftQuery); setPage(1) }
  const clearSearch = () => { setDraftQuery(''); setQuery(''); setPage(1) }
  const stats = [
    { label: '在职人数', value: overview.active, description: scopeName, tone: 'blue', icon: Users },
    { label: '待入职', value: overview.pending, description: '流程进行中', tone: 'warn', icon: Clock3 },
    { label: '本月入职', value: overview.joinedThisMonth, description: `${personnelDemoMonth} · 示例月份`, tone: 'green', icon: Check },
    { label: '未开通账号', value: overview.withoutAccount, description: '需处理', tone: 'gray', icon: LockKeyhole },
  ]

  return <div className="personnel-page">
    <header className="personnel-topbar" aria-label="人员管理导航栏">
      <a className="personnel-brand" href="/" aria-label="尚毅中台首页"><span className="personnel-brand-mark" aria-hidden><Diamond size={16} /></span><strong>尚毅</strong><span className="personnel-brand-divider" /><span className="personnel-brand-subtitle">人员与组织中台</span></a>
      <div className="personnel-topbar-right"><Button href="/?panel=search" variant="ghost" className="personnel-global-search"><Search size={15} /><span>搜索系统或能力</span></Button><div className="personnel-user"><span className="personnel-avatar">系</span><span><b>演示管理员</b><small>本地示例</small></span></div></div>
    </header>

    <main className="personnel-main">
      <div className="personnel-context">
        <nav className="personnel-breadcrumb" aria-label="面包屑"><a href="/">中台入口</a><span>/</span><a href="/guide#organization-variants">人员与组织</a><span>/</span><b>经典结构</b></nav>
        <nav className="personnel-versions" aria-label="组织人员版本切换">{organizationVariants.map((item) => <Button key={item.id} href={item.href} variant="ghost" aria-current={item.variant === 'personnel' ? 'page' : undefined}><span>{item.version}</span>{item.label}</Button>)}</nav>
      </div>
      <div className="personnel-page-heading"><div><h1>经典结构</h1><p>沿组织树查看各组织人数，以及组织下全部人员。<Badge className="personnel-demo-badge">示例数据</Badge></p></div><div className="personnel-head-actions"><Button variant="outline" onClick={() => demonstrate('录入 / 导入在职人员')}><Upload size={16} />录入 / 导入在职人员</Button><Button onClick={() => demonstrate('创建入职安排')}><UserPlus size={16} />创建入职安排</Button></div></div>

      <section className="personnel-stats" id="personnel-overview" aria-label="人员概览">{stats.map(({ label, value, description, tone, icon: Icon }) => <Card key={label} className="personnel-stat"><span className={`personnel-stat-icon personnel-tone-${tone}`} aria-hidden><Icon size={20} /></span><div><p>{label}<span> · {description}</span></p><strong>{value}<small>人</small></strong></div></Card>)}</section>

      <div className="personnel-layout">
        <Card className="personnel-organization-card" id="personnel-organization" role="region" aria-label="组织与人数">
          <Button variant="ghost" className="personnel-panel-toggle" aria-expanded={panelOpen} aria-controls="personnel-organization-panel" onClick={() => setPanelOpen(!panelOpen)}><ChevronRight size={14} className={panelOpen ? 'is-open' : undefined} /><span>组织与人数 · {scopeName}</span><Badge className="personnel-panel-status">{statusLabel}</Badge></Button>
          <div id="personnel-organization-panel" className={cn('personnel-organization-panel', panelOpen && 'is-open')}>
            <CardHeader className="personnel-card-heading"><div><CardTitle>组织与人数</CardTitle><p>数字为含全部下级的{statusLabel}人数</p></div><Button variant="outline" className="personnel-small" onClick={() => selectOrganization(null)} aria-label="查看全部组织"><Layers3 size={14} />全部</Button></CardHeader>
            <div className="personnel-status-tabs" role="group" aria-label="任职状态">{organizationStatuses.map((item) => <Button key={item.id} variant="ghost" aria-pressed={status === item.id} onClick={() => { setStatus(item.id); setPage(1) }}>{item.label}</Button>)}</div>
            <PersonnelOrganizationTree selectedId={selectedId} counts={counts} onSelect={selectOrganization} />
          </div>
        </Card>

        <Card className="personnel-roster-card" id="personnel-roster" role="region" aria-label="人员列表">
          <div className="personnel-list-heading"><div className="personnel-list-context"><div className="personnel-path" aria-label="当前组织路径">{path.length ? path.map((organization, index) => <Fragment key={organization.id}>{index > 0 && <ChevronRight size={13} aria-hidden />}<span className={index < path.length - 1 ? 'is-ancestor' : undefined}>{organization.name}</span></Fragment>) : <span>全部组织</span>}<Badge className={`personnel-chip personnel-tone-${statusTones[status]}`}><span className="personnel-status-dot" />{statusLabel}</Badge></div><p aria-live="polite">共 {members.length} 人 · 选择组织时包含其全部下级</p></div>
            <div className="personnel-toolbar"><label className="personnel-field"><Search size={15} aria-hidden /><Input type="search" placeholder="搜索姓名或员工编号" aria-label="搜索姓名或员工编号" value={draftQuery} onChange={(event) => { setDraftQuery(event.target.value); if (!event.target.value) { setQuery(''); setPage(1) } }} onKeyDown={(event) => { if (event.key === 'Enter') search() }} /></label><Button className="personnel-small" onClick={search}>搜索</Button><Button variant="icon" className="personnel-refresh" title="刷新本地示例" aria-label="刷新" onClick={() => { clearSearch(); showNotice('已刷新本地示例，保留当前组织与任职状态。') }}><RotateCw size={16} /></Button></div>
          </div>

          {pagination.items.length ? <Table containerClassName="personnel-table-scroll" containerProps={{ tabIndex: 0, role: 'region', 'aria-label': '人员表格，可横向滚动' }} aria-label="人员管理表格">
            <TableHeader><TableRow><TableHead>姓名</TableHead><TableHead>员工编号</TableHead><TableHead>组织</TableHead><TableHead>岗位</TableHead><TableHead>职级</TableHead><TableHead>{status === 'pending' ? '预计入职日期' : '入职日期'}</TableHead><TableHead>登录账号</TableHead><TableHead>入职资料</TableHead><TableHead>操作</TableHead></TableRow></TableHeader>
            <TableBody>{pagination.items.map((person) => <TableRow key={person.personId}>
              <TableCell><span className="personnel-cell-name"><span className="personnel-avatar" aria-hidden>{person.displayName.slice(0, 1)}</span><b>{person.displayName}</b></span></TableCell><TableCell><span className="personnel-code">{person.employeeNumber}</span></TableCell><TableCell>{person.organizationName}</TableCell><TableCell>{person.position}</TableCell><TableCell>{person.level}</TableCell><TableCell className="personnel-date">{person.joinedAt}</TableCell><TableCell><Badge className={`personnel-chip personnel-tone-${fieldTones[person.accountStatus]}`}>{person.accountStatus}</Badge></TableCell><TableCell><Badge className={`personnel-chip personnel-tone-${fieldTones[person.documentStatus]}`}>{person.documentStatus}</Badge></TableCell>
              <TableCell><div className="personnel-row-actions"><Button variant="ghost" aria-label={`${person.displayName}的岗位履历`} onClick={() => demonstrate(`岗位履历 · ${person.displayName}`)}>岗位履历</Button>{person.accountStatus === '未开通' && <Button variant="ghost" aria-label={`为${person.displayName}开通账号`} onClick={() => demonstrate(`开通账号 · ${person.displayName}`)}>开通账号</Button>}{person.status === 'active' && <Button variant="ghost" className="personnel-danger" aria-label={`为${person.displayName}办理离职`} onClick={() => demonstrate(`办理离职 · ${person.displayName}`)}>办理离职</Button>}</div></TableCell>
            </TableRow>)}</TableBody>
          </Table> : <div className="personnel-empty" role="status"><span><Users size={24} /></span><p>该组织下暂无符合条件的人员</p><Button variant="ghost" onClick={() => { clearSearch(); selectOrganization(null) }}>清除筛选</Button></div>}

          <div className="personnel-pager"><p aria-live="polite">共 <b>{members.length}</b> 条 · 第 {pagination.page} / {pagination.pages} 页</p><nav className="personnel-pagination" aria-label="人员分页"><DropdownMenu><DropdownMenuTrigger variant="outline" className="personnel-page-size" aria-label={`每页条数：${size} 条`}>{size} 条/页<ChevronDown size={13} /></DropdownMenuTrigger><DropdownMenuContent className="personnel-size-menu"><DropdownMenuLabel>每页条数</DropdownMenuLabel>{[10, 20, 50].map((value) => <DropdownMenuItem key={value} onSelect={() => { setSize(value); setPage(1) }}><span>{value} 条/页</span>{size === value && <Check size={14} />}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu><Button variant="outline" disabled={pagination.page === 1} onClick={() => setPage(pagination.page - 1)}>上一页</Button>{pagination.buttons.map((value, index) => value === '…' ? <span className="personnel-page-gap" key={`gap-${index}`}>…</span> : <Button key={value} variant={pagination.page === value ? 'primary' : 'outline'} aria-label={`第 ${value} 页`} aria-current={pagination.page === value ? 'page' : undefined} onClick={() => setPage(value)}>{value}</Button>)}<Button variant="outline" disabled={pagination.page === pagination.pages} onClick={() => setPage(pagination.page + 1)}>下一页</Button></nav></div>
        </Card>
      </div>
      <footer className="personnel-footer"><span>仅为 UI 参考 · 虚构人员 · 操作不写入业务系统</span><Button href="/guide#organization-variants" variant="ghost">版本说明<ArrowUpRight size={13} /></Button></footer>
    </main>
    <div className="personnel-notice-region" role="status" aria-live="polite" aria-atomic="true">{notice && <div className="personnel-notice"><Info size={17} /><span>{notice.text}</span></div>}</div>
  </div>
}
