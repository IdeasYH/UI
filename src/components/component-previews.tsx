import { PersistentBannerExample, ToastStackExample, DrawerExample } from '../examples/feedback-controls-example'
import { CopyValueExample } from '../examples/copy-value-example'
import { CrosshairTableExample } from '../examples/crosshair-table-example'
import { ConditionFilterExample } from '../examples/condition-filter-example'
import { UiverseSocialTooltipExample } from '../examples/uiverse-social-tooltip-example'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpDown, Check, ChevronDown, LayoutTemplate, RotateCcw, Save, Search, Star, X } from 'lucide-react'
import { type CatalogComponent } from '../data/template-catalog'
import { reactBitsFavoriteIds } from '../data/react-bits-favorites'
import { uiverseNewFavoriteIds } from '../data/uiverse-new-favorites.ts'
import { demoPeople, demoStores } from '../data/demo-people'
import { PersonPicker } from './person-picker'
import { Button } from './ui/button'
import { ActionStateButton, ActionStateNotice, FormActionButton } from './ui/action-state-button'
import { Input } from './ui/input'
import { FocusLabelPreview, DateRangePreview, ColorPreview, UploadPreview, StatusPreview, StatisticsPreview } from './data-control-previews'
import { SwitchPreview, RatingPreview, SelectPreview, CascaderPreview, TreePreview } from './selection-previews'
import { ValidationPreview, TextareaPreview, RadioPreview, CheckboxPreview, PrerequisitePreview } from './form-control-previews'
import { SegmentedControlExample } from '../examples/segmented-control-example'
import { CollapsePanelExample } from '../examples/collapse-panel-example'
import { TimelineExample } from '../examples/timeline-example'
import { SwatchColorPickerExample } from '../examples/swatch-color-picker-example'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog } from './ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { FavoritePreview } from './favorite-preview'
import { UiverseMessageComposerExample } from '../examples/uiverse-message-composer-example'
import { UiverseExpandingBookmarkSaveExample } from '../examples/uiverse-expanding-bookmark-save-example'
import { UiverseExpandingLogoutExample } from '../examples/uiverse-expanding-logout-example'
import { UiverseFloatingGlowSwitchExample } from '../examples/uiverse-floating-glow-switch-example'
import { UiverseExpandingDeleteExample } from '../examples/uiverse-expanding-delete-example'

const FlexCarouselExample = lazy(() => import('../examples/flex-carousel-example').then(module => ({ default: module.FlexCarouselExample })))
const PeekRatingExample = lazy(() => import('../examples/peek-rating-example').then(module => ({ default: module.PeekRatingExample })))

