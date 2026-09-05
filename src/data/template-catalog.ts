export const organizationVariants = [
  { id: 'organization-figma', title: '组织人员 A · 拓扑结构', href: '/organization/figma', variant: 'figma', version: 'A', label: '拓扑结构' },
  { id: 'organization-personnel', title: '组织人员 B · 经典结构', href: '/organization/personnel', variant: 'personnel', version: 'B', label: '经典结构' },
  { id: 'organization-tree', title: '组织人员 C · 树表工作台', href: '/organization/tree', variant: 'tree', version: 'C', label: '树表工作台' },
] as const

export const templatePages = [
  { id: 'guide', title: '说明书', href: '/guide' },
  { id: 'components', title: '组件总览', href: '/components' },
  { id: 'portal', title: '门户首页', href: '/' },
  { id: 'people', title: '人员分配', href: '/components/person-picker' },
  ...organizationVariants,
] as const

export type TemplatePageId = typeof templatePages[number]['id']

export function resolveTemplatePage(pathname: string): TemplatePageId {
  const path = pathname.replace(/\/+$/, '') || '/'
  return templatePages.find((page) => page.href === path)?.id ?? 'portal'
}

export const componentCategories = [
  { id: 'navigation', title: '导航与布局' },
  { id: 'interaction', title: '基础交互' },
  { id: 'display', title: '数据与状态' },
  { id: 'overlay', title: '浮层与反馈' },
  { id: 'business', title: '业务组件' },
] as const

export type ComponentCategoryId = typeof componentCategories[number]['id']

type ComponentLocation = {
  page: Exclude<TemplatePageId, 'guide' | 'components'>
  label: string
  href: string
}

type ComponentEntry = {
  id: string
  name: string
  symbol: string
  category: ComponentCategoryId
  kind: '基础组件' | '业务组件' | '页面组合'
  description: string
  sources: readonly string[]
  locations: readonly ComponentLocation[]
  preview: 'live' | 'page'
}

