import { catalogSize } from '../data/catalog-layout'
import './components-gallery.css'
import { useState } from 'react'
import { ArrowRight, ArrowUpRight, BookOpen, Check, Component, Copy, FileCode2 } from 'lucide-react'
import { CatalogSearch, CategoryNavigation, categoryIcons } from '../components/catalog-navigation'
import { ComponentPreview } from '../components/component-previews'
import { ComponentReferencePanel } from '../components/component-reference-panel'
import { Button } from '../components/ui/button'
import { componentCatalog, componentCategories, filterComponentCatalog, normalizeComponentCategory } from '../data/template-catalog'
import { useCatalogQuery } from '../lib/use-catalog-query'

export function ComponentsPage() {
  const [copiedId, setCopiedId] = useState('')
  const [copyError, setCopyError] = useState('')
  const params = new URLSearchParams(window.location.search)
  const category = normalizeComponentCategory(params.get('category'))
  const [query, setQuery] = useCatalogQuery()
  const components = filterComponentCatalog(query, category)
  const title = componentCategories.find((item) => item.id === category)?.title ?? '全部组件'

  async function copyComponentId(id: string) {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      setCopyError('')
    } catch {
      setCopiedId('')
      setCopyError(id)
    }
  }

  return <div className="reference-page components-gallery"><div className="reference-layout">
    <aside className="reference-sidebar"><div className="reference-sidebar-heading"><Component size={15} />组件分类</div><CategoryNavigation active={category} query={query} /><div className="reference-sidebar-divider" /><Button variant="ghost" href="/guide#component-index" className="reference-sidebar-guide"><BookOpen size={15} />组件与界面对照<ArrowUpRight size={12} /></Button></aside>
    <main className="reference-main" id="components-top">
      <div className="reference-page-heading"><div><div className="reference-eyebrow">UIModel / Components</div><h1>组件总览</h1><p>{componentCatalog.length} 项组件与组合，按用途分类。按尺寸自动排列，点击 ID 复制定位。Z 回顶部 · C 到底部（输入时不触发）。</p></div><Button variant="outline" href="/guide" className="reference-action"><BookOpen size={15} />说明书</Button></div>
      <div className="catalog-toolbar"><div><strong>{title}</strong><span aria-live="polite">{components.length} 项</span></div><CatalogSearch value={query} onChange={setQuery} /></div>
      <div className="reuse-intro"><strong>从交互结构找参考，业务示例不是适用范围清单。</strong><br />先判断单选 / 多选、平铺 / 层级、即时生效 / 确认后生效、独立操作 / 条件依赖。未找到同名业务时，可组合邻近组件。<a href="/guide#reuse-method">阅读通用选型与迁移方法 →</a></div>
      <nav className="catalog-jump-list" aria-label="分类快速导航">{componentCategories.filter(group => components.some(item => item.category === group.id)).map(group => <Button key={group.id} variant="ghost" href={`#group-${group.id}`}>{group.title} · {components.filter(item => item.category === group.id).length}</Button>)}</nav>
      {componentCategories.map(group => {
        const entries = components.filter(component => component.category === group.id)
        const swatchIndex = entries.findIndex(item => item.id === 'swatch-color-picker')
        if (swatchIndex >= 0 && entries.some(item => item.id === 'uiverse-perspective-color-swatch')) {
          const [swatch] = entries.splice(swatchIndex, 1)
          entries.splice(entries.findIndex(item => item.id === 'uiverse-perspective-color-swatch') + 1, 0, swatch)
        }
        if (!entries.length) return null
        return <section className="catalog-group" key={group.id} id={`group-${group.id}`} aria-label={group.title}><h2 className="catalog-group-title">{group.title}<span>{entries.length} 项</span></h2><div className="catalog-examples">
        {entries.map((component) => {
          const Icon = categoryIcons[component.category]
          return <section key={component.id} id={component.id} className={`catalog-example catalog-size-${catalogSize(component)}`} aria-labelledby={`${component.id}-title`}>
            <div className="catalog-example-heading"><div className="catalog-component-icon" data-category={component.category}><Icon size={17} /></div><div><h2 id={`${component.id}-title`}>{component.name}<code>{component.symbol}</code></h2><p>{component.description}</p><button type="button" className="catalog-id-copy" aria-label={`复制 ${component.name} 的组件 ID：${component.id}`} onClick={() => void copyComponentId(component.id)}>{copiedId === component.id ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}<span>ID: <code>{component.id}</code></span><span className="catalog-id-copy-feedback">{copiedId === component.id ? '已复制' : copyError === component.id ? '复制失败，请手动复制' : '点击复制'}</span></button></div><span className="catalog-kind">{component.kind}</span></div>
            <div className="catalog-sample"><ComponentPreview component={component} /></div>
            <details className="catalog-card-details"><summary>说明、用法与源码</summary><ComponentReferencePanel id={component.id} />
            <div className="catalog-example-footer"><div className="catalog-source"><FileCode2 size={13} /><div>{component.sources.map((source) => <code key={source}>{source}</code>)}</div></div><nav aria-label={`${component.name}所在界面`}>{component.locations.map((location) => <Button key={location.href} variant="ghost" href={location.href} className="reference-text-link">{location.label}<ArrowUpRight size={12} /></Button>)}</nav></div>
          </details></section>
        })}
      </div></section>
      })}
      {!components.length && <div className="reference-empty"><Component size={28} /><h2>没有同名结果，也可以找到相似模式</h2><p>当前分类：{title}。去掉业务名词，改搜“单值”“层级路径”“连续区间”“前置条件”，或清除分类查看相邻组件。</p><div className="sample-actions"><Button variant="outline" onClick={() => setQuery('')} disabled={!query}>清除搜索</Button><Button variant="ghost" href="/components">查看全部组件<ArrowRight size={14} /></Button><Button variant="ghost" href="/guide#reuse-method">按交互结构选型</Button></div></div>}
      <footer className="reference-footer"><span>示例操作仅在当前页面内存中生效</span><Button variant="ghost" href="#components-top" className="reference-text-link">回到顶部<ArrowRight size={13} /></Button></footer>
    </main>
  </div></div>
}
