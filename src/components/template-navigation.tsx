import { BookOpen, Check, ChevronDown, Component, Layers3, LayoutTemplate, Network, Users } from 'lucide-react'
import { organizationVariants, templatePages, type TemplatePageId } from '../data/template-catalog'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import { cn } from '../lib/utils'
import { PermissionLauncher } from './permissions/permission-provider'
import { usePermissions } from './permissions/permission-context'

const pageIcons = { guide: BookOpen, components: Component, portal: LayoutTemplate, people: Users, 'organization-tree': Network, 'organization-personnel': Users, 'organization-figma': Network }

export function TemplateNavigation({ currentPage }: { currentPage: TemplatePageId }) {
  const permissions = usePermissions()
  return <header className="reference-bar" aria-label="模板导航栏">
    <div className="reference-bar-inner">
      <a className="reference-brand" href="/guide" aria-label="UIModel 模板说明书"><Layers3 size={19} /><strong>UIModel</strong><span>前端参考模板</span></a>
      <nav className="reference-links" aria-label="模板全局导航">
        {templatePages.filter((page) => !page.id.startsWith('organization-') && (permissions?.can(`page:${page.id}`) ?? true)).map((page) => {
          const Icon = pageIcons[page.id]
          const active = page.id === currentPage
          return <Button key={page.id} href={page.href} variant="nav" className={cn('reference-link', active && 'reference-link-active')} aria-current={active ? 'page' : undefined}><Icon size={15} aria-hidden />{page.title}</Button>
        })}
        {organizationVariants.some((page) => permissions?.can(`page:${page.id}`) ?? true) && <DropdownMenu><DropdownMenuTrigger variant="nav" className={cn('reference-link', 'reference-org-trigger', currentPage.startsWith('organization-') && 'reference-link-active')} aria-label="组织人员版本导航" aria-current={currentPage.startsWith('organization-') ? 'page' : undefined}><Network size={15} aria-hidden /><span>组织人员</span><ChevronDown size={12} aria-hidden /></DropdownMenuTrigger><DropdownMenuContent className="reference-org-menu"><DropdownMenuLabel>组织人员 · {organizationVariants.length} 个版本</DropdownMenuLabel>{organizationVariants.filter((page) => permissions?.can(`page:${page.id}`) ?? true).map((page) => <DropdownMenuItem key={page.id} onSelect={() => window.location.assign(page.href)}><span>{page.version} · {page.label}</span>{currentPage === page.id && <Check size={14} />}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
      </nav>
      <PermissionLauncher />
    </div>
  </header>
}
