import {
  canManagePortal,
  type PortalConfig,
  type PortalPermission,
  type PortalVisibilityRule,
} from './portal-content-contract'

export type PortalViewer = {
  loginName: string
  localAccount: boolean
  personId: string | null
  permissions: PortalPermission[]
  permissionsAvailable: boolean
}

const inherited: PortalVisibilityRule = { mode: 'inherit' }
const publicAccess: PortalVisibilityRule = { mode: 'public' }
const adminOnly: PortalVisibilityRule = { mode: 'admin' }
const view = (...resourceCodes: string[]): PortalVisibilityRule => ({ mode: 'permission', resourceCodes })

// 使用 HRM 清单中的功能资源精确匹配，不能用应用前缀或数据范围资源推断访问权。
const cardDefaults: Record<string, PortalVisibilityRule> = {
  hrm: view(
    'hrm.personnel.roster', 'hrm.organization.tree', 'hrm.talent.pool', 'hrm.talent.intake',
    'hrm.personnel.actions', 'hrm.personnel.accounts', 'hrm.recruitment.appointments',
    'hrm.recruitment.interviews', 'hrm.recruitment.candidates', 'hrm.recruitment.onboarding-arrangements',
    'hrm.transfer.self-service', 'hrm.transfer.management',
    'authorization.admin.manage', 'authorization.integration.manage',
  ),
  invest: view('invest.access.manager', 'invest.access.member', 'invest.administration.assist'),
  operator: view(
    'invest.operator.access.manager', 'invest.operator.access.leader',
    'invest.operator.access.member', 'invest.operator.administration.assist',
  ),
}

const organization = view('hrm.organization.tree')
const organizationAndPermissions = view('hrm.organization.tree', 'authorization.admin.manage')
const followUp = view('invest.leads.pending', 'invest.intentions.mine', 'invest.public.intention')
const signings = view('invest.signings.mine', 'invest.signings.team')
const onboarding = view('invest.merchant-onboarding.member', 'invest.merchant-onboarding.manager')
const stores = view('invest.operator.crm.workspace')
const reports = view('invest.operator.yesterday.workspace')
const sync = view('invest.operator.sync.workspace')

// 旧配置按稳定 ID 补齐规则；改名不改变权限，管理员保存后规则随配置持久化。
// 这些都是进入功能页面的显示条件，不代表执行日报生成、数据同步等业务操作。
const menuDefaults: Record<string, { systemId: string; rule: PortalVisibilityRule }> = {}
function defaults(systemId: string, rule: PortalVisibilityRule, ...ids: string[]) {
  for (const id of ids) menuDefaults[id] = { systemId, rule }
}
defaults('hrm', organizationAndPermissions, 'system-category-1-section-2-item-1')
defaults('hrm', view('hrm.personnel.roster'), 'system-category-2-section-1-item-1', 'collaboration-category-2-section-1-item-1')
defaults('hrm', organization, 'system-category-2-section-1-item-2', 'system-category-2-section-1-item-6')
defaults('hrm', view('hrm.recruitment.appointments', 'hrm.recruitment.interviews', 'hrm.recruitment.candidates'), 'system-category-2-section-1-item-3')
defaults('hrm', view('authorization.admin.manage'), 'system-category-2-section-1-item-4', 'support-category-2-section-1-item-2')
defaults('hrm', view('hrm.personnel.actions'), 'system-category-2-section-1-item-5')
defaults('invest', followUp, 'system-category-1-section-2-item-2', 'system-category-3-section-1-item-2')
defaults('invest', view('invest.allocation.workspace'), 'system-category-3-section-1-item-1')
defaults('invest', signings, 'system-category-3-section-1-item-3')
defaults('invest', onboarding, 'system-category-3-section-1-item-4')
defaults('invest', view('invest.analytics.personal', 'invest.analytics.dashboard', 'invest.analytics.team'), 'system-category-3-section-1-item-5')
defaults('invest', view('invest.public.ordinary', 'invest.public.intention'), 'system-category-3-section-1-item-6')
defaults('invest', view('invest.allocation.workspace', 'invest.leads.pending', 'invest.intentions.mine', 'invest.public.intention'), 'collaboration-category-2-section-1-item-2')
defaults('invest', view('invest.signings.mine', 'invest.signings.team', 'invest.merchant-onboarding.member', 'invest.merchant-onboarding.manager'), 'collaboration-category-2-section-1-item-3')
defaults('operator', stores,
  'system-category-4-section-1-item-1', 'collaboration-category-3-section-1-item-1',
  'operations-category-1-section-1-item-1', 'operations-category-2-section-1-item-1',
)
defaults('operator', sync,
  'system-category-1-section-2-item-4', 'system-category-4-section-1-item-4',
  'collaboration-category-1-section-1-item-3', 'collaboration-category-2-section-1-item-4',
  'operations-category-1-section-1-item-4', 'operations-category-3-section-1-item-4',
)
defaults('operator', reports,
  'system-category-1-section-2-item-3', 'system-category-4-section-1-item-2', 'system-category-4-section-1-item-3',
  'collaboration-category-1-section-1-item-4', 'collaboration-category-3-section-1-item-2',
  'collaboration-category-3-section-1-item-3', 'collaboration-category-3-section-1-item-4',
  'operations-category-1-section-1-item-2', 'operations-category-1-section-1-item-3',
  'operations-category-2-section-1-item-2', 'operations-category-2-section-1-item-3', 'operations-category-2-section-1-item-4',
  'operations-category-3-section-1-item-1', 'operations-category-3-section-1-item-2', 'operations-category-3-section-1-item-3',
)

