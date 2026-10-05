import { componentReferences, interactionKeywords } from './component-references.ts'
import { reactBitsFavorites } from './react-bits-favorites.ts'
import { uiverseFavorites } from './uiverse-favorites.ts'

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
  { id: 'luminary-card', title: '全息卡片', href: '/examples/luminary-card' },
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
  page: Exclude<TemplatePageId, 'guide'>
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
    id: 'luminary-card', name: '全息卡片定制器', symbol: 'LuminaryCardCustomizer', category: 'display', kind: '页面组合',
    description: '个人收藏：3D 倾斜、金属反光、独立标记视差与纹理；中文配置面板实时调整颜色和内容，支持本地保存、图片上传及 JSON 导入导出。',
    sources: ['src/components/luminary-card/luminary-card.tsx', 'src/components/luminary-card/src/app.js', 'src/components/luminary-card/src/config.js', 'src/components/luminary-card/src/motion.js', 'src/components/luminary-card/src/aurora.js', 'src/components/luminary-card/src/styles.css', 'src/components/luminary-card/workspace.html', 'src/examples/luminary-card-example.tsx', 'src/pages/luminary-card-page.tsx', 'src/pages/luminary-card-page.css'], preview: 'page',
    locations: [{ page: 'luminary-card', label: '全息卡片 / 完整定制器', href: '/examples/luminary-card' }],
  },
  {
    id: 'date-range', name: '日期区间选择', symbol: 'DateRangePicker', category: 'interaction', kind: '基础组件',
    description: '快捷日期点击即确认并关闭；支持上年下年与双月选择，区间无数据的日期保持白色。',
    sources: [...componentReferences['date-range'].files, componentReferences['date-range'].example], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 日期区间选择', href: '/components?category=interaction#date-range' }],
  },
  {
    id: 'color-picker', name: '颜色选择器', symbol: 'ColorPicker', category: 'interaction', kind: '基础组件',
    description: '一条白色 → 彩色 → 黑色渐变滑条，拖动实时选色；保留 24 种标准色、HEX 和自定义颜色。',
    sources: ['src/components/ui/data-controls.tsx', 'src/components/ui/data-controls.css', 'src/components/ui/color-model.ts', 'src/components/data-control-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 颜色选择器', href: '/components?category=interaction#color-picker' }],
  },
  ...uiverseFavorites.map(item => ({
    id: item.id, name: item.name, symbol: item.symbol, category: 'interaction' as const, kind: '基础组件' as const,
    description: item.description,
    sources: [...componentReferences[item.id].files.filter(file => file.startsWith('src/')), componentReferences[item.id].example], preview: 'live' as const,
    locations: [{ page: 'components' as const, label: `组件总览 / ${item.name}`, href: `/components?category=interaction#${item.id}` }],
  })),
  {
    id: 'swatch-color-picker', name: '悬停色板选色器', symbol: 'SwatchColorPicker', category: 'interaction', kind: '基础组件',
    description: 'Uiverse 漫画色板：黑色粗描边与硬阴影，色块悬停放大上移、邻项联动，聚焦显示 COPIED!。',
    sources: [...componentReferences['swatch-color-picker'].files, componentReferences['swatch-color-picker'].example], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 悬停色板选色器', href: '/components?category=interaction#swatch-color-picker' }],
  },
  {
    id: 'upload-progress', name: '文件上传进度', symbol: 'UploadProgress', category: 'display', kind: '基础组件',
    description: '文件名、大小、进度条与百分比，完成后显示勾号；仅本地模拟。',
    sources: ['src/components/ui/data-controls.tsx', 'src/components/ui/data-controls.css', 'src/components/ui/color-model.ts', 'src/components/data-control-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 文件上传进度', href: '/components?category=display#upload-progress' }],
  },
  {
    id: 'status-pills', name: '状态显示', symbol: 'StatusPill', category: 'display', kind: '基础组件',
    description: '不同状态配套文字和背景色：进行中、已完成、高优、默认和停用。',
    sources: ['src/components/ui/data-controls.tsx', 'src/components/ui/data-controls.css', 'src/components/ui/color-model.ts', 'src/components/data-control-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 状态显示', href: '/components?category=display#status-pills' }],
  },
  {
    id: 'statistics', name: '统计数值', symbol: 'StatisticCard', category: 'display', kind: '基础组件',
    description: '突出主数字，附单位和涨跌箭头；上涨红色，下跌绿色。',
    sources: ['src/components/ui/data-controls.tsx', 'src/components/ui/data-controls.css', 'src/components/ui/color-model.ts', 'src/components/data-control-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 统计数值', href: '/components?category=display#statistics' }],
  },
  {
    id: 'timeline', name: '时间轴', symbol: 'Timeline', category: 'display', kind: '基础组件',
    description: '按顺序串联事件，已完成项显示紫色节点与连线；标题、时间和说明由调用方提供。',
    sources: [...componentReferences.timeline.files, componentReferences.timeline.example], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 时间轴', href: '/components?category=display#timeline' }],
  },
  {
    id: 'collapse-panel', name: '折叠面板', symbol: 'CollapsePanel', category: 'display', kind: '基础组件',
    description: '标题点击展开或收起内容；当前一次只展开一项，适合问答和分组详情。',
    sources: [...componentReferences['collapse-panel'].files, componentReferences['collapse-panel'].example], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 折叠面板', href: '/components?category=display#collapse-panel' }],
  },
  {
    id: 'flex-carousel', name: '弹性图片画廊', symbol: 'FlexCarousel', category: 'display', kind: '基础组件',
    description: 'React Bits JS/CSS 原版：液态视觉、上升入场、点击聚焦和图片标题；需要 WebGL 与明确高度。',
    sources: [...componentReferences['flex-carousel'].files, componentReferences['flex-carousel'].example], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 弹性图片画廊', href: '/components?category=display#flex-carousel' }],
  },
  ...reactBitsFavorites.map(item => ({
    id: item.id, name: item.name, symbol: item.symbol, category: item.category, kind: '基础组件' as const,
    description: item.description,
    sources: [...componentReferences[item.id].files, componentReferences[item.id].example], preview: 'live' as const,
    locations: [{ page: 'components' as const, label: `组件总览 / ${item.name}`, href: `/components?category=${item.category}#${item.id}` }],
  })),
  {
    id: 'segmented-control', name: '分段控件', symbol: 'SegmentedControl', category: 'interaction', kind: '基础组件',
    description: '少量互斥选项切换同一块内容；选中高亮块滑动到目标项，支持方向键。',
    sources: [...componentReferences['segmented-control'].files, componentReferences['segmented-control'].example], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 分段控件', href: '/components?category=interaction#segmented-control' }],
  },
  {
    id: 'switch', name: '开关', symbol: 'ToggleSwitch', category: 'interaction', kind: '基础组件',
    description: '关闭为浅色，开启为绿色，点击即时切换。',
    sources: ['src/components/ui/selection-controls.tsx', 'src/components/ui/selection-model.ts', 'src/components/selection-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 开关', href: '/components?category=interaction#switch' }],
  },
  {
    id: 'rating', name: '半星评分', symbol: 'StarRating', category: 'interaction', kind: '基础组件',
    description: '跟随鼠标预览评分，支持半颗星，点击确认，移出恢复已确认分数。',
    sources: ['src/components/ui/selection-controls.tsx', 'src/components/ui/selection-model.ts', 'src/components/selection-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 半星评分', href: '/components?category=interaction#rating' }],
  },
  {
    id: 'peek-rating', name: '弹出提示评分', symbol: 'PeekRating', category: 'interaction', kind: '基础组件',
    description: 'React Bits JS/CSS 原版：悬停抬升和提示、点击确认整数星级，允许清除。',
    sources: [...componentReferences['peek-rating'].files, componentReferences['peek-rating'].example], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 弹出提示评分', href: '/components?category=interaction#peek-rating' }],
  },
  {
    id: 'search-select', name: '可搜索下拉选框', symbol: 'SearchSelect', category: 'interaction', kind: '基础组件',
    description: '选中高亮并显示勾号；超过 5 项自动支持中文、拼音全拼和首字母即时筛选。',
    sources: [...componentReferences['search-select'].files, componentReferences['search-select'].example], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 可搜索下拉选框', href: '/components?category=interaction#search-select' }],
  },
  {
    id: 'cascader', name: '多级联动选择', symbol: 'Cascader', category: 'interaction', kind: '基础组件',
    description: '单一面板逐级选择省市区；切换上级清除旧下级草稿，选到末级确认。',
    sources: ['src/components/ui/selection-controls.tsx', 'src/components/ui/selection-model.ts', 'src/components/selection-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 多级联动选择', href: '/components?category=interaction#cascader' }],
  },
  {
    id: 'tree-select', name: '树选择', symbol: 'TreeSelect', category: 'interaction', kind: '基础组件',
    description: '勾选父节点带上全部后代，部分选中显示减号，支持展开收起。',
    sources: ['src/components/ui/selection-controls.tsx', 'src/components/ui/selection-model.ts', 'src/components/selection-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 树选择', href: '/components?category=interaction#tree-select' }],
  },
  {
    id: 'system-permissions', name: '角色与组织授权', symbol: 'TopologyWorkspace / allowedFact', category: 'business', kind: '业务组件',
    description: '角色统一配置页面、按钮三态和数据范围，按节点或任职复用；全页及例外、允许并集和动作范围绑定。',
    sources: ['src/components/permissions/topology-workspace.tsx', 'src/components/permissions/topology-model.ts', 'src/topology-authorization.css'], preview: 'page',
    locations: [{ page: 'organization-figma', label: 'A 拓扑结构 / 功能权限入口', href: '/organization/figma#figma-controls' }],
  },
  {
    id: 'figma-organization-canvas', name: '组织授权拓扑', symbol: 'TopologyWorkspace', category: 'business', kind: '业务组件',
    description: '递归组织连线与 L 层级数字，组织和任职点选、授权期间荧光高亮、展开收起与缩放搜索。',
    sources: ['src/components/permissions/topology-workspace.tsx', 'src/topology-authorization.css'], preview: 'page',
    locations: [{ page: 'organization-figma', label: 'A 拓扑结构 / 组织连线画布', href: '/organization/figma#figma-canvas' }, { page: 'organization-figma', label: 'A 拓扑结构 / 画布工具栏', href: '/organization/figma#figma-controls' }],
  },
  {
    id: 'figma-performance-card', name: '任职授权人员卡片', symbol: 'TopologyWorkspace / sources', category: 'display', kind: '业务组件',
    description: '人员卡片对应稳定任职，支持查看当前任职与全部任职合并权限，并解释授权来源。',
    sources: ['src/components/permissions/topology-workspace.tsx', 'src/components/permissions/topology-model.ts'], preview: 'page',
    locations: [{ page: 'organization-figma', label: 'A 拓扑结构 / 组员名录', href: '/organization/figma#figma-canvas' }],
  },
  {
    id: 'figma-organization-actions', name: '组织与人员操作弹窗', symbol: 'TopologyWorkspace / moveOrg', category: 'overlay', kind: '业务组件',
    description: '组织新增、改名与移动，按 HRM 示例角色选人、添加和结束任职、调组；不自动转移业务事实。',
    sources: ['src/components/permissions/topology-workspace.tsx', 'src/components/permissions/topology-model.ts'], preview: 'page',
    locations: [{ page: 'organization-figma', label: 'A 拓扑结构 / 节点操作按钮', href: '/organization/figma#figma-canvas' }],
  },
  {
    id: 'button', name: '按钮', symbol: 'Button', category: 'interaction', kind: '基础组件',
    description: '主要、描边、轻量、图标及禁用状态；蓝色提交、白底取消、提交中旋转防连点、保存成功和红色出错按钮。',
    sources: ['src/components/ui/button.tsx', 'src/components/ui/action-state-button.tsx', 'src/components/ui/action-state-button.css'], preview: 'live',
    locations: [{ page: 'portal', label: '门户首页 / 系统卡片', href: '/#systems' }, { page: 'people', label: '人员分配 / 工具栏', href: '/components/person-picker#people-filters' }],
  },
  {
    id: 'input', name: '输入框', symbol: 'Input', category: 'interaction', kind: '基础组件',
    description: '文本输入、带搜索图标的输入及只读状态；格式错误时显示红色边框和框下错误提示。',
    sources: ['src/components/ui/input.tsx', 'src/components/ui/form-controls.tsx'], preview: 'live',
    locations: [{ page: 'portal', label: '门户首页 / 系统搜索', href: '/?panel=search' }, { page: 'people', label: '人员分配 / 门店搜索', href: '/components/person-picker#people-filters' }],
  },
  {
    id: 'textarea', name: '长文本与字数统计', symbol: 'CountedTextarea', category: 'interaction', kind: '基础组件',
    description: '长文本框右下角实时显示当前字数与上限，最多输入 200 字。',
    sources: ['src/components/ui/form-controls.tsx', 'src/components/form-control-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 长文本与字数统计', href: '/components?category=interaction#textarea' }],
  },
  {
    id: 'radio-cards', name: '卡片式单选框', symbol: 'RadioCards', category: 'interaction', kind: '基础组件',
    description: '带辅助说明的单选卡片，选中显示橙色边框和浅色底，同组只能选中一项。',
    sources: ['src/components/ui/form-controls.tsx', 'src/components/form-control-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 卡片式单选框', href: '/components?category=interaction#radio-cards' }],
  },
  {
    id: 'checkbox-cards', name: '复选框与全选', symbol: 'CheckboxCards / TriStateCheckbox', category: 'interaction', kind: '基础组件',
    description: '支持多选、全选与取消全选；部分选中时全选框显示减号，全部未选时为空框。',
    sources: ['src/components/ui/form-controls.tsx', 'src/components/form-control-previews.tsx'], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 复选框与全选', href: '/components?category=interaction#checkbox-cards' }],
  },
  {
    id: 'prerequisite-action', name: '前置条件提交', symbol: 'PrerequisiteAction', category: 'interaction', kind: '基础组件',
    description: '勾选或下拉选择满足条件后才可提交；禁用按钮下方以虚线引导到前置控件。',
    sources: [...componentReferences['prerequisite-action'].files, componentReferences['prerequisite-action'].example], preview: 'live',
    locations: [{ page: 'components', label: '组件总览 / 前置条件提交', href: '/components?category=interaction#prerequisite-action' }],
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
    const searchable = [component.name, component.symbol, component.kind, component.description, categoryTitle, ...(interactionKeywords[component.id] ?? []), ...component.sources, ...component.locations.map((location) => location.label)].join(' ').toLowerCase()
    return keywords.every((keyword) => searchable.includes(keyword))
  })
}

