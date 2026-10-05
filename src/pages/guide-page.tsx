import { Fragment } from 'react'
import { ArrowRight, ArrowUpRight, BookOpen, Component, FileCode2, FolderOpen, LayoutTemplate, Network, ShieldCheck } from 'lucide-react'
import { CatalogSearch, CategoryNavigation, categoryIcons } from '../components/catalog-navigation'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { componentCatalog, componentCategories, componentPreviewHref, examplePages, filterComponentCatalog, organizationVariants } from '../data/template-catalog'
import { useCatalogQuery } from '../lib/use-catalog-query'
import reuseMethod from '../../docs/UI-REUSE.md?raw'
import reactBitsFavoritesGuide from '../../docs/REACT-BITS-FAVORITES.md?raw'
import uiverseFavoritesGuide from '../../docs/UIVERSE-FAVORITES.md?raw'
import { ReferenceDocument } from '../components/reference-document'
import '../components/component-reference.css'

export function GuidePage() {
  const [query, setQuery] = useCatalogQuery()
  const filtered = filterComponentCatalog(query)

  return <div className="reference-page">
    <div className="reference-layout">
      <aside className="reference-sidebar">
        <div className="reference-sidebar-heading"><BookOpen size={15} />模板说明书</div>
        <nav className="reference-chapter-list" aria-label="说明书目录">
          <Button variant="nav" href="#reuse-method"><BookOpen size={15} />从新需求选择与迁移</Button>
          <Button variant="nav" href="#react-bits-favorites"><Component size={15} />React Bits 收藏选型</Button>
          <Button variant="nav" href="#uiverse-favorites"><Component size={15} />Uiverse 收藏选型</Button>
          <Button variant="nav" href="#page-map"><LayoutTemplate size={15} />界面地图</Button>
          <Button variant="nav" href="#organization-variants"><Network size={15} />组织人员版本</Button>
          <Button variant="nav" href="#figma-replica"><FileCode2 size={15} />拓扑结构</Button>
          <Button variant="nav" href="#component-index"><Component size={15} />组件索引</Button>
          <Button variant="nav" href="#reuse-notes"><FileCode2 size={15} />复用说明</Button>
        </nav>
        <div className="reference-sidebar-label">按分类浏览</div>
        <CategoryNavigation includeAll={false} />
      </aside>

      <main className="reference-main" id="guide-top">
        <div className="reference-page-heading">
          <div><div className="reference-eyebrow">UIModel / Guide</div><h1>模板说明书</h1><p>组件在哪里、有哪些状态，以及它们在完整界面中的组合方式。</p></div>
          <Button variant="outline" href="/components" className="reference-action"><Component size={15} />浏览组件<ArrowRight size={14} /></Button>
        </div>
        <div className="reference-summary"><span>{examplePages.length} 个参考界面</span><span>{componentCategories.length} 个组件分类</span><span>{componentCatalog.length} 项组件与组合</span></div>

        <section className="reference-section" id="reuse-method" aria-label="从新需求选择与迁移">
          <ReferenceDocument source={reuseMethod} />
        </section>
        <section className="reference-section" id="react-bits-favorites" aria-label="React Bits 收藏组件选型">
          <ReferenceDocument source={reactBitsFavoritesGuide} />
        </section>
        <section className="reference-section" id="uiverse-favorites" aria-label="Uiverse 收藏组件选型">
          <ReferenceDocument source={uiverseFavoritesGuide} />
        </section>
        <section className="reference-section" id="page-map" aria-labelledby="page-map-title">
          <div className="reference-section-heading"><h2 id="page-map-title">界面地图</h2><span>参考组件如何组成完整页面</span></div>
          <div className="reference-screen-grid">
            {examplePages.map((page) => <Card key={page.id} className="reference-screen-card">
              <a className="reference-screen-image" href={page.href} aria-label={`打开${page.title}`}><img src={page.image} alt={`${page.title}界面预览`} width="1440" height="900" /></a>
              <CardHeader><div><CardTitle>{page.title}</CardTitle><Badge>{page.source}</Badge></div><p>{page.description}</p></CardHeader>
              <CardContent><nav className="reference-screen-links" aria-label={`${page.title}区域导航`}>{page.sections.map((section) => <Button key={section.href} variant="ghost" href={section.href} className="reference-text-link">{section.label}<ArrowUpRight size={12} /></Button>)}</nav></CardContent>
            </Card>)}
          </div>
        </section>

        <section className="reference-section" id="organization-variants" aria-labelledby="organization-variants-title">
          <div className="reference-section-heading"><h2 id="organization-variants-title">组织人员 · {organizationVariants.length} 版对照</h2><span>拓扑结构、经典结构、树表工作台</span></div>
          <dl className="reference-notes">
            <div><dt>A · 拓扑结构</dt><dd>组织与任职拓扑、角色复用、组织批量授权和荧光范围预览，支持示例权限试用。<Button href="/organization/figma" variant="ghost" className="reference-text-link">打开 A 版<ArrowUpRight size={12} /></Button></dd></div>
            <div><dt>B · 经典结构</dt><dd>四项人员统计、组织树、账号与资料状态、可变页数的人员表格，右侧操作列吸附。导入、入职和人员操作均为演示提示。<Button href="/organization/personnel" variant="ghost" className="reference-text-link">打开 B 版<ArrowUpRight size={12} /></Button></dd></div>
            <div><dt>C · 树表工作台</dt><dd>左侧组织树定位部门，紧凑关联图展示直属组织，下方人员表格支持排序、分页与详情。<Button href="/organization/tree" variant="ghost" className="reference-text-link">打开 C 版<ArrowUpRight size={12} /></Button></dd></div>
            <div><dt>数据与交互</dt><dd>A 使用 Figma 演示快照，支持平移缩放与组员维护。B / C 共用虚构组织与人员，支持任职状态和人员搜索；B 始终包含下级，C 提供包含下级开关与人员详情。</dd></div>
          </dl>
        </section>

        <section className="reference-section" id="figma-replica" aria-labelledby="figma-replica-title">
          <div className="reference-section-heading"><h2 id="figma-replica-title">A · 拓扑结构</h2><Button href="/organization/figma" variant="ghost" className="reference-text-link">查看页面<ArrowUpRight size={12} /></Button></div>
          <dl className="reference-notes">
            <div><dt>画布与卡片</dt><dd>递归组织树显示 L1、L2 等实际深度，支持继续新增下级。点击节点批量选择接收人员，点击人员卡选择任职；荧光仅在分配角色时出现。</dd></div>
            <div><dt>操作与搜索</dt><dd>先在角色库配置页面、按钮三态和数据范围，再分配给组织或任职。支持同级快捷勾选、节点移动、HRM 示例选人和调组。配置保存在本标签页，刷新可恢复。</dd></div>
            <div><dt>数据边界</dt><dd>当前名册从原虚构样本按人员去重：22 人、23 条任职；不沿用原稿 36 人汇总来表示授权人数。初始只给 admin 全部权限，其余人员从空授权开始。权限试用使用独立虚构记录，不连接业务系统。</dd></div>
            <div><dt>复用文件</dt><dd><code>src/components/permissions/topology-workspace.tsx</code><p>授权计算位于 <code>topology-model.ts</code>，样式位于 <code>src/topology-authorization.css</code>。当前规则与验收见 <code>docs/ORGANIZATION-PERMISSIONS-BDD.md</code>。</p></dd></div>
          </dl>
        </section>

        <section className="reference-section" id="component-index" aria-labelledby="component-index-title">
          <div className="reference-section-heading"><div><h2 id="component-index-title">组件索引</h2><p>三个样板提供完整源码包；其余组件可参考交互与样式，独立复制前需核对依赖。</p></div><span aria-live="polite">{filtered.length} 项</span></div>
          <CatalogSearch value={query} onChange={setQuery} label="搜索组件说明" />
          <Table containerClassName="guide-index-table" aria-label="组件与界面对应表">
            <TableHeader><TableRow><TableHead>组件</TableHead><TableHead>所在界面 / 位置</TableHead><TableHead>预览</TableHead></TableRow></TableHeader>
            <TableBody>
              {componentCategories.map((category) => {
                const items = filtered.filter((component) => component.category === category.id)
                const Icon = categoryIcons[category.id]
                if (!items.length) return null
                return <Fragment key={category.id}>
                  <TableRow className="guide-category-row"><TableCell colSpan={3}><span data-category={category.id}><Icon size={14} />{category.title}<small>{items.length}</small></span></TableCell></TableRow>
                  {items.map((component) => <TableRow key={component.id}>
                    <TableCell><strong>{component.name}</strong><code>{component.symbol}</code><small>{component.kind}</small></TableCell>
                    <TableCell><div className="guide-location-links">{component.locations.map((location) => <Button key={location.href} variant="ghost" href={location.href} className="reference-text-link">{location.label}<ArrowUpRight size={12} /></Button>)}</div></TableCell>
                    <TableCell><Button variant="ghost" href={componentPreviewHref(component)} className="reference-text-link" aria-label={`查看${component.name}示例`}>{component.preview === 'live' ? '查看示例' : '查看入口'}<ArrowRight size={13} /></Button></TableCell>
                  </TableRow>)}
                </Fragment>
              })}
              {!filtered.length && <TableRow><TableCell colSpan={3} className="reference-empty"><Component size={24} /><strong>没有匹配的组件</strong><Button variant="ghost" className="reference-action" onClick={() => setQuery('')}>清除搜索</Button></TableCell></TableRow>}
            </TableBody>
          </Table>
        </section>

        <section className="reference-section" id="reuse-notes" aria-labelledby="reuse-notes-title">
          <div className="reference-section-heading"><h2 id="reuse-notes-title">复用说明</h2><FolderOpen size={17} /></div>
          <dl className="reference-notes">
            <div><dt>基础组件</dt><dd><code>src/components/ui/</code><p>沿用当前项目的 Button、Input、Card、Badge、Table、Dialog 与 DropdownMenu，不需要新增组件依赖。</p></dd></div>
            <div><dt>人员选择器</dt><dd><code>src/components/person-picker/</code><p>使用稳定 personId；拼音和首字母由数据源提供。具体字段、键盘操作和复用接口见项目文档 <code>docs/PERSON-PICKER.md</code>。</p></dd></div>
            <div><dt>组织与人员</dt><dd><code>src/components/organization/</code><p>B / C 复用虚构组织数据，B 额外补充虚构账号与资料状态；A 使用独立的 Figma 演示快照。接口与数据边界见 <code>docs/ORGANIZATION-UI.md</code> 和 <code>docs/FIGMA-ORGANIZATION.md</code>。</p></dd></div>
            <div><dt>样式归属</dt><dd><p><code>src/index.css</code> 保留 Home 样式；<code>src/template.css</code> 是模板适配；<code>src/reference.css</code> 用于参考导航、说明书和组件总览；A 使用 <code>src/topology-authorization.css</code>，B 使用 <code>src/personnel-management.css</code>，C 使用 <code>src/organization.css</code>。</p></dd></div>
            <div><dt>维护目录</dt><dd><code>src/data/template-catalog.ts</code><p>新增界面或组件时，在这里登记分类、文件与位置，顶部导航、组件分类和说明书共用同一份目录。</p></dd></div>
          </dl>
          <div className="reference-boundary"><ShieldCheck size={18} /><div><strong>仅为 UI 参考，不是业务后台</strong><p>使用本地示例与 Figma 演示快照，不读取业务系统名册。基础交互示例使用页面内存；首页收藏使用 localStorage，A 拓扑配置使用当前标签页 sessionStorage。真实身份、权限、接口和数据持久化需要在目标系统接入。</p></div></div>
        </section>
        <footer className="reference-footer"><span>UIModel · 本地前端参考模板</span><Button variant="ghost" href="#guide-top" className="reference-text-link">回到顶部<ArrowRight size={13} /></Button></footer>
      </main>
    </div>
  </div>
}