const publicAnchors = new Set(['#top', '#systems', '#workflow', '#support'])

export function withPortalVisibilityDefaults(config: PortalConfig): PortalConfig {
  return {
    ...config,
    cards: config.cards.map((card) => ({ ...card, visibility: card.visibility ?? cardDefaults[card.id] ?? adminOnly })),
    navigation: config.navigation.map((navigation) => ({
      ...navigation,
      visibility: navigation.visibility ?? (navigation.megaMenuId && !navigation.href ? inherited : adminOnly),
    })),
    megaMenus: config.megaMenus?.map((menu) => ({
      ...menu,
      categories: menu.categories.map((category) => ({
        ...category,
        visibility: category.visibility ?? inherited,
        sections: category.sections.map((section) => ({
          ...section,
          visibility: section.visibility ?? inherited,
          items: section.items.map((item) => {
            const known = menuDefaults[item.id]
            const fallback = known && known.systemId === item.systemId ? known.rule
              : item.systemId ? inherited
                : publicAnchors.has(item.href ?? '') ? publicAccess : adminOnly
            return { ...item, visibility: item.visibility ?? fallback }
          }),
        })),
      })),
    })),
  }
}

/** 配置接口和编辑器共用校验，非法规则不能被静默丢弃后降级为公开显示。 */
export function normalizePortalVisibility(value: unknown): PortalVisibilityRule | undefined {
  if (value === undefined) return undefined
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('显示权限格式无效')
  const candidate = value as Record<string, unknown>
  if (candidate.mode === 'inherit' || candidate.mode === 'public' || candidate.mode === 'admin') {
    if ('resourceCodes' in candidate) throw new Error('当前显示方式不接受权限资源')
    return { mode: candidate.mode }
  }
  if (candidate.mode !== 'permission' || !Array.isArray(candidate.resourceCodes)
    || candidate.resourceCodes.length === 0 || candidate.resourceCodes.length > 50) {
    throw new Error('请选择 1 至 50 个显示权限资源')
  }
  const resourceCodes = candidate.resourceCodes.map((code: unknown) => {
    if (typeof code !== 'string' || code.length > 200 || !/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/.test(code)) {
      throw new Error('显示权限资源编码无效')
    }
    return code
  })
  return { mode: 'permission', resourceCodes: [...new Set(resourceCodes)] }
}

