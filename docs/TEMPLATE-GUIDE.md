# 模板导航与说明书

更新日期：2026-08-28。

## 目标

为其他项目提供容易查找的 UI 参考，而不是另一个真实业务后台。原 Home 主界面和人员分配界面保留，模板级导航置于最顶部。

## 界面入口

| 界面 | URL | 内容 |
| --- | --- | --- |
| 说明书 | `/guide` | 界面地图、组件与界面对应表、复用说明 |
| 组件总览 | `/components` | 分类、组件搜索、可操作示例、源码位置和原界面入口 |
| 门户首页 | `/` | Home 主 UI、系统矩阵、搜索、收藏和配置面板 |
| 人员分配 | `/components/person-picker` | 负责人选框、分配筛选、紧凑表格选框 |
| A 拓扑结构 | `/organization/figma` | Figma 源稿三级组织画布、绩效卡片和示例操作弹窗 |
| B 经典结构 | `/organization/personnel` | 人员概览、组织树、账号资料状态与分页表格 |
| C 树表工作台 | `/organization/tree` | 组织树、紧凑关系图、人员表格 |

上述路径均属于 `http://127.0.0.1:5177`。导航使用原生页面链接，支持浏览器前进、后退、刷新和独立打开；没有增加路由依赖。末尾斜线与无斜线解析到同一页面，未知路径保持原有首页回退行为。

顶部“组织人员”按 A 拓扑结构、B 经典结构、C 树表工作台排序。原关系画布和横向层级页面已取消注册，目录不再指向旧地址。说明书 `#organization-variants` 对照三版，`#figma-replica` 单独说明拓扑结构的源稿、交互和数据边界。

## 组件目录

目录源文件：`src/data/template-catalog.ts`。

| 分类 | 数量 | 组件或组合 |
| --- | --- | --- |
| 导航与布局 | 5 | 页面导航与超级菜单、主视觉与快捷入口、账号菜单、菜单内容编辑、组织树与人数 |
| 基础交互 | 3 | Button、Input、系统搜索与收藏 |
| 数据与状态 | 4 | Badge 与状态样式、Card、Table、绩效进度人员卡片 |
| 浮层与反馈 | 5 | Dialog、DropdownMenu、PortalLoginDialog、组织人员详情、组织与人员操作弹窗 |
| 业务组件 | 8 | PersonPicker、分配筛选与统计、门户配置面板、可见范围编辑、组织关联图、组织人员名册、人员管理工作台、Figma 组织连线画布 |

Button、Input、Badge、Card、Table、Dialog、DropdownMenu、PersonPicker 提供可操作或可查看的独立示例。其余目录项通过直达链接展示所属界面，不声称页面内组合已经抽成独立组件。

每个目录项登记 `id`、`name`、`symbol`、`category`、`kind`、`description`、`sources`、`locations` 和 `preview`。说明书、分类计数、搜索和所在界面链接均从这份目录生成。

## 搜索与定位

- 中文名称、组件标识、分类、用途、源码路径和界面位置参与匹配；大小写不敏感，空白分隔的多个关键词需要同时满足。
- `category` 和搜索结果取交集；未知分类回到全部。搜索没有结果时显示空态，并提供清除和返回全部入口。
- `q` 保留当前搜索条件。输入或清除时更新当前 URL，不为每次按键新增历史记录；筛选变更清除旧组件锚点。
- 组件示例使用 `/components?category=business#person-picker` 这样的地址。分类切换保留当前关键词。
- 说明书使用 `#page-map`、`#organization-variants`、`#figma-replica`、`#component-index`、`#reuse-notes`；原界面区域与组件示例使用稳定 ID。
- React 挂载完成后恢复首次访问的锚点；门户首页额外等待配置和示例身份读取完成，确保受可见性条件约束的区域已经出现。仅恢复首次锚点，后续配置修改不重复跳转。滚动偏移为顶部参考导航预留空间。

人员选择器自身的姓名、拼音、首字母搜索仍沿用独立的原有匹配规则，不与目录搜索混用。

