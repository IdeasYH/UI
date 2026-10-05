# 模板导航与说明书

UIModel 为其他项目提供界面、交互和组件参考，使用本地示例数据。阅读顺序是：识别交互结构 → 选用组件 → 阅读契约与真实示例 → 接入目标业务 → 验证迁移。

## 从哪里开始

| 当前任务 | 阅读入口 | 完成条件 |
| --- | --- | --- |
| 新页面、未列举的业务、搜索没有命中 | [通用复用方法](UI-REUSE.md) | 明确值形状、层级、确认时机、依赖及邻近模式 |
| 需要 React Bits 收藏的动效组件 | [收藏组件选型](REACT-BITS-FAVORITES.md) | 按导航、输入、反馈和展示寻找原型，继续读单项契约和源码 |
| 需要 Uiverse 收藏的动效、菜单、表单、状态或色板 | [Uiverse 收藏组件选型](UIVERSE-FAVORITES.md) | 按交互结构和状态选型，继续读原作、契约和真实示例 |
| 平铺选项中选择一个值 | [SearchSelect 契约](components/search-select.md) | 清楚数据映射、过滤与选择提交的边界 |
| 选择连续日期期间 | [DateRangePicker 契约](components/date-range.md) | 分清显示月份、草稿、已确认值和数据标记 |
| 多项条件决定动作是否可用 | [PrerequisiteAction 契约](components/prerequisite-action.md) | 条件有稳定 ID，宿主判定与 UI 引导职责清楚 |
| 查看完整页面组合 | 本文界面入口与组件目录 | 找到组合内实际实现及可独立复用的部分 |
| 增加组件或页面 | 本文维护约定 | 目录、真实示例、说明、路由和验证一起更新 |

城市、报名、订单和组织只是演示映射。未列举的业务同样应先按交互结构主动参考；组件也可以组合。结构不匹配时明确能力缺口，不能把演示文案换名当作完成适配。

网站 `/guide` 展示通用复用方法、React Bits 和 Uiverse 收藏选型，组件详情展示对应契约；`src/examples/` 中的 TSX 是实际参与编译的最小调用示例。网站展示这些文件，文档不另维护一份示例代码。

## 界面入口

| 界面 | URL | 内容 |
| --- | --- | --- |
| 说明书 | `/guide` | 通用复用方法、选型入口、界面地图与组件索引 |
| 组件总览 | `/components` | 分类、搜索、可操作示例、使用契约与源码位置 |
| 门户首页 | `/` | Home 主 UI、系统矩阵、搜索、收藏和配置面板 |
| 人员分配 | `/components/person-picker` | 负责人选框、分配筛选、紧凑表格选框 |
| A 拓扑结构 | `/organization/figma` | 组织与任职拓扑、角色复用、授权分配和示例权限试用 |
| B 经典结构 | `/organization/personnel` | 人员概览、组织树、账号资料状态与分页表格 |
| C 树表工作台 | `/organization/tree` | 组织树、紧凑关系图、人员表格 |

上述路径属于 `http://127.0.0.1:5177`。导航使用原生页面链接，支持浏览器前进、后退、刷新和独立打开；没有增加路由依赖。末尾斜线与无斜线解析到同一页面，未知路径保持首页回退行为。

顶部“组织人员”按 A 拓扑结构、B 经典结构、C 树表工作台排序。原关系画布和横向层级页面已取消注册，目录不再指向旧地址。说明书 `#organization-variants` 对照三版，`#figma-replica` 说明 A 的拓扑交互和数据边界。

A 的当前规则以 [组织权限说明书](ORGANIZATION-PERMISSIONS-BDD.md) 为准；Figma 源稿与沿革见 [FIGMA-ORGANIZATION.md](FIGMA-ORGANIZATION.md)。B/C 的数据与组件接口见 [ORGANIZATION-UI.md](ORGANIZATION-UI.md)。

## 组件目录

目录源为 `src/data/template-catalog.ts`。分类与数量由目录生成，本文只说明分类用途。