export function portalVisibilityRules(config: PortalConfig): (PortalVisibilityRule | undefined)[] {
  return [
    ...config.cards.map((card) => card.visibility),
    ...config.navigation.map((navigation) => navigation.visibility),
    ...(config.megaMenus ?? []).flatMap((menu) => menu.categories.flatMap((category) => [
      category.visibility,
      ...category.sections.flatMap((section) => [section.visibility, ...section.items.map((item) => item.visibility)]),
    ])),
  ]
}

export function portalPermissionApplications(config: PortalConfig): string[] {
  const applications = new Set(['hrm', 'authorization'])
  for (const rule of portalVisibilityRules(withPortalVisibilityDefaults(config))) {
    if (rule?.mode === 'permission') {
      for (const code of rule.resourceCodes) applications.add(code.split('.')[0])
    }
  }
  return [...applications].sort()
}

export function isPortalAdministrator(viewer: PortalViewer | null): boolean {
  // 仅信任 HRM 会话返回的独立 admin 身份，并复核当前管理权限。
  // 被委派了门户编辑权限的普通人员不因此获得所有业务入口的显示权。
  return Boolean(viewer?.permissionsAvailable && viewer.localAccount && viewer.personId === null
    && viewer.loginName === 'admin' && canManagePortal(viewer.permissions))
}

export function selectVisiblePortalConfig(source: PortalConfig, viewer: PortalViewer | null): PortalConfig {
  const config = withPortalVisibilityDefaults(source)
  const administrator = isPortalAdministrator(viewer)
  const viewable = new Set(viewer?.permissionsAvailable
    ? viewer.permissions.filter((permission) => permission.actions.includes('VIEW')).map((permission) => permission.resourceCode)
    : [])
  const allowed = (rule: PortalVisibilityRule | undefined, inheritedAccess = false) => {
    if (administrator) return true
    if (!rule || rule.mode === 'inherit') return inheritedAccess
    if (rule.mode === 'public') return true
    if (rule.mode !== 'permission') return false
    return rule.resourceCodes.some((code) => viewable.has(code))
  }

  const cards = config.cards.filter((card) => card.enabled && card.name.trim() && card.href.trim() && allowed(card.visibility))
  const systemIds = new Set(cards.map((card) => card.id))
  const hasWorkflow = ['hrm', 'invest', 'operator'].some((id) => systemIds.has(id))
  const availableAnchor = (href?: string) => href !== '#workflow' || hasWorkflow
  const megaMenus = (config.megaMenus ?? []).map((menu) => ({
    ...menu,
    categories: menu.categories
      .filter((category) => category.enabled && allowed(category.visibility, true))
      .map((category) => ({
        ...category,
        sections: category.sections
          .filter((section) => section.enabled && allowed(section.visibility, true))
          .map((section) => ({
            ...section,
            items: section.items.filter((item) => item.enabled
              && (!item.systemId || systemIds.has(item.systemId))
              && availableAnchor(item.href)
              && allowed(item.visibility, Boolean(item.systemId && systemIds.has(item.systemId)))),
          }))
          .filter((section) => section.items.length > 0),
      }))
      .filter((category) => category.sections.length > 0),
  })).filter((menu) => menu.categories.length > 0)
  const menuIds = new Set(megaMenus.map((menu) => menu.id))
  const navigation = config.navigation.filter((item) => {
    if (!item.enabled || !item.name.trim() || !availableAnchor(item.href)) return false
    const hasMenu = Boolean(item.megaMenuId && !item.href)
    if (hasMenu && !menuIds.has(item.megaMenuId!)) return false
    return allowed(item.visibility, hasMenu)
  })
  // 始终生成展示副本；管理面板必须保存未过滤的源配置，不能误删其他人的入口。
  return { ...config, cards, navigation, megaMenus }
}