export function componentPreviewHref(component: CatalogComponent): string {
  return `/components?category=${component.category}#${component.id}`
}

export const examplePages = [
  { id: 'luminary-card', title: '全息卡片定制器', href: '/examples/luminary-card', image: '/previews/luminary-card.jpg', source: '个人收藏 / Luminary Card', description: '全息材质、3D 视差与实时定制面板', sections: [{ label: '实时定制', href: '/examples/luminary-card#luminary-card-preview' }, { label: '来源与说明', href: '/examples/luminary-card#luminary-card-notes' }] },
  { id: 'portal', title: '门户首页', href: '/', image: '/previews/portal.png', source: 'Home', description: '完整门户、系统入口与配置编辑', sections: [{ label: '顶部导航', href: '/?menu=system' }, { label: '主视觉', href: '/#portal-hero' }, { label: '系统矩阵', href: '/#systems' }, { label: '业务链路', href: '/#workflow' }, { label: '门户配置', href: '/?panel=admin' }] },
  { id: 'people', title: '人员分配', href: '/components/person-picker', image: '/previews/people.png', source: 'Operator', description: '人员选框、状态筛选与数据表格', sections: [{ label: '负责人选框', href: '/components/person-picker#people-owners' }, { label: '筛选工具栏', href: '/components/person-picker#people-filters' }, { label: '分配表格', href: '/components/person-picker#people-assignments' }] },
  { id: 'organization-figma', title: '组织人员 A · 拓扑结构', href: '/organization/figma', image: '/previews/organization-figma.png', source: 'Figma Make', description: '组织拓扑、可复用角色与荧光授权预览', sections: [{ label: '画布工具栏', href: '/organization/figma#figma-controls' }, { label: '组织与人员', href: '/organization/figma#figma-canvas' }, { label: '复刻说明', href: '/guide#figma-replica' }] },
  { id: 'organization-personnel', title: '组织人员 B · 经典结构', href: '/organization/personnel', image: '/previews/organization-personnel.png', source: '用户 HTML', description: '人员统计、组织树、账号资料状态与人员表格', sections: [{ label: '人员概览', href: '/organization/personnel#personnel-overview' }, { label: '组织与人数', href: '/organization/personnel#personnel-organization' }, { label: '人员列表', href: '/organization/personnel#personnel-roster' }] },
  { id: 'organization-tree', title: '组织人员 C · 树表工作台', href: '/organization/tree', image: '/previews/organization-tree.png', source: 'HRM / Home', description: '左侧组织树、紧凑关联图与人员表格', sections: [{ label: '组织树', href: '/organization/tree#organization-tree' }, { label: '关联图', href: '/organization/tree#organization-chart' }, { label: '人员表格', href: '/organization/tree#organization-roster' }] },
] as const
