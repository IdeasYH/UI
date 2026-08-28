import { Layers3, LayoutTemplate, ListFilter, MousePointer2, PanelTop, Search, Table2, X, type LucideIcon } from 'lucide-react'
import { componentCatalog, componentCategories, type ComponentCategoryId } from '../data/template-catalog'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'

export const categoryIcons: Record<ComponentCategoryId, LucideIcon> = {
  navigation: LayoutTemplate,
  interaction: MousePointer2,
  display: Table2,
  overlay: PanelTop,
  business: ListFilter,
}

export function CatalogSearch({ value, onChange, label = '搜索组件' }: { value: string; onChange: (value: string) => void; label?: string }) {
  return <div className="reference-search">
    <Search size={16} aria-hidden />
    <Input aria-label={label} placeholder="搜索组件、用途或界面" value={value} onChange={(event) => onChange(event.target.value)} />
    {value && <Button variant="icon" aria-label={`清除${label}`} title={`清除${label}`} onClick={() => onChange('')}><X size={14} /></Button>}
  </div>
}

export function CategoryNavigation({ active = 'all', query = '', includeAll = true }: { active?: ComponentCategoryId | 'all'; query?: string; includeAll?: boolean }) {
  const href = (category: string) => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (query.trim()) params.set('q', query.trim())
    return `/components${params.size ? `?${params}` : ''}`
  }

  return <nav className="reference-category-list" aria-label="组件分类">
    {includeAll && <Button variant="nav" href={href('all')} className={cn('reference-category-link', active === 'all' && 'reference-category-active')} aria-current={active === 'all' ? 'page' : undefined}><Layers3 size={15} /><span>全部组件</span><small>{componentCatalog.length}</small></Button>}
    {componentCategories.map((category) => {
      const Icon = categoryIcons[category.id]
      return <Button key={category.id} variant="nav" href={href(category.id)} className={cn('reference-category-link', active === category.id && 'reference-category-active')} aria-current={active === category.id ? 'page' : undefined}>
        <Icon size={15} /><span>{category.title}</span><small>{componentCatalog.filter((component) => component.category === category.id).length}</small>
      </Button>
    })}
  </nav>
}
