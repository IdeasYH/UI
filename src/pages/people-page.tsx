import { useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronsRight, LockKeyhole, RotateCcw, Search, Store, UserRound, Users, X } from 'lucide-react'
import { PersonPicker } from '../components/person-picker'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { demoPeople, demoStores, initialAssignments } from '../data/demo-people'
import { cn } from '../lib/utils'

type AssignmentFilter = 'all' | 'waiting' | 'assigned'

export function PeoplePage() {
  const [owner, setOwner] = useState('demo-person-001')
  const [historicalOwner, setHistoricalOwner] = useState('demo-former-person')
  const [assignments, setAssignments] = useState(initialAssignments)
  const [filter, setFilter] = useState<AssignmentFilter>('all')
  const [query, setQuery] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const selectedOwner = demoPeople.find((person) => person.personId === owner)
  const assignedCount = demoStores.filter((store) => Boolean(assignments[store.id])).length
  const filteredStores = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return demoStores.filter((store) => {
      const assigned = Boolean(assignments[store.id])
      if (filter === 'waiting' && assigned) return false
      if (filter === 'assigned' && !assigned) return false
      return `${store.name} ${store.city} ${store.province} ${store.id}`.toLowerCase().includes(keyword)
    })
  }, [assignments, filter, query])

  const resetExamples = () => {
    setOwner('demo-person-001')
    setHistoricalOwner('demo-former-person')
    setAssignments(initialAssignments())
    setFilter('all')
    setQuery('')
    setAnnouncement('已还原示例数据')
  }

  return <div className="people-page">
    <header className="site-header" aria-label="人员分配导航栏">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="尚毅中台首页">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-name">尚毅</span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-subtitle">中台入口</span>
        </a>
        <nav className="template-nav" aria-label="模板导航">
          <Button href="/" variant="nav">门户首页</Button>
          <Button variant="nav" className="template-nav-current" aria-current="page"><Users size={15} />人员选择</Button>
        </nav>
        <span className="template-data-badge">示例数据</span>
      </div>
    </header>

    <main className="people-main">
      <div className="people-breadcrumb"><span>工作台</span><ChevronsRight size={13} /><span>人员分配</span></div>
      <div className="people-page-heading">
        <div><h1>人员分配</h1><p>运营团队 <span>·</span> 当前在职 {demoPeople.length} 人</p></div>
        <Button variant="icon" aria-label="还原示例数据" title="还原示例数据" onClick={resetExamples}><RotateCcw size={17} /></Button>
      </div>

      <section id="people-owners" className="people-owner-section" aria-labelledby="owner-section-title">
        <h2 id="owner-section-title"><UserRound size={16} />负责人</h2>
        <div className="people-field-grid">
          <div className="people-field">
            <label htmlFor="default-owner">运营负责人</label>
            <PersonPicker id="default-owner" assignees={demoPeople} value={owner} shopLabel="默认负责人" onValueChange={setOwner} />
            <span className="people-field-meta" aria-live="polite">{selectedOwner ? `${selectedOwner.employeeNumber} · ${selectedOwner.organizationName}` : '尚未选择'}</span>
          </div>
          <div className="people-field">
            <label htmlFor="readonly-owner">只读负责人 <LockKeyhole size={12} /></label>
            <PersonPicker id="readonly-owner" assignees={demoPeople} value="demo-person-002" shopLabel="只读负责人" disabled onValueChange={() => undefined} />
            <span className="people-field-meta">DEMO002 · 运营二组</span>
          </div>
          <div className="people-field">
            <label htmlFor="historical-owner">历史负责人</label>
            <PersonPicker id="historical-owner" assignees={demoPeople} value={historicalOwner} shopLabel="历史负责人" unavailableValueLabel="原负责人（已离职）" onValueChange={setHistoricalOwner} />
            <span className="people-field-meta">{historicalOwner === 'demo-former-person' ? '已不在当前名册' : demoPeople.find((person) => person.personId === historicalOwner)?.employeeNumber || '尚未选择'}</span>
          </div>
        </div>
      </section>

      <section id="people-assignments" className="people-assignments" aria-labelledby="assignment-title">
        <div className="people-section-heading"><h2 id="assignment-title">门店分配</h2><span>{demoStores.length} 家门店</span></div>
        <div id="people-filters" className="people-toolbar">
          <div role="tablist" aria-label="分配状态" className="people-tabs">
            {([
              ['all', '全部', demoStores.length],
              ['waiting', '待分配', demoStores.length - assignedCount],
              ['assigned', '已分配', assignedCount],
            ] as const).map(([value, label, count]) => <Button
              key={value}
              role="tab"
              aria-selected={filter === value}
              aria-controls="store-assignment-panel"
              id={`assignment-tab-${value}`}
              variant="ghost"
              className={cn('people-tab', filter === value && 'people-tab-active')}
              onClick={() => setFilter(value)}
            >{label}<span>{count}</span></Button>)}
          </div>
          <div className="people-store-search">
            <Search size={15} aria-hidden />
            <Input aria-label="搜索门店" placeholder="搜索门店、城市" value={query} onChange={(event) => setQuery(event.target.value)} />
            {query && <Button variant="icon" aria-label="清除门店搜索" title="清除门店搜索" onClick={() => setQuery('')}><X size={14} /></Button>}
          </div>
        </div>

        <div id="store-assignment-panel" role="tabpanel" aria-labelledby={`assignment-tab-${filter}`}>
          <Table containerClassName="people-table-scroll" containerProps={{ tabIndex: 0, role: 'region', 'aria-label': '门店分配表，可横向滚动' }} aria-label="门店分配">
            <TableHeader><TableRow>
              <TableHead>店铺名称</TableHead><TableHead>签约时间</TableHead><TableHead>合作状态</TableHead>
              <TableHead>省份 / 城市</TableHead><TableHead>分配运营</TableHead><TableHead className="people-assignment-column">人员选择</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredStores.map((store) => {
                const person = demoPeople.find((candidate) => candidate.personId === assignments[store.id])
                return <TableRow key={store.id}>
                  <TableCell><div className="people-store-cell"><span className="people-store-icon"><Store size={14} /></span><span><strong>{store.name}</strong><small>{store.id}</small></span></div></TableCell>
                  <TableCell><span className="people-date">{store.signedAt}</span></TableCell>
                  <TableCell><span className="people-state"><Check size={11} />已签约</span></TableCell>
                  <TableCell><span className="people-province">{store.province}</span><span className="people-city">{store.city}</span></TableCell>
                  <TableCell>{person ? <div className="people-assigned-person"><span className="people-person-icon"><UserRound size={13} /></span><span><strong>{person.displayName}</strong><small>{person.employeeNumber}</small></span></div> : <span className="people-unassigned">尚未分配</span>}</TableCell>
                  <TableCell className="people-assignment-column"><PersonPicker
                    assignees={demoPeople}
                    value={assignments[store.id]}
                    shopLabel={store.name}
                    compact
                    disabled={store.readOnly}
                    onValueChange={(personId) => {
                      setAssignments((current) => ({ ...current, [store.id]: personId }))
                      const name = demoPeople.find((candidate) => candidate.personId === personId)?.displayName
                      setAnnouncement(name ? `${store.name}已选择${name}` : `${store.name}已清除选择`)
                    }}
                  /></TableCell>
                </TableRow>
              })}
              {!filteredStores.length && <TableRow><TableCell colSpan={6} className="people-empty-table">没有匹配的门店</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <div className="people-table-footer"><span>共 {filteredStores.length} 家门店</span><span>{assignedCount} 家已分配 <span>·</span> {demoStores.length - assignedCount} 家待分配</span></div>
      </section>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      <div className="people-bottom-nav"><Button variant="ghost" href="/"><ArrowLeft size={14} />返回门户首页</Button></div>
    </main>
  </div>
}