| 分类 | 内容 |
| --- | --- |
| 导航与布局 | 页面导航与超级菜单、主视觉与快捷入口、账号菜单、菜单内容编辑、组织树与人数 |
| 基础交互 | 按钮、输入、长文本、单复选、前置条件、开关、评分、搜索下拉、级联、树、日期、颜色、系统搜索与收藏 |
| 数据与状态 | 标签、卡片、表格、人员卡片、上传进度、状态显示、统计数值 |
| 浮层与反馈 | 对话框、下拉菜单、登录演示、人员详情、组织与人员操作弹窗 |
| 业务组件 | 人员选择、分配筛选与统计、门户配置、可见范围、组织关联图、人员名册、人员工作台、角色与组织授权 |

目录标为 `live` 的项由 `ComponentPreview` 渲染示例；标为 `page` 的项通过入口展示所属界面。页面组合不自动等于可独立复制的组件。已有复用包提供详细契约、真实最小示例和复制文件说明，React Bits 和 Uiverse 收藏组件也按同一约定接入；未登记复用包的条目仍需继续核对实现。

公共目录登记组件标识、名称、分类、种类、描述、源码、所在界面和预览方式；说明入口、搜索词和复制清单按实际条目提供。源码位置用于定位，跨项目复制按对应契约检查文件与传递依赖。

组件总览的每张卡片均显示稳定 ID，点击 ID 可直接复制给其他 agent。该 ID 同时用于搜索和 `#` 页面锚点；有复用包的组件还可用 `/references/{ID}.json` 取得同源源码。既有 ID 保持不变以确保旧链接有效；新增 ID 应表达用途或外观，而不是仅用来源站点的随机 slug。

## 搜索、分类与定位

- 中文名称、组件标识、分类、描述、源码路径、界面位置及目录提供的用途关键词参与匹配；大小写不敏感，空白分隔的多个关键词需要同时满足。
- `category` 和搜索结果取交集；未知分类回到全部。无结果时先清除分类或减少关键词，再按 [搜索未命中时的步骤](UI-REUSE.md) 找邻近交互。
- `q` 保留搜索条件，输入或清除时更新当前 URL，不为每次按键增加历史记录；筛选变更清除旧组件锚点。分类切换保留当前关键词。
- 组件示例使用 `/components?category=business#person-picker` 这样的地址。已有说明书锚点为 `#page-map`、`#organization-variants`、`#figma-replica`、`#component-index`、`#reuse-notes`。
- React 挂载完成后恢复首次访问的锚点；门户额外等待配置和示例身份读取完成。后续配置修改不重复跳转，滚动偏移为顶部参考导航预留空间。

人员选择器内部的姓名、拼音、首字母匹配独立于目录搜索，具体数据接口见 [PERSON-PICKER.md](PERSON-PICKER.md)。

## 交互参考：从组件到规则

### 输入、选择与前置条件

- `#input`：`ValidatedInput` 接受调用方传入的错误信息，关联 `aria-invalid` 和错误描述。邮箱示例展示空值和格式错误；该正则只是演示，不代表服务端邮箱有效性校验。旁置标签在输入聚焦时显示绿色虚线边框与浅绿底，失焦恢复。
- `#textarea`：`CountedTextarea` 显示长度与上限，`maxLength` 默认 200、可传入。计数与浏览器同用 UTF-16 口径，空格和换行计入，部分 emoji 占两个单位；输入区底部为计数预留空间。
- `#radio-cards`：`RadioCards` 使用原生同名单选组，支持键盘方向键；晚场是演示默认值，业务默认值由调用方确定。
- `#checkbox-cards`：`CheckboxCards` 支持独立选择、全选和取消；`TriStateCheckbox` 用原生 `indeterminate` 表示半选。示例学员均为虚构数据。
- `#prerequisite-action`：单项或多项条件决定动作是否可用；缺失项各有虚线，满足后对应线消失，撤销后恢复。条件判定、提示和真实动作的接入见 [前置条件契约](components/prerequisite-action.md)。

表单实现位于 `src/components/ui/form-controls.tsx`，演示组合位于 `src/components/form-control-previews.tsx`。输入错误、选择值和条件判断由调用方负责；同意条款与批量勾选是不同状态，组合时分别维护。

### 提交、保存与反馈

在 `/components?category=interaction#button` 查看独立状态。`FormActionButton action="submit"` 默认是表单提交按钮，`action="cancel"` 默认是普通按钮；展示蓝底白字提交和白底蓝边取消。