## 门户直达参数

| URL | 展示状态 |
| --- | --- |
| `/?menu=system` | 打开系统矩阵超级菜单，手机端同时展开业务导航 |
| `/?panel=search` | 打开系统搜索条 |
| `/?panel=account` | 展开当前示例账号菜单 |
| `/?panel=login` | 打开示例登录对话框 |
| `/?panel=admin` | 打开门户配置的顶部导航标签页 |
| `/?panel=menus` | 打开门户配置的展开内容标签页 |
| `/?panel=cards` | 打开门户配置的系统卡片标签页 |

这些参数只选择初始展示状态，不授予权限。门户配置继续受现有 `canManage` 条件约束；普通入口不带参数时保持原来的关闭状态和默认标签页。

原页面定位点：`portal-navigation`、`portal-hero`、`systems`、`workflow`、`support`、`people-owners`、`people-filters`、`people-assignments`、`store-assignment-panel`。

树表工作台 C 的定位点：`organization-tree` / `organization-chart` / `organization-roster`。

B 的 `personnel-overview` / `personnel-organization` / `personnel-roster` 分别定位统计、组织树和人员列表；窄屏直接进入组织锚点时展开组织面板。

A 的 `figma-header` / `figma-controls` / `figma-canvas` 分别定位业务页头、画布工具栏和组织连线。目录项为 `figma-organization-canvas`、`figma-performance-card`、`figma-organization-actions`，均提供实际页面入口。

## 样式与维护

- `src/index.css` 保留原 Home 样式，不在这里维护模板目录样式。
- `src/template.css` 保留第一轮模板和人员分配适配。
- `src/reference.css` 管理参考导航、说明书、组件总览及必要的叠层适配。参考导航桌面高 52px，手机高 80px。
- `src/organization.css` 管理 C 树表工作台及共享组织组件，不修改 Home 原始样式。组件接口和数据口径见 `docs/ORGANIZATION-UI.md`。
- `src/personnel-management.css` 单独管理 B 经典结构；不直接加载原始 HTML、脚本或全局 CSS。
- `src/figma-organization.css` 管理 A 拓扑结构，以 `.figma-replica`、`.fg-dialog`、`.fg-group-menu` 为边界；不升级或新增依赖。组件与快照独立于 B/C，见 `docs/FIGMA-ORGANIZATION.md`。
- 首页外层使用 `overflow: clip` 保留裁切，同时避免 `overflow: hidden` 创建额外滚动容器、使 sticky 业务导航重复下移。
- 账号菜单窄屏宽度基于实际包含块，避免 `100vw` 包含纵向滚动条后越过左边界。
- `public/previews/` 中的缩略图为本项目浏览器实拍，只含本地示例或 Figma 演示快照。它们用于识别参考界面，不是业务数据或独立页面副本。

新增组件时，在目录中登记分类、真实源码和界面位置。需要可操作示例时，补充 `ComponentPreview` 的对应渲染，不能仅把 `preview` 标为 `live`。新增页面还需在 `template-app.tsx` 的页面映射和顶部导航图标映射中注册，TypeScript 会检查页面 ID 是否完整。

组织版本统一登记在 `organizationVariants`，由 `templatePages`、顶部组织菜单和页内版本切换共用。页面预览仍登记在 `examplePages`，新增截图要放在 `public/previews/`，不能只保存在被忽略的 artifacts 目录。

## 边界

没有增加第三方依赖、后端代理、真实登录、数据库或外部业务请求。示例交互和配置修改只保存在当前页面内存，刷新恢复默认；目录筛选保留在 URL；原首页收藏仍只使用模板自己的 localStorage 键。原 Home、Invest、Operator 和 HRM 未修改或重启。

## 验证

自动检查见 `tests/template-catalog.test.ts`：页面解析、目录分类和锚点、源码文件、内部界面链接、搜索交集、预览图片。组织模型与关联线见 `tests/organization-model.test.ts`。浏览器验证及当前构建结果见 `docs/ACCEPTANCE.md` 的后续验收小节。
