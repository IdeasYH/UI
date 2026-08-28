# A 拓扑结构组件

日期：2026-08-28。页面：`/organization/figma`，顶部“组织人员”菜单的 A 拓扑结构（原 E）。

## 来源

- Figma Make 文件：[组织人员管理 UI 风格](https://www.figma.com/make/0X5G3BUQm9KbfgG04Uk1Qz)。
- 用户提供的发布页：[源稿预览](https://camp-wager-77450206.figma.site)。
- 用户授权操作 Chrome，在代码面板的文件列表上方点击“下载代码”。原始附件名为 `组织人员管理UI风格.zip`，大小 914246 字节；原始 ZIP 与个人下载路径不纳入仓库。
- 原始 ZIP SHA256：`FBC43B56EA88C1B9DE98AEDFB7AD9B370C955FF20CB1562DD27368688F51BA5F`。
- 只解压检查了 `src/` 和包/构建配置到本项目 `.runtime/figma-make-source/`。没有执行导出包的安装、构建或附带脚本，没有修改 Figma 原文件。
- 实际使用源稿的 `TopHeader.tsx`、`VisualOrgGraph.tsx`、`OrgActionModals.tsx`、`AddEmployeeModal.tsx`、`App.tsx` 及 `mock/demoData.ts`。未复制未挂载的旧版本页面、参考截图、包锁或工程工具文件。

## 复刻与适配

保留双行业务页头、网点画布、480px 部门经理节点、约 350.8px 的五列业务组、三级连线、绩效进度底色、头像字标、工号职级和节点操作。源稿规定的 16px 节点圆角和色彩仅用于此页，不改变 Home 或其他组织页面。

不是未改动源码的嵌入，也不宣称逐像素完全相同。必要适配如下：

- 保留模板最顶部的统一导航；冗长的展示说明移入说明书，页内保留业务标题与标签，示例身份不冒充真实登录。
- 将 Tailwind 工具类转为独立 CSS，使用既有 Button、Card、Input、Dialog、DropdownMenu 和 Lucide；没有引入依赖或升级框架。
- 源稿搜索为展示文本，管理操作为 `alert` / `confirm` 提示；本页搜索和操作会实际改变当前页面的演示状态。
- 新增适应画布、滚轮平移、Ctrl/Command + 滚轮缩放、方向键平移、Home 复位以及触摸拖动。缩放范围为 10%-140%，便于小屏查看全图；源稿最低为 60%。
- 小屏打开或窗口明显缩放时，自动将部门节点定位到可见范围。弹窗引起滚动条显隐时保持画布缩放和位移。
- 图标使用已有 Lucide 版本，部分图形与源稿自绘 SVG 有细微区别。原稿界面本身不使用图片头像，无新增外部图片请求。

## 模块接口

| 文件 | 职责 |
| --- | --- |
| `src/pages/figma-organization-page.tsx` | 业务页头、搜索、内存数据、操作通知与弹窗入口 |
| `src/components/figma-organization/figma-organization-graph.tsx` | `FigmaOrganizationGraph`、成员卡、绩效标签、展开与画布视图 |
| `src/components/figma-organization/figma-organization-dialog.tsx` | 组织和人员操作表单，使用现有焦点管理与下拉组件 |
| `src/components/figma-organization/figma-organization-model.ts` | 纯函数：搜索、校验、增改调离、缩放和适应计算 |
| `src/data/figma-organization.ts` | Figma 导出包的演示快照，与原有组织模型无耦合 |
| `src/figma-organization.css` | 隔离样式，弹窗和菜单也有单独作用域 |

`FigmaOrganizationGraph` 接收 `department`、搜索后的 `groups`、`query`、`onClearSearch` 和 `onAction`。图形内部仅维护视图状态，不写业务数据。

`FigmaOrganizationDialog` 接收 `department`、`action`、`onClose`、`onConfirm`。确认回调返回错误字符串时保留表单并显示错误；成功由父页面更新数据并关闭弹窗。取消、Escape 和遮罩关闭均不提交。

`applyFigmaAction(department, action)` 返回 `{ department, error }`，不修改输入对象。出错时返回原对象。动作包括新增/重命名组、新增/编辑成员、调岗、离职。UI 表单不直接改数组。

## 数据约定

- 源稿一个部门、五个业务组、36 人汇总，另有 15 条成员展示节选。36 不等于渲染的成员行数，也不从 15 条节选重算；组长、经理和成员节选不是完整人员库。
- 新增成员增加部门及所在组汇总各 1；调岗保持部门总数，源组减 1、目标组加 1；确认离职减 1。拒绝重复工号、空白必填字段、无效组织、同组调岗、重复组名和重复离职。
- 新业务组的组长为空，显示“待指定组长”；新增成员无绩效，`kpiRate: null`，显示“待统计”。没有推断入职日期、真实账号或权限。
- 完成率 `>=90` 为优秀，`>=75 && <90` 为良好，`<75` 为预警。空值/无效值不按零绩效展示。
- 本页搜索姓名、工号、组织名和已有登录账号，忽略大小写及空白。登录账号中的字母来自源快照，不推导新人员拼音或首字母；完整拼音选择功能仍使用原有 PersonPicker。
- 编辑、调岗、离职仅作用于节选组员。组长和经理作为源稿上下文展示，不提供没有定义的任命流程。
- 所有状态仅保存在当前页面内存，刷新/离开后恢复；页底恢复按钮重置示例数据。没有 localStorage、真实 API、HRM 登录或业务写入。

接入其他系统时，由目标系统提供完整的组织和名册口径、服务端校验与权限、真实数据持久化；不能把演示总数或示例管理员用于业务授权。

## 导航与验证

说明书位置：`/guide#figma-replica`。组件目录新增组织连线画布、绩效人员卡片、组织人员操作弹窗三个入口。页面定位点：`figma-header`、`figma-controls`、`figma-canvas`。

已有测试位于 `tests/figma-organization.test.ts`。本次按照用户要求停止扩展测试和验收，仅做必要构建检查；不新增独立验收报告。
