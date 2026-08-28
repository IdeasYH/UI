import { ArrowRight, ArrowUpRight, BookOpen, Component, FileCode2 } from 'lucide-react'
import { CatalogSearch, CategoryNavigation, categoryIcons } from '../components/catalog-navigation'
import { ComponentPreview } from '../components/component-previews'
import { Button } from '../components/ui/button'
import { componentCatalog, componentCategories, filterComponentCatalog, normalizeComponentCategory } from '../data/template-catalog'
import { useCatalogQuery } from '../lib/use-catalog-query'

export function ComponentsPage() {
  const params = new URLSearchParams(window.location.search)
  const category = normalizeComponentCategory(params.get('category'))
  const [query, setQuery] = useCatalogQuery()
  const components = filterComponentCatalog(query, category)
  const title = componentCategories.find((item) => item.id === category)?.title ?? '全部组件'

  return <div className="reference-page"><div className="reference-layout">
    <aside className="reference-sidebar"><div className="reference-sidebar-heading"><Component size={15} />组件分类</div><CategoryNavigation active={category} query={query} /><div className="reference-sidebar-divider" /><Button variant="ghost" href="/guide#component-index" className="reference-sidebar-guide"><BookOpen size={15} />组件与界面对照<ArrowUpRight size={12} /></Button></aside>
    <main className="reference-main" id="components-top">
      <div className="reference-page-heading"><div><div className="reference-eyebrow">UIModel / Components</div><h1>组件总览</h1><p>{componentCatalog.length} 项组件与组合，按用途分类。</p></div><Button variant="outline" href="/guide" className="reference-action"><BookOpen size={15} />说明书</Button></div>
      <div className="catalog-toolbar"><div><strong>{title}</strong><span aria-live="polite">{components.length} 项</span></div><CatalogSearch value={query} onChange={setQuery} /></div>
      <nav className="catalog-jump-list" aria-label="当前分类组件导航">{components.map((component) => <Button key={component.id} variant="ghost" href={`#${component.id}`} className="reference-text-link">{component.name}</Button>)}</nav>
      <div className="catalog-examples">
        {components.map((component) => {
          const Icon = categoryIcons[component.category]
          return <section key={component.id} id={component.id} className="catalog-example" aria-labelledby={`${component.id}-title`}>
            <div className="catalog-example-heading"><div className="catalog-component-icon" data-category={component.category}><Icon size={17} /></div><div><h2 id={`${component.id}-title`}>{component.name}<code>{component.symbol}</code></h2><p>{component.description}</p></div><span className="catalog-kind">{component.kind}</span></div>
            <div className="catalog-sample"><ComponentPreview component={component} /></div>
            <div className="catalog-example-footer"><div className="catalog-source"><FileCode2 size={13} /><div>{component.sources.map((source) => <code key={source}>{source}</code>)}</div></div><nav aria-label={`${component.name}所在界面`}>{component.locations.map((location) => <Button key={location.href} variant="ghost" href={location.href} className="reference-text-link">{location.label}<ArrowUpRight size={12} /></Button>)}</nav></div>
          </section>
        })}
      </div>
      {!components.length && <div className="reference-empty"><Component size={28} /><h2>没有匹配的组件</h2><p>当前分类：{title}</p><div className="sample-actions"><Button variant="outline" onClick={() => setQuery('')} disabled={!query}>清除搜索</Button><Button variant="ghost" href="/components">查看全部组件<ArrowRight size={14} /></Button></div></div>}
      <footer className="reference-footer"><span>示例操作仅在当前页面内存中生效</span><Button variant="ghost" href="#components-top" className="reference-text-link">回到顶部<ArrowRight size={13} /></Button></footer>
    </main>
  </div></div>
}