export const componentCatalog = [
  {
    id: 'system-permissions', name: '本系统页面与按钮权限', symbol: 'PermissionProvider / PermissionPage', category: 'business', kind: '业务组件',
    description: 'HRM 只管系统准入；本系统功能角色、页面权限树、现场配置、人员多角色并集与真实页面测试。仅前端演示。',
    sources: ['src/components/permissions/permission-provider.tsx', 'src/components/permissions/permission-model.ts', 'src/components/permissions/permission-context.ts', 'src/permissions.css'], preview: 'page',
    locations: [{ page: 'organization-figma', label: 'A 拓扑结构 / 功能权限入口', href: '/organization/figma#figma-controls' }],
  },
  {
    id: 'figma-organization-canvas', name: 'Figma 组织连线画布', symbol: 'FigmaOrganizationGraph', category: 'business', kind: '业务组件',
    description: '部门、业务组和成员三级连线；包含展开收起、平移、缩放、适应画布与组织人员搜索。',
    sources: ['src/components/figma-organization/figma-organization-graph.tsx', 'src/figma-organization.css'], preview: 'page',
    locations: [{ page: 'organization-figma', label: 'A 拓扑结构 / 组织连线画布', href: '/organization/figma#figma-canvas' }, { page: 'organization-figma', label: 'A 拓扑结构 / 画布工具栏', href: '/organization/figma#figma-controls' }],
  },
  {
    id: 'figma-performance-card', name: '绩效进度人员卡片', symbol: 'MemberCard / KpiBadge', category: 'display', kind: '业务组件',
    description: '全宽绩效填充、三级完成率颜色、职级与工号标签；没有绩效数据时显示待统计。',
    sources: ['src/components/figma-organization/figma-organization-graph.tsx', 'src/components/figma-organization/figma-organization-model.ts'], preview: 'page',
    locations: [{ page: 'organization-figma', label: 'A 拓扑结构 / 组员名录', href: '/organization/figma#figma-canvas' }],
  },
  {
    id: 'figma-organization-actions', name: '组织与人员操作弹窗', symbol: 'FigmaOrganizationDialog', category: 'overlay', kind: '业务组件',
    description: '新增与重命名业务组、录入与编辑人员、组间调岗和离职确认，仅更新页面内存。',
    sources: ['src/components/figma-organization/figma-organization-dialog.tsx', 'src/components/figma-organization/figma-organization-model.ts'], preview: 'page',
    locations: [{ page: 'organization-figma', label: 'A 拓扑结构 / 节点操作按钮', href: '/organization/figma#figma-canvas' }],
  },
  {
    id: 'button', name: '按钮', symbol: 'Button', category: 'interaction', kind: '基础组件',
    description: '主要、描边、轻量、图标及禁用状态。',
    sources: ['src/components/ui/button.tsx'], preview: 'live',
    locations: [{ page: 'portal', label: '门户首页 / 系统卡片', href: '/#systems' }, { page: 'people', label: '人员分配 / 工具栏', href: '/components/person-picker#people-filters' }],
  },
  {
    id: 'input', name: '输入框', symbol: 'Input', category: 'interaction', kind: '基础组件',
    description: '文本输入、带搜索图标的输入及只读状态。',
    sources: ['src/components/ui/input.tsx'], preview: 'live',
    locations: [{ page: 'portal', label: '门户首页 / 系统搜索', href: '/?panel=search' }, { page: 'people', label: '人员分配 / 门店搜索', href: '/components/person-picker#people-filters' }],
  },
  {
    id: 'badge', name: '标签与状态', symbol: 'Badge', category: 'display', kind: '基础组件',
    description: '分类标签，以及签约、分配等业务状态的组合样式。',
    sources: ['src/components/ui/badge.tsx', 'src/pages/people-page.tsx'], preview: 'live',
    locations: [{ page: 'portal', label: '门户首页 / 超级菜单', href: '/?menu=system' }, { page: 'people', label: '人员分配 / 表格状态', href: '/components/person-picker#people-assignments' }],
  },
  {
    id: 'card', name: '内容卡片', symbol: 'Card', category: 'display', kind: '基础组件',
    description: '卡片标题、内容、标签与操作区。',
    sources: ['src/components/ui/card.tsx'], preview: 'live',
    locations: [{ page: 'portal', label: '门户首页 / 系统矩阵', href: '/#systems' }],
  },
  {
    id: 'table', name: '数据表格', symbol: 'Table', category: 'display', kind: '基础组件',
    description: '表头、数据行、状态列和容器内横向滚动。',
    sources: ['src/components/ui/table.tsx'], preview: 'live',
    locations: [{ page: 'people', label: '人员分配 / 门店分配表', href: '/components/person-picker#store-assignment-panel' }],
  },
  {
    id: 'dialog', name: '对话框', symbol: 'Dialog', category: 'overlay', kind: '基础组件',
    description: '带遮罩、焦点约束、取消与确认操作的浮层。',
    sources: ['src/components/ui/dialog.tsx'], preview: 'live',
    locations: [{ page: 'portal', label: '门户首页 / 门户配置', href: '/?panel=admin' }],
  },
  {
    id: 'dropdown', name: '下拉菜单', symbol: 'DropdownMenu', category: 'overlay', kind: '基础组件',
    description: '菜单触发器、分组、分隔线及键盘选择。',
    sources: ['src/components/ui/dropdown-menu.tsx'], preview: 'live',
    locations: [{ page: 'people', label: '人员分配 / 选框弹层', href: '/components/person-picker#people-owners' }],
  },
  {
    id: 'person-picker', name: '人员选择器', symbol: 'PersonPicker', category: 'business', kind: '业务组件',
    description: '姓名、拼音、首字母、工号、账号搜索；标准、紧凑、只读和历史人员状态。',
    sources: ['src/components/person-picker/person-picker.tsx', 'src/components/person-picker/person-search.ts'], preview: 'live',
    locations: [{ page: 'people', label: '人员分配 / 负责人选框', href: '/components/person-picker#people-owners' }, { page: 'people', label: '人员分配 / 表格紧凑选框', href: '/components/person-picker#people-assignments' }],
  },
  {
    id: 'page-navigation', name: '页面导航与超级菜单', symbol: 'Navigation / MegaMenu', category: 'navigation', kind: '页面组合',
    description: '品牌区、分组导航、超级菜单与手机端折叠菜单。',
    sources: ['src/App.tsx'], preview: 'page',
    locations: [{ page: 'portal', label: '门户首页 / 系统矩阵菜单', href: '/?menu=system' }],
  },
  {
    id: 'hero', name: '主视觉与快捷入口', symbol: 'Hero / QuickEntry', category: 'navigation', kind: '页面组合',
    description: '五个系统的主视觉切换、快捷入口与完整门户布局。',
    sources: ['src/App.tsx'], preview: 'page',
    locations: [{ page: 'portal', label: '门户首页 / 主视觉', href: '/#portal-hero' }],
  },
  {
    id: 'system-search', name: '系统搜索与收藏', symbol: 'SystemSearch / Favorites', category: 'interaction', kind: '页面组合',
    description: '系统和能力搜索、结果空态，以及当前浏览器的本地收藏。',
    sources: ['src/App.tsx', 'src/lib/portal-favorites.ts'], preview: 'page',
    locations: [{ page: 'portal', label: '门户首页 / 系统矩阵', href: '/#systems' }],
  },
  {
    id: 'assignment-tabs', name: '分配筛选与结果统计', symbol: 'AssignmentFilter', category: 'business', kind: '页面组合',
    description: '全部、待分配、已分配切换，与门店搜索、人数和结果空态联动。',
    sources: ['src/pages/people-page.tsx'], preview: 'page',
    locations: [{ page: 'people', label: '人员分配 / 筛选工具栏', href: '/components/person-picker#people-filters' }],
  },
  {
    id: 'portal-account', name: '账号菜单', symbol: 'PortalUserMenu', category: 'navigation', kind: '业务组件',
    description: '示例身份、账号下拉菜单与门户配置入口。',
    sources: ['src/components/portal-user-menu.tsx'], preview: 'page',
    locations: [{ page: 'portal', label: '门户首页 / 右上角账号菜单', href: '/?panel=account' }],
  },
  {
    id: 'portal-login', name: '登录对话框', symbol: 'PortalLoginDialog', category: 'overlay', kind: '业务组件',
    description: '本地示例身份入口；不包含真实密码、认证或业务权限。',
    sources: ['src/components/portal-login-dialog.tsx'], preview: 'page',
    locations: [{ page: 'portal', label: '门户首页 / 示例登录', href: '/?panel=login' }],
  },
  {
    id: 'portal-admin', name: '门户配置面板', symbol: 'PortalAdminPanel', category: 'business', kind: '业务组件',
    description: '导航、超级菜单和系统卡片配置；修改仅保存在页面内存。',
    sources: ['src/components/portal-admin-panel.tsx'], preview: 'page',
    locations: [{ page: 'portal', label: '门户首页 / 门户配置', href: '/?panel=admin' }],
  },
  {
    id: 'portal-menu-editor', name: '菜单内容编辑', symbol: 'PortalMenuContentEditor', category: 'navigation', kind: '业务组件',
    description: '编辑超级菜单的分类、分组、入口与排序，位于门户配置的展开内容标签页。',
    sources: ['src/components/portal-menu-content-editor.tsx'], preview: 'page',
    locations: [{ page: 'portal', label: '门户配置 / 展开内容', href: '/?panel=menus' }],
  },
  {
    id: 'portal-visibility', name: '可见范围编辑', symbol: 'PortalVisibilityEditor', category: 'business', kind: '业务组件',
    description: '继承、公开、隐藏和指定功能资源等展示规则，位于门户配置内。',
    sources: ['src/components/portal-visibility-editor.tsx'], preview: 'page',
    locations: [{ page: 'portal', label: '门户配置 / 系统卡片可见范围', href: '/?panel=cards' }],
  },
  {
    id: 'organization-tree', name: '组织树与人数', symbol: 'OrganizationTree', category: 'navigation', kind: '业务组件',
    description: '组织层级、关联线、展开收起、组织搜索和包含下级的人员数量。',
    sources: ['src/components/organization/organization-controls.tsx', 'src/components/organization/organization-model.ts'], preview: 'page',
    locations: [{ page: 'organization-tree', label: 'C 树表工作台 / 左侧组织树', href: '/organization/tree#organization-tree' }],
  },
  {
    id: 'organization-chart', name: '组织关联图', symbol: 'OrganizationChart', category: 'business', kind: '业务组件',
    description: '细折线与箭头连接组织节点，在树表工作台中展示直属组织关系。',
    sources: ['src/components/organization/organization-chart.tsx', 'src/organization.css'], preview: 'page',
    locations: [{ page: 'organization-tree', label: 'C 树表工作台 / 紧凑关系图', href: '/organization/tree#organization-chart' }],
  },
  {
    id: 'organization-roster', name: '组织人员名册', symbol: 'PersonnelTable / MemberList', category: 'business', kind: '页面组合',
    description: '按组织、在职状态和人员关键词筛选，包含下级开关、表格排序分页与人员名单。',
    sources: ['src/components/organization/organization-controls.tsx', 'src/pages/organization-page.tsx'], preview: 'page',
    locations: [{ page: 'organization-tree', label: 'C 树表工作台 / 人员表格', href: '/organization/tree#organization-roster' }],
  },
  {
    id: 'organization-person', name: '组织人员详情', symbol: 'PersonDetail', category: 'overlay', kind: '业务组件',
    description: '从人员姓名打开档案浮层，查看岗位、职级、直属负责人及组织归属路径。',
    sources: ['src/components/organization/organization-controls.tsx'], preview: 'page',
    locations: [{ page: 'organization-tree', label: 'C 树表工作台 / 点击人员姓名', href: '/organization/tree#organization-roster' }],
  },
  {
    id: 'personnel-management', name: '人员管理工作台', symbol: 'PersonnelManagementPage', category: 'business', kind: '页面组合',
    description: '参考 HTML 的统计卡、组织树、任职状态、人员检索和分页表格，包含账号与入职资料状态及演示操作。',
    sources: ['src/pages/personnel-management-page.tsx', 'src/personnel-management.css', 'src/data/demo-personnel.ts', 'src/components/organization/personnel-management-model.ts'], preview: 'page',
    locations: [{ page: 'organization-personnel', label: 'B 经典结构 / 人员概览', href: '/organization/personnel#personnel-overview' }, { page: 'organization-personnel', label: 'B 经典结构 / 组织与人数', href: '/organization/personnel#personnel-organization' }, { page: 'organization-personnel', label: 'B 经典结构 / 人员列表', href: '/organization/personnel#personnel-roster' }],
  },
] as const satisfies readonly ComponentEntry[]

