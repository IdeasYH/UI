# 组织人员组件

更新日期：2026-08-28。项目：`E:\Lesson\UIModel`。

当前导航已调整为 A 拓扑结构（原 E）、B 经典结构（原 D）、C 树表工作台（原 A）。旧关系画布、横向层级不再注册路由或展示入口；下方旧版本描述保留作实现历史，不代表当前导航。拓扑结构接口见 `FIGMA-ORGANIZATION.md`，当前入口以 `TEMPLATE-GUIDE.md` 为准。

## 需求与来源

- 延续 `E:\Lesson\ShangYi\Project\Home` 门户的字体、蓝色强调色、轻边框和品牌区。
- 参考 HRM `frontend/src/features/personnel-roster/PersonnelRosterPage.vue`、`personnelRosterApi.ts` 与组织树组件，保留组织层级、下级范围、任职状态和人员列表联动。
- 组织关联线与节点格式参考用户提供的图二：细折线、小箭头、紧凑白色节点、头像和角色信息。
- 本次浏览器的 `http://127.0.0.1:4174/personnel/roster` 停在登录页。实现依据是源码与用户截图，没有登录、读取真实名册或修改 HRM。

## 四个独立页面

| 版本 | 地址 | 主要组成 |
| --- | --- | --- |
| A / 树表工作台 | `http://127.0.0.1:5177/organization/tree` | 左侧组织树、两级紧凑关联图、可排序分页的人员表格 |
| B / 关系画布 | `http://127.0.0.1:5177/organization/canvas` | 纵向完整关系图、当前路径高亮、右侧组织与成员详情 |
| C / 横向层级 | `http://127.0.0.1:5177/organization/horizontal` | 从左到右的组织层级、节点直属成员、下方人员名册 |
| D / 人员管理 | `http://127.0.0.1:5177/organization/personnel` | 参考 HTML 的四项统计、组织树、账号资料状态和分页表格 |

四版共用同一套虚构组织与人员。A/B/C 默认选中鲜花事业部，D 默认展示全部组织的在职人员。顶部模板导航、页内版本链接、说明书和组件目录均可进入，均不是原 HRM 的业务实现。

## 数据口径

`src/data/demo-organization.ts` 定义 13 个组织和 22 名示例人员：20 人在职、1 人待入职、1 人已离职。姓名复用现有虚构 fixture，并通过对象副本设置组织与岗位，不修改原人员选择器数据。

| 对象 | 关键字段 |
| --- | --- |
| Organization | `id`、`parentId`、`name`、`kind`、`code`、`tone`、`managerId` |
| OrganizationPerson | 原 PersonOption 的五个检索字段，加 `organizationId`、`position`、`level`、`status`、`joinedAt`、`office` |
| EmploymentStatus | `active` / `pending` / `departed` |

- 组织树与节点人数按当前任职状态统计自身及全部下级，零人数组织保留。
- 名册的“包含下级组织”开关控制名册范围及状态按钮计数；关闭后只显示当前组织直属人员，不改变组织树的累计口径。
- 名册搜索在组织与任职状态范围内取交集。复用 `person-search.ts`，支持姓名、全拼、首字母、工号和账号，忽略大小写与分隔符；不推断多音字读音。
- 组织树搜索只匹配组织名称或编码，并保留命中的祖先路径；搜索期间自动展开该路径。
- 选中节点改变组织详情和人员列表；折叠包含当前所选节点的分支时，选择回到被折叠的祖先节点。
- 节点展示组织负责人；人员详情中，本人不是组织负责人时显示本组织负责人，本人是负责人时显示上级组织负责人。这只是示例关系，不是 HRM 真实汇报规则。

## 组件接口

组件位于 `src/components/organization/`；A/B/C 组合位于 `src/pages/organization-page.tsx`，D 组合位于 `src/pages/personnel-management-page.tsx`。

| 组件 | 主要参数与职责 |
| --- | --- |
| OrganizationTree | `organizations`、`counts`、`selectedId`、`onSelect`；内部维护组织搜索与折叠状态 |
| OrganizationChart | `organizations`、`people`、`rootId`、`selectedId`、`counts`、`status`、`onSelect`；维护节点与关联线 |
| OrganizationChart 布局参数 | `direction` 为 vertical/horizontal；`appearance` 为 compact/portrait/ledger；`maxDepth` 和 `showToolbar` 控制范围与工具栏 |
| OrganizationStatus / OrganizationSearch | 受控状态按钮和人员查询输入 |
| OrganizationSelector | 切换当前画布根组织；使用现有 DropdownMenu |
| PersonnelTable | `people`、`onPerson`；工号正倒序，每页 6 人，空态与分页边界 |
| MemberList | `people`、`onPerson`；侧边或多列人员列表 |
| PersonDetail | `person`、`organizations`、`people`、`onClose`；只读详情，复用 Dialog 的焦点约束与 Esc 关闭 |

`organization-model.ts` 提供组织路径、下级集合、人数、人员范围、可见节点和折线生成纯函数。接入外部数据前应校验唯一 ID、有效父子关系、无环层级和负责人引用。