`src/components/ui/action-state-button.tsx` 的 `ActionStateButton` 接受 `state="submitting" | "success" | "error"`，`ActionStateNotice` 展示对应提示条。提交中持续旋转并禁用，成功显示“保存成功”，错误单独显示“出错了”。错误使用 1.8 秒透明度动画，无光晕；减少动态效果设置会停止闪烁。请求及状态切换由调用方提供；目录固定展示状态，不执行真实提交。

### 开关、评分、搜索和层级选择

实现位于 `src/components/ui/selection-controls.tsx`，演示位于 `src/components/selection-previews.tsx`。

- `#switch`：关闭浅色、开启绿色，使用按钮的 switch 语义，支持原生键盘激活。
- `#rating`：半星一步，悬停预览、点击确认、移出恢复；Tab 可访问半星目标，空格或回车确认。
- `#peek-rating`：React Bits 的整数星级动效，悬停抬升并显示等级；再次点击当前分数可清空。依赖及复制边界见 [PeekRating 契约](components/peek-rating.md)。需要半星时使用上面的 `StarRating`。
- `#segmented-control`：少量互斥选项即时切换同一区域内容，高亮底块滑动，方向键/Home/End 可操作；选型与接口见 [分段控件契约](components/segmented-control.md)。
- `#search-select`：平铺单值选择，总选项超过五项时提供本地搜索，选中高亮与勾号。数据契约、关闭与键盘边界见 [SearchSelect 契约](components/search-select.md)。
- `#cascader`：一个面板按层级展开多列；切换上级截断旧下级草稿，到叶子才确认关闭；未完成选择保留外部已确认值。支持任意层级，省市区是节选演示，不是完整区划数据。
- `#tree-select`：存储叶子 ID，父节点状态由后代推导；父级勾选/取消影响全部后代，部分选择显示减号，折叠不清除选择。虚构组织可以换成同样语义的分类树，不能据此推断支持父级独立选值。

### 日期、颜色与数据展示

- `#luminary-card`：个人收藏的全息卡片定制器，完整页面位于 `/examples/luminary-card`。保留原版卡面材质、独立 3D 标记、六组中文配置面板、图片上传和 JSON 导入导出；配置以 `uimodel:luminary-card:v1` 存入本来源的 localStorage，已有配置格式保持兼容。使用及来源见 [收藏说明](components/luminary-card.md)，该完整页面不加入自动组件源码下载包。

- `#date-range`：双月选择，月份导航与区间确认分离，快捷区间直接确认并关闭；首尾描边，区间内有数据才填色。日期口径、受控值、复制清单及边界见 [日期契约](components/date-range.md)。
- `#color-picker`：一条白色 → 彩色 → 黑色滑条，拖动同步 HEX 和色块；保留三行共 24 种标准色、方向键、选中勾号、HEX 校验及系统颜色面板。单轴表示常用色路径，并非全部颜色空间；路径外颜色通过 HEX 或系统面板精确输入，组件保留精确值，只把滑块指示到最近位置。渐变节点与取色插值共用 `color-model.ts`，调整配色时应同步保持视觉与取色一致。
- `#swatch-color-picker`：按 Uiverse `chase2k25/witty-squid-83` 还原漫画色板，黑边硬阴影、紧密色块、悬停放大上移及邻项联动；聚焦显示原版 `COPIED!` 气泡，实际复制结果由示例状态报告。选型与复制清单见 [固定色板契约](components/swatch-color-picker.md)。
- `#upload-progress`：显示文件名、类型、大小、百分比与完成勾号。演示定时推进进度；选择文件只取得名称和大小，不读取或上传内容，卸载清理定时器。真实上传需宿主提供进度和结果。
- `#status-pills`：进行中、已完成、高优、默认和停用分别使用配套文字与背景。业务状态含义由目标系统定义。
- `#statistics`：主数字最大、单位较小，涨红跌绿并带箭头；这些是演示值与视觉约定，业务计算及颜色语义由目标系统确认。
- `#collapse-panel`：标题点击展开、切换或收起；当前只保留一项展开，适合问答与长详情。见 [折叠面板契约](components/collapse-panel.md)。
- `#timeline`：按给定顺序与已完成数展示事件，时间由调用方提供；示例的进度按钮只操作本地演示。见 [时间轴契约](components/timeline.md)。
- `#flex-carousel`：React Bits 原版 WebGL 图片画廊；三张图片与 560px 高度组成真实示例，鼠标、键盘和标题随原版源码工作。复制时带 `ogl` 和图片，见 [画廊契约](components/flex-carousel.md)。