export type CatalogComponent = typeof componentCatalog[number]
export type CatalogComponentId = CatalogComponent['id']

export function normalizeComponentCategory(value: string | null): ComponentCategoryId | 'all' {
  return componentCategories.find((category) => category.id === value)?.id ?? 'all'
}

export function filterComponentCatalog(query = '', category = 'all'): readonly CatalogComponent[] {
  const activeCategory = normalizeComponentCategory(category)
  const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return componentCatalog.filter((component) => {
    if (activeCategory !== 'all' && component.category !== activeCategory) return false
    const categoryTitle = componentCategories.find((item) => item.id === component.category)?.title ?? ''
    const searchable = [component.name, component.symbol, component.kind, component.description, categoryTitle, ...component.sources, ...component.locations.map((location) => location.label)].join(' ').toLowerCase()
    return keywords.every((keyword) => searchable.includes(keyword))
  })
}

export function componentPreviewHref(component: CatalogComponent): string {
  return `/components?category=${component.category}#${component.id}`
}

export const examplePages = [
  { id: 'portal', title: '门户首页', href: '/', image: '/previews/portal.png', source: 'Home', description: '完整门户、系统入口与配置编辑', sections: [{ label: '顶部导航', href: '/?menu=system' }, { label: '主视觉', href: '/#portal-hero' }, { label: '系统矩阵', href: '/#systems' }, { label: '业务链路', href: '/#workflow' }, { label: '门户配置', href: '/?panel=admin' }] },
  { id: 'people', title: '人员分配', href: '/components/person-picker', image: '/previews/people.png', source: 'Operator', description: '人员选框、状态筛选与数据表格', sections: [{ label: '负责人选框', href: '/components/person-picker#people-owners' }, { label: '筛选工具栏', href: '/components/person-picker#people-filters' }, { label: '分配表格', href: '/components/person-picker#people-assignments' }] },
  { id: 'organization-figma', title: '组织人员 A · 拓扑结构', href: '/organization/figma', image: '/previews/organization-figma.png', source: 'Figma Make', description: '三级组织连线、绩效卡片与人员管理弹窗', sections: [{ label: '画布工具栏', href: '/organization/figma#figma-controls' }, { label: '组织与人员', href: '/organization/figma#figma-canvas' }, { label: '复刻说明', href: '/guide#figma-replica' }] },
  { id: 'organization-personnel', title: '组织人员 B · 经典结构', href: '/organization/personnel', image: '/previews/organization-personnel.png', source: '用户 HTML', description: '人员统计、组织树、账号资料状态与人员表格', sections: [{ label: '人员概览', href: '/organization/personnel#personnel-overview' }, { label: '组织与人数', href: '/organization/personnel#personnel-organization' }, { label: '人员列表', href: '/organization/personnel#personnel-roster' }] },
  { id: 'organization-tree', title: '组织人员 C · 树表工作台', href: '/organization/tree', image: '/previews/organization-tree.png', source: 'HRM / Home', description: '左侧组织树、紧凑关联图与人员表格', sections: [{ label: '组织树', href: '/organization/tree#organization-tree' }, { label: '关联图', href: '/organization/tree#organization-chart' }, { label: '人员表格', href: '/organization/tree#organization-roster' }] },
] as const
