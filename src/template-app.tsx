import { TopologyOnsiteBridge } from './components/permissions/topology-onsite'
import { useEffect, type ComponentType } from 'react'
import App from './App'
import { TemplateNavigation } from './components/template-navigation'
import { resolveTemplatePage, templatePages, type TemplatePageId } from './data/template-catalog'
import { GuidePage } from './pages/guide-page'
import { ComponentsPage } from './pages/components-page'
import { PeoplePage } from './pages/people-page'
import { OrganizationTreePage } from './pages/organization-page'
import { PersonnelManagementPage } from './pages/personnel-management-page'
import { FigmaOrganizationPage } from './pages/figma-organization-page'
import { LuminaryCardPage } from './pages/luminary-card-page'
import { PermissionProvider, PermissionPage } from './components/permissions/permission-provider'

const pageComponents: Record<TemplatePageId, ComponentType> = {
  guide: GuidePage,
  components: ComponentsPage,
  portal: App,
  people: PeoplePage,
  'luminary-card': LuminaryCardPage,
  'organization-tree': OrganizationTreePage,
  'organization-personnel': PersonnelManagementPage,
  'organization-figma': FigmaOrganizationPage,
}

export function TemplateApp() {
  const currentPage = resolveTemplatePage(window.location.pathname)
  const Page = pageComponents[currentPage]

  useEffect(() => {
    document.title = `${templatePages.find((page) => page.id === currentPage)?.title} | UIModel`
    // Home restores its fragment after configuration and identity finish loading.
    if (currentPage === 'portal') return
    // React mounts after document navigation; restore direct links to catalog and page sections.
    const frame = window.requestAnimationFrame(() => {
      const anchor = window.location.hash.slice(1)
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [currentPage])

  if (currentPage === 'organization-figma') return <div className="reference-shell"><TemplateNavigation currentPage={currentPage}/><Page/></div>

  return <PermissionProvider><TopologyOnsiteBridge pageId={currentPage}><div className="reference-shell">
    <TemplateNavigation currentPage={currentPage} />
    <PermissionPage pageId={currentPage}><Page /></PermissionPage>
  </div></TopologyOnsiteBridge></PermissionProvider>
}