function GalleryPreview() {
  const target = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const element = target.current
    if (!element || typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '250px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <div ref={target} style={{ minHeight: 560 }}>{visible && <Suspense fallback={<p role="status">正在加载画廊…</p>}><FlexCarouselExample /></Suspense>}</div>
}

function ButtonPreview() {
  const [saved, setSaved] = useState(false)
  const [favorite, setFavorite] = useState(false)
  return <div><div className="sample-actions">
    <Button onClick={() => setSaved(true)}><Save size={15} />保存示例</Button>
    <Button variant="outline" onClick={() => { setSaved(false); setFavorite(false) }}><RotateCcw size={15} />重置</Button>
    <Button variant="ghost" href="/#systems">查看系统<ArrowRight size={14} /></Button>
    <Button variant="icon" aria-label={favorite ? '取消示例收藏' : '收藏示例'} title={favorite ? '取消收藏' : '收藏'} aria-pressed={favorite} onClick={() => setFavorite(!favorite)}><Star size={18} fill={favorite ? 'currentColor' : 'none'} /></Button>
    <Button disabled>不可用</Button>
  </div><div className="sample-feedback" role="status">{saved ? '已保存当前示例' : '尚未保存'}</div>
    <div className="form-action-examples" role="group" aria-label="提交与取消按钮">
      <FormActionButton action="submit" type="button" />
      <FormActionButton action="cancel" />
    </div>
    <div className="action-state-examples" aria-label="提交与保存状态按钮">
      {(['submitting', 'success', 'error'] as const).map((state) => <div className="action-state-example" key={state}>
        <ActionStateNotice state={state} />
        <ActionStateButton state={state} />
      </div>)}
    </div>
  </div>
}

function InputPreview() {
  const [value, setValue] = useState('青禾果园')
  return <div className="sample-fields"><label><span className="input-focus-label">门店名称</span><Input value={value} onChange={(event) => setValue(event.target.value)} className="sample-input" /></label><label><span className="input-focus-label">只读编号</span><Input value="DEMO-S001" readOnly className="sample-input" /></label><div className="sample-search-field"><Search size={16} /><Input aria-label="输入框搜索示例" placeholder="搜索门店" className="sample-input" /></div><div className="sample-feedback" role="status">{value ? `当前门店：${value}` : '尚未填写门店名称'}</div></div>
}

function CardPreview() {
  return <Card className="sample-card"><CardHeader><Badge>系统入口</Badge><CardTitle>人员与组织中台</CardTitle></CardHeader><CardContent><p>人员、组织、岗位与权限</p><Button variant="outline" href="/#systems">查看完整界面<ArrowRight size={14} /></Button></CardContent></Card>
}

function TablePreview() {
  const [ascending, setAscending] = useState(true)
  const stores = demoStores.slice(0, 3).sort((first, second) => ascending ? first.id.localeCompare(second.id) : second.id.localeCompare(first.id))
  return <Table containerClassName="sample-table" containerProps={{ tabIndex: 0, role: 'region', 'aria-label': '组件表格，可横向滚动' }} aria-label="表格组件示例"><TableHeader><TableRow><TableHead aria-sort={ascending ? 'ascending' : 'descending'}><Button variant="ghost" className="sample-sort" onClick={() => setAscending(!ascending)}>门店编号<ArrowUpDown size={13} /></Button></TableHead><TableHead>门店名称</TableHead><TableHead>城市</TableHead><TableHead>合作状态</TableHead></TableRow></TableHeader><TableBody>{stores.map((store) => <TableRow key={store.id}><TableCell><code>{store.id}</code></TableCell><TableCell>{store.name}</TableCell><TableCell>{store.city}</TableCell><TableCell><span className="people-state"><Check size={11} />已签约</span></TableCell></TableRow>)}</TableBody></Table>
}

function DialogPreview() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('青禾果园')
  const [draft, setDraft] = useState(name)
  return <div><div className="sample-actions"><Button variant="outline" onClick={() => { setDraft(name); setOpen(true) }}>编辑示例</Button><span className="sample-feedback" role="status">当前门店：{name}</span></div>
    <Dialog open={open} onOpenChange={setOpen} labelledBy="sample-dialog-title" describedBy="sample-dialog-description" className="sample-dialog"><form onSubmit={(event) => { event.preventDefault(); if (draft.trim()) { setName(draft.trim()); setOpen(false) } }}><div className="sample-dialog-heading"><h2 id="sample-dialog-title">编辑门店</h2><Button variant="icon" type="button" aria-label="关闭编辑示例" title="关闭" onClick={() => setOpen(false)}><X size={17} /></Button></div><p id="sample-dialog-description">青禾果园 · DEMO-S001</p><label className="sample-dialog-field">门店名称<Input data-autofocus required value={draft} onChange={(event) => setDraft(event.target.value)} className="sample-input" /></label><div className="sample-dialog-footer"><Button variant="ghost" type="button" onClick={() => setOpen(false)}>取消</Button><Button type="submit" disabled={!draft.trim()}><Check size={15} />保存</Button></div></form></Dialog>
  </div>
}

function DropdownPreview() {
  const [sort, setSort] = useState('最近更新')
  return <div className="sample-actions"><DropdownMenu><DropdownMenuTrigger variant="outline">排列方式<ChevronDown size={14} /></DropdownMenuTrigger><DropdownMenuContent className="sample-menu"><DropdownMenuLabel>排列方式</DropdownMenuLabel>{['最近更新', '名称顺序', '创建时间'].map((label) => <DropdownMenuItem key={label} role="menuitemradio" aria-checked={label === sort} onSelect={() => setSort(label)}><span>{label}</span>{sort === label && <Check size={14} />}</DropdownMenuItem>)}<DropdownMenuSeparator /><DropdownMenuItem onSelect={() => setSort('最近更新')}><RotateCcw size={14} />恢复默认</DropdownMenuItem></DropdownMenuContent></DropdownMenu><span className="sample-feedback" role="status">当前：{sort}</span></div>
}

