export type PortalPermission = {
  resourceCode: string
  actions: string[]
}

// 门户只消费功能资源的 VIEW；不配置人员、组织或业务数据范围。
export type PortalVisibilityRule =
  | { mode: 'inherit' | 'public' | 'admin' }
  | { mode: 'permission'; resourceCodes: string[] }

export type PortalNavigationConfig = {
  id: string
  name: string
  href: string
  enabled: boolean
  order: number
  megaMenuId?: string
  visibility?: PortalVisibilityRule
}

export type PortalMenuItemConfig = {
  id: string
  title: string
  description: string
  badge?: string
  href?: string
  systemId?: string
  iconKey?: string
  tone?: string
  enabled: boolean
  order: number
  visibility?: PortalVisibilityRule
}

export type PortalMenuSectionConfig = {
  id: string
  title: string
  enabled: boolean
  order: number
  items: PortalMenuItemConfig[]
  visibility?: PortalVisibilityRule
}

export type PortalMenuCategoryConfig = {
  id: string
  label: string
  eyebrow: string
  title: string
  description: string
  enabled: boolean
  order: number
  sections: PortalMenuSectionConfig[]
  visibility?: PortalVisibilityRule
}

export type PortalMegaMenuConfig = {
  id: string
  categories: PortalMenuCategoryConfig[]
}

export type PortalCardConfig = {
  id: string
  name: string
  href: string
  label?: string
  enabled: boolean
  order: number
  visibility?: PortalVisibilityRule
}

export type PortalConfig = {
  version: 1
  navigation: PortalNavigationConfig[]
  megaMenus?: PortalMegaMenuConfig[]
  cards: PortalCardConfig[]
}

export const PORTAL_MANAGE_PERMISSION = 'authorization.admin.manage'

export const defaultPortalConfig: PortalConfig = {
  version: 1,
  navigation: [
    { id: 'system', name: '系统矩阵', href: '', enabled: true, order: 10, megaMenuId: 'system' },
    { id: 'collaboration', name: '业务协同', href: '', enabled: true, order: 20, megaMenuId: 'collaboration' },
    { id: 'operations', name: '数据与运营', href: '', enabled: true, order: 30, megaMenuId: 'operations' },
    { id: 'support', name: '帮助与支持', href: '', enabled: true, order: 40, megaMenuId: 'support' },
    { id: 'person-picker', name: '人员选择', href: '/components/person-picker', enabled: true, order: 50, visibility: { mode: 'public' } },
  ],
  cards: [
    { id: 'hrm', name: '人员与组织中台', href: '/components/person-picker', label: '组织数字化', enabled: true, order: 10 },
    { id: 'invest', name: '水果招商中台', href: '/components/person-picker', label: '招商数字化', enabled: true, order: 20 },
    { id: 'operator', name: '水果运营中台', href: '/components/person-picker', label: '经营数字化', enabled: true, order: 30 },
  ],
}

export function canManagePortal(permissions: PortalPermission[]) {
  return permissions.some((permission) =>
    permission.resourceCode === PORTAL_MANAGE_PERMISSION && permission.actions.includes('EXECUTE'))
}