日期模型位于 `src/components/ui/date-range-model.ts`；其余数据控件位于 `src/components/ui/data-controls.tsx`，展示组合位于 `src/components/data-control-previews.tsx`。

## 门户直达参数和页面锚点

| URL | 展示状态 |
| --- | --- |
| `/?menu=system` | 打开系统矩阵超级菜单，手机端同时展开业务导航 |
| `/?panel=search` | 打开系统搜索条 |
| `/?panel=account` | 展开当前示例账号菜单 |
| `/?panel=login` | 打开示例登录对话框 |
| `/?panel=admin` | 打开门户配置的顶部导航标签页 |
| `/?panel=menus` | 打开门户配置的展开内容标签页 |
| `/?panel=cards` | 打开门户配置的系统卡片标签页 |

参数只选择初始展示状态，不授予权限；配置仍受现有 `canManage` 条件约束。普通入口不带参数时保持原关闭状态和默认标签页。

| 页面 | 定位点及行为 |
| --- | --- |
| 门户与人员分配 | `portal-navigation`、`portal-hero`、`systems`、`workflow`、`support`、`people-owners`、`people-filters`、`people-assignments`、`store-assignment-panel` |
| A 拓扑结构 | `figma-header`、`figma-controls`、`figma-canvas`；目录包含画布、人员卡片和组织操作入口 |
| B 经典结构 | `personnel-overview`、`personnel-organization`、`personnel-roster`；窄屏直达组织锚点会展开组织面板 |
| C 树表工作台 | `organization-tree`、`organization-chart`、`organization-roster` |

## 样式归属和维护约定

- `src/index.css` 保留 Home 样式；`src/template.css` 管理模板和人员分配适配。
- `src/reference.css` 管理参考导航、说明书和组件总览；参考导航桌面高 52px，手机高 80px。
- `src/organization.css` 管理 C 与共享组织组件；`src/personnel-management.css` 单独管理 B。
- A 当前授权工作台主要使用 `src/topology-authorization.css`；Figma 源稿相关样式保留在 `src/figma-organization.css`，其隔离边界为 `.figma-replica`、`.fg-dialog`、`.fg-group-menu`。
- 组件局部样式按各自契约复制。网站参考层与演示排列样式不自动属于组件运行依赖。
- 首页外层使用 `overflow: clip` 保留裁切，避免额外滚动容器影响 sticky 导航；账号菜单窄屏宽度基于实际包含块，避免 `100vw` 包含滚动条造成越界。
- `public/previews/` 的缩略图是本项目浏览器实拍，只用于识别参考界面；不代表业务数据，也不是独立页面副本。

增加或修改组件时，同步目录、真实源码、说明和使用示例。标记 `live` 前必须接入 `ComponentPreview` 的实际渲染。详细复用契约和 TSX 示例分别维护一份，网站直接读取；接口变化同时检查两者。

新增页面还需登记 `template-app.tsx` 的页面映射及顶部导航图标映射。组织版本统一登记 `organizationVariants`；预览页登记 `examplePages`，图片进入 `public/previews/`，不只放在被忽略的 artifacts 目录。

## 数据、存储和验证边界

基础控件、人员分配、门户登录及配置演示主要存在当前页面内存。A 拓扑的组织与授权配置使用本标签页 sessionStorage，刷新可恢复；首页收藏使用模板来源下的 localStorage；目录筛选保留在 URL。这些边界不同，不能统一假定刷新都会清空。

默认运行没有后端代理、真实身份认证、数据库或外部业务请求。服务端授权、业务数据和持久化在目标系统接入。本项目不会因展示组件而修改或重启 Home、Invest、Operator 或 HRM。

目录、链接和源码检查见 `tests/template-catalog.test.ts`；模型规则见对应模型测试。迁移完成标准见 [UI-REUSE.md](UI-REUSE.md)，实际运行结果与浏览器证据集中写入 [ACCEPTANCE.md](ACCEPTANCE.md)，不从本文推断当前构建或验收已通过。
