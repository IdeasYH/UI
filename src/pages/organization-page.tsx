import { useMemo, useState } from 'react'
import { ArrowUpRight, Building2, ChevronRight, GitBranch, LayoutList, Network, RotateCcw, Users } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { OrganizationChart } from '../components/organization/organization-chart'
import { MemberList, OrganizationSearch, OrganizationSelector, OrganizationStatus, OrganizationTree, PersonAvatar, PersonDetail, PersonnelTable } from '../components/organization/organization-controls'
import { descendantIds, organizationCounts, organizationMembers, organizationPath } from '../components/organization/organization-model'
import { demoOrganizations, organizationPeople, type EmploymentStatus, type OrganizationPerson } from '../data/demo-organization'
import { organizationVariants } from '../data/template-catalog'
import { cn } from '../lib/utils'

type OrganizationVariant = 'tree' | 'canvas' | 'horizontal'
const variantIcons = { tree: LayoutList, canvas: Network, horizontal: GitBranch, personnel: Users, figma: Network }

function OrganizationPage({ variant }: { variant: OrganizationVariant }) {
  const [rootId, setRootId] = useState('flower')
  const [selectedId, setSelectedId] = useState('flower')
  const [status, setStatus] = useState<EmploymentStatus>('active')
  const [query, setQuery] = useState('')
  const [includeDescendants, setIncludeDescendants] = useState(true)
  const [person, setPerson] = useState<OrganizationPerson | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const selected = demoOrganizations.find((organization) => organization.id === selectedId)!
  const root = demoOrganizations.find((organization) => organization.id === rootId)!
  const manager = organizationPeople.find((candidate) => candidate.personId === selected.managerId)!
  const path = organizationPath(demoOrganizations, selectedId)
  const counts = useMemo(() => organizationCounts(demoOrganizations, organizationPeople, status), [status])
  const members = useMemo(() => organizationMembers(demoOrganizations, organizationPeople, selectedId, status, query, includeDescendants), [selectedId, status, query, includeDescendants])
  const scopeCounts = useMemo(() => ({
    active: organizationMembers(demoOrganizations, organizationPeople, selectedId, 'active', '', includeDescendants).length,
    pending: organizationMembers(demoOrganizations, organizationPeople, selectedId, 'pending', '', includeDescendants).length,
    departed: organizationMembers(demoOrganizations, organizationPeople, selectedId, 'departed', '', includeDescendants).length,
  }), [selectedId, includeDescendants])
  const directCount = organizationMembers(demoOrganizations, organizationPeople, selectedId, status, '', false).length
  const childCount = demoOrganizations.filter((organization) => organization.parentId === selectedId).length

  const selectOrganization = (id: string) => {
    if (!descendantIds(demoOrganizations, rootId).has(id)) setRootId(id)
    setSelectedId(id)
    setQuery('')
  }
  const changeRoot = (id: string) => { setRootId(id); setSelectedId(id); setQuery('') }
  const reset = () => {
    setRootId('flower'); setSelectedId('flower'); setStatus('active'); setQuery(''); setIncludeDescendants(true); setPerson(null); setResetKey((key) => key + 1)
  }
  const descendantToggle = <label className="org-descendants"><input type="checkbox" checked={includeDescendants} onChange={(event) => setIncludeDescendants(event.target.checked)} />包含下级组织</label>
  const filters = <div className="org-roster-filters"><OrganizationStatus value={status} counts={scopeCounts} onChange={setStatus} /><OrganizationSearch value={query} onChange={setQuery} /></div>
  const breadcrumbs = <nav className="org-breadcrumbs" aria-label="当前组织路径">{path.map((organization, index) => <span key={organization.id}>{index > 0 && <ChevronRight size={11} />}<Button variant="ghost" onClick={() => selectOrganization(organization.id)} aria-current={organization.id === selectedId ? 'location' : undefined}>{organization.name}</Button></span>)}</nav>

  return <div className={cn('org-page', `org-page-${variant}`)}>
    <header className="org-business-header" aria-label="组织人员导航栏"><div className="org-business-header-inner">
      <a className="brand" href="/" aria-label="尚毅中台首页"><span className="brand-mark" aria-hidden><span /><span /><span /></span><span className="brand-name">尚毅</span><span className="brand-divider" aria-hidden /><span className="brand-subtitle">中台入口</span></a>
      <span className="org-business-context"><Users size={15} />人员中台</span><div className="org-business-right"><Badge className="org-demo-badge">示例数据</Badge><span className="org-account-avatar" aria-hidden>UI</span></div>
    </div></header>

    <main className="org-main">
      <div className="org-page-heading"><div className="org-page-title"><span className="org-page-title-icon"><Network size={24} /></span><div><h1>组织与人员</h1><p>{demoOrganizations.length} 个组织 <span>·</span> {organizationPeople.filter((candidate) => candidate.status === 'active').length} 名在职人员</p></div></div>
        <nav className="org-variant-tabs" aria-label="组织人员版本切换">{organizationVariants.map((item) => { const Icon = variantIcons[item.variant]; return <Button key={item.id} href={item.href} variant="ghost" className={cn('org-variant-tab', variant === item.variant && 'is-active')} aria-current={variant === item.variant ? 'page' : undefined}><span>{item.version}</span><Icon size={14} /><strong>{item.label}</strong></Button> })}</nav>
      </div>

      {variant === 'tree' && <div className="org-tree-workspace">
        <OrganizationTree key={resetKey} organizations={demoOrganizations} counts={counts} selectedId={selectedId} onSelect={selectOrganization} />
        <section className="org-tree-main" aria-label="当前组织与人员">
          <div className="org-department-heading"><div>{breadcrumbs}<h2>{selected.name}<Badge className="org-count-badge">{counts.get(selectedId)} 人</Badge></h2></div><span className="org-code">{selected.code}</span></div>
          <div className="org-tree-overview"><OrganizationChart key={selectedId} organizations={demoOrganizations} people={organizationPeople} rootId={selectedId} selectedId={selectedId} counts={counts} status={status} onSelect={selectOrganization} appearance="compact" direction="horizontal" maxDepth={1} showToolbar={false} /><div className="org-overview-summary"><span><strong>{directCount}</strong>直属人员</span><span><strong>{childCount}</strong>直属组织</span></div></div>
          <div className="org-roster-heading"><h3>人员名册</h3>{descendantToggle}</div>
          {filters}
          <PersonnelTable key={`${selectedId}-${status}-${query}-${includeDescendants}`} people={members} onPerson={setPerson} />
        </section>
      </div>}

      {variant === 'canvas' && <div className="org-canvas-workspace">
        <div className="org-workspace-toolbar"><div><h2><Network size={16} />组织关系</h2><span>{root.name} · {descendantIds(demoOrganizations, rootId).size} 个组织</span></div><OrganizationSelector organizations={demoOrganizations} value={rootId} onChange={changeRoot} /></div>
        <div className="org-canvas-layout"><section className="org-relation-surface" aria-label="组织关系画布"><div className="org-canvas-caption"><span><span className="org-line-key" />组织隶属关系</span><span><span className="org-line-key is-active" />当前组织路径</span></div><OrganizationChart key={`${rootId}-${resetKey}`} organizations={demoOrganizations} people={organizationPeople} rootId={rootId} selectedId={selectedId} counts={counts} status={status} onSelect={selectOrganization} /></section>
          <aside className="org-department-detail" id="organization-detail" aria-label="所选组织详情">
            <div className="org-detail-identity"><span className="org-detail-icon" data-tone={selected.tone}><Building2 size={23} /></span><Badge className="org-kind-badge">{selected.kind}</Badge><h2>{selected.name}</h2><span className="org-code">{selected.code}</span></div>
            <div className="org-detail-counts"><div><strong>{counts.get(selectedId)}</strong><span>组织人数</span></div><div><strong>{childCount}</strong><span>直属组织</span></div></div>
            <div className="org-manager-line"><span>组织负责人</span><Button variant="ghost" aria-label={`查看负责人${manager.displayName}`} onClick={() => setPerson(manager)}><PersonAvatar person={manager} /><strong>{manager.displayName}</strong><ArrowUpRight size={12} /></Button></div>
            <div className="org-detail-people-heading"><h3>组织人员</h3>{descendantToggle}</div>
            {filters}
            <div className="org-detail-member-scroll"><MemberList people={members} onPerson={setPerson} /></div>
            <div className="org-detail-footer" aria-live="polite">共 {members.length} 人</div>
          </aside>
        </div>
      </div>}

      {variant === 'horizontal' && <div className="org-horizontal-workspace">
        <div className="org-workspace-toolbar"><div><h2><GitBranch size={16} />组织层级</h2><span>{root.name} · {descendantIds(demoOrganizations, rootId).size} 个组织</span></div><OrganizationSelector organizations={demoOrganizations} value={rootId} onChange={changeRoot} /></div>
        <section className="org-horizontal-surface" aria-label="横向组织层级"><OrganizationChart key={`${rootId}-${resetKey}`} organizations={demoOrganizations} people={organizationPeople} rootId={rootId} selectedId={selectedId} counts={counts} status={status} onSelect={selectOrganization} direction="horizontal" appearance="ledger" /></section>
        <section className="org-ledger-roster" id="organization-roster" aria-label="所选组织人员名册"><div className="org-ledger-heading"><div>{breadcrumbs}<h2>{selected.name}<span>{members.length} 人</span></h2></div>{descendantToggle}</div>{filters}<MemberList people={members} onPerson={setPerson} /></section>
      </div>}

      <footer className="org-page-footer"><span>UIModel <span>·</span> HRM 组织结构参考</span><div><Button variant="ghost" href="/guide#organization-variants" className="org-footer-link">组件说明<ArrowUpRight size={12} /></Button><Button variant="icon" aria-label="还原组织示例" title="还原组织示例" onClick={reset}><RotateCcw size={14} /></Button></div></footer>
    </main>
    <PersonDetail person={person} organizations={demoOrganizations} people={organizationPeople} onClose={() => setPerson(null)} />
  </div>
}

export function OrganizationTreePage() { return <OrganizationPage variant="tree" /> }
export function OrganizationCanvasPage() { return <OrganizationPage variant="canvas" /> }
export function OrganizationHorizontalPage() { return <OrganizationPage variant="horizontal" /> }