## 布局与交互

- 组织层级使用正常 DOM 文档流布局，不引入自由关系编辑器或图形依赖。SVG 仅连接已渲染节点的实际边缘，拐角使用小圆角，末端带箭头。
- ResizeObserver 在节点尺寸、展开范围、视口或缩放改变后重新计算几何；缩放时坐标换回未缩放空间，避免端点错位。
- B/C 提供展开、收起、缩放、还原 100% 和适应宽度。缩放范围 10%–150%，适应宽度最多放大到 120%。小比例用于全局观察，放大后可在画布内滚动查看。
- 手机端工具栏位于画布上方；纵向图初始保持根节点居中。页面本身不横向滚动，宽图和人员表格在各自容器内滚动。
- 表格的隐藏辅助列名由定位容器约束，不能让绝对定位的辅助文本越过滚动边界。
- 所有图标操作提供名称与 title，版本使用原生链接，状态使用按压按钮，范围使用复选框。人员详情支持焦点约束和关闭后的焦点恢复。
- 仅使用现有 `components/ui` 的 Button、Input、Badge、Card、Dialog、DropdownMenu 和 Table，以及现有 Lucide 图标，没有新增第三方包。

## 状态与复用边界

- 选择、搜索、展开、缩放只存在于当前页面内存；刷新或切换页面恢复默认，不写入 localStorage、磁盘或业务服务。
- 姓名、工号、组织、岗位、任职日期和人员关系均为虚构示例，不是生产数据。
- 不包含真实录入、导入、入职安排、离职、开通账号、权限或数据库写入。这些动作不能从 UI 模板直接推断为已实现。
- 复用时可复制组件、纯模型与 `organization.css`，由目标系统提供数据和回调；真实组织权限与人员范围必须由服务端负责。
- TypeScript 的 `allowImportingTsExtensions` 配合现有 `noEmit`，使纯 TS 模型可同时由 Vite 和 Node 原生测试加载，不增加测试运行依赖。

## B 经典结构（原 D）：HTML 人员管理适配

来源为用户提供的 `index.html`。按源文件静态分析保留蓝白色、系统字体、四张统计卡、左侧组织树、九列人员表格、账号/资料徽标及右侧吸附操作列。原文件的 `file:` 浏览器访问被安全策略阻止；没有代理或执行原脚本，浏览器验证针对本项目新实现的 React 页面。

- 复用现有 Button、Card、Input、Badge、DropdownMenu、Table 和 Lucide，不新增第三方依赖，不使用 iframe 或 `dangerouslySetInnerHTML`。
- 共用 13 个虚构组织与 22 名人员；`demo-personnel.ts` 仅通过副本添加虚构账号、资料状态，不复制原稿里注明真实人员的那一行。
- 组织路径、下级集合、状态计数及姓名/拼音/首字母/工号/账号检索复用已有模型。D 的组织搜索仅匹配名称，并保留祖先路径；人数始终包含全部下级。
- 在职、待入职、本月入职、未开通账号四项统计只受组织范围影响，不受列表当前状态或搜索词影响。“未开通账号”只统计在职人员；本月入职只统计固定示例月份 `2026-08` 内的在职人员，界面明确标注示例月份。
- 人员搜索由搜索按钮或 Enter 提交，清空搜索框自动恢复结果；搜索、组织或任职状态改变时回到第一页。每页支持 10/20/50 条；空列表为第 1/1 页，上一页/下一页均禁用。
- 刷新只清除人员关键词并回到第一页，保留组织和任职状态；空态“清除筛选”同时回到全部组织，保留任职状态。
- 待入职列表显示“预计入职日期”；离职入口仅在在职行展示，账号未开通时才展示开通入口。导入、入职、岗位履历、账号开通、离职均只提示演示边界，不改变任何名册/账号，不导入或下载文件。
- 组织列表支持键盘 Tab、Enter/Space、上下方向键、Home/End，以及左右方向键展开/收起。窄屏将组织区域改为可折叠面板，直接访问组织锚点时默认展开；宽表只在自身容器横向滚动。
- 吸附操作列仅占按钮所需的最小宽度；380px 以下收紧按钮文字和单元格内边距，避免三个操作按钮遮住左侧完整姓名。已对三按钮行检查 320/375/390/768/1440px，几何回归证据为 `artifacts/personnel-sticky-column-regression.json`。
- D 的所有选择、输入、分页和提示只存在于当前页面内存。全局搜索跳转现有门户搜索入口，不新增搜索服务。
- 复用文件：`personnel-management-page.tsx`、`personnel-management.css`、`demo-personnel.ts` 以及 `personnel-management-model.ts`，同时需要已有组织模型及基础 UI 组件。

## 验证入口

运行 `npm test` 和 `npm run build`。详细浏览器检查见 `docs/ACCEPTANCE.md` 的“组织人员三版”小节；预览图在 `public/previews/organization-*.png`，桌面与手机截图在 `artifacts/organization-*-desktop.png` / `organization-*-mobile.png`。