function PersonPickerPreview() {
  const [person, setPerson] = useState('demo-person-001')
  const [historical, setHistorical] = useState('demo-former-person')
  return <div className="sample-fields sample-person-fields"><label htmlFor="catalog-standard-person">标准选框<PersonPicker id="catalog-standard-person" assignees={demoPeople} value={person} onValueChange={setPerson} shopLabel="组件标准选框" /></label><label htmlFor="catalog-compact-person">紧凑选框<PersonPicker id="catalog-compact-person" compact assignees={demoPeople} value={person} onValueChange={setPerson} shopLabel="组件紧凑选框" /></label><label htmlFor="catalog-disabled-person">只读状态<PersonPicker id="catalog-disabled-person" disabled assignees={demoPeople} value="demo-person-002" onValueChange={() => undefined} shopLabel="组件只读选框" /></label><label htmlFor="catalog-historical-person">历史人员<PersonPicker id="catalog-historical-person" assignees={demoPeople} value={historical} onValueChange={setHistorical} unavailableValueLabel="原负责人（已离职）" shopLabel="组件历史选框" /></label></div>
}

export function ComponentPreview({ component }: { component: CatalogComponent }) {
  if (reactBitsFavoriteIds.has(component.id) || uiverseNewFavoriteIds.has(component.id)) return <FavoritePreview id={component.id} />
  switch (component.id) {
    case 'persistent-alert-banner': return <PersistentBannerExample />
    case 'grid-toast-stack': return <ToastStackExample />
    case 'side-drawer': return <DrawerExample />
    case 'click-copy-value': return <CopyValueExample />
    case 'table-crosshair-highlight': return <CrosshairTableExample />
    case 'feishu-field-config':
    case 'feishu-condition-filter': return <ConditionFilterExample />
    case 'uiverse-social-tooltip': return <UiverseSocialTooltipExample />
    case 'uiverse-message-composer': return <UiverseMessageComposerExample />
    case 'uiverse-expanding-bookmark-save': return <UiverseExpandingBookmarkSaveExample />
    case 'uiverse-expanding-logout': return <UiverseExpandingLogoutExample />
    case 'uiverse-floating-glow-switch': return <UiverseFloatingGlowSwitchExample />
    case 'uiverse-expanding-delete': return <UiverseExpandingDeleteExample />
    case 'button': return <ButtonPreview />
    case 'date-range': return <DateRangePreview />
    case 'color-picker': return <ColorPreview />
    case 'swatch-color-picker': return <SwatchColorPickerExample />
    case 'upload-progress': return <UploadPreview />
    case 'status-pills': return <StatusPreview />
    case 'statistics': return <StatisticsPreview />
    case 'timeline': return <TimelineExample />
    case 'collapse-panel': return <CollapsePanelExample />
    case 'flex-carousel': return <GalleryPreview />
    case 'segmented-control': return <SegmentedControlExample />
    case 'switch': return <SwitchPreview />
    case 'rating': return <RatingPreview />
    case 'peek-rating': return <Suspense fallback={<p role="status">正在加载评分…</p>}><PeekRatingExample /></Suspense>
    case 'search-select': return <SelectPreview />
    case 'cascader': return <CascaderPreview />
    case 'tree-select': return <TreePreview />
    case 'input': return <div className="prerequisite-examples"><FocusLabelPreview /><InputPreview /><ValidationPreview /></div>
    case 'textarea': return <TextareaPreview />
    case 'radio-cards': return <RadioPreview />
    case 'checkbox-cards': return <CheckboxPreview />
    case 'prerequisite-action': return <PrerequisitePreview />
    case 'badge': return <div className="sample-actions"><Badge>核心系统</Badge><Badge>运营团队</Badge><span className="people-state"><Check size={11} />已签约</span><span className="people-unassigned">尚未分配</span><span className="people-province">浙江省</span></div>
    case 'card': return <CardPreview />
    case 'table': return <TablePreview />
    case 'dialog': return <DialogPreview />
    case 'dropdown': return <DropdownPreview />
    case 'person-picker': return <PersonPickerPreview />
    default: return <div className="sample-page-entry"><LayoutTemplate size={25} /><div><strong>{component.locations[0].label}</strong><span>{component.symbol}</span></div><Button variant="outline" href={component.locations[0].href} className="reference-action">进入界面<ArrowRight size={14} /></Button></div>
  }
}
