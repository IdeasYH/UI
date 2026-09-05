# 尚毅前端 UI 模板

本项目用于为后续系统提供界面与组件参考，不承载真实业务。

## 代码仓库

目标仓库：[IdeasYH/UI](https://github.com/IdeasYH/UI)，Git 地址为 `https://github.com/IdeasYH/UI.git`，首次上传使用 `main` 分支。

版本控制包含源码、测试、文档、包锁和 `public/previews/` 预览图片；不包含 `node_modules/`、`dist/`、`.runtime/`、`artifacts/`、日志、本地环境变量或私钥文件。示例环境模板可纳入版本控制，但只能使用无敏感信息的占位值。

源码上传不会自动部署网站，也不会改变本地服务或业务系统；在其他机器上按下方命令安装依赖和启动。

## 预览与启动

- 说明书：<http://127.0.0.1:5177/guide>
- 组件总览：<http://127.0.0.1:5177/components>
- 主界面：<http://127.0.0.1:5177/>
- 人员选择：<http://127.0.0.1:5177/components/person-picker>
- 组织人员 A / 拓扑结构：<http://127.0.0.1:5177/organization/figma>
- 组织人员 B / 经典结构：<http://127.0.0.1:5177/organization/personnel>
- 组织人员 C / 树表工作台：<http://127.0.0.1:5177/organization/tree>
- 本地入口文件：`E:\Lesson\UIModel\index.html`。这是 Vite 入口，需要通过开发或预览服务访问，不是可直接双击运行的独立 HTML。

```powershell
npm ci
npm run dev
```

默认只监听 `127.0.0.1:5177`，端口占用时会退出，不会停止其他服务。需要其他端口时使用 `npm run dev -- --port 5178`。

```powershell
npm test
npm run typecheck
npm run build
npm run preview -- --port 5178
```

本机验证环境为 Node.js 24.14.1。保留 Home 的 React、TypeScript、Vite 和 Lucide 依赖及锁定版本，没有引入额外第三方包。

## 浏览模板

最顶部常驻独立的模板导航：说明书、组件总览、门户首页、人员分配、组织人员。组织人员按 A 拓扑结构、B 经典结构、C 树表工作台排序。原 B 关系画布和 C 横向层级已从路由、导航、界面地图和组件入口移除。保留页面的 URL 不变。

- 说明书展示五个参考界面的真实缩略图、组织版本对照、区域入口和组件位置对应表，可按中文名称、组件名、用途或界面搜索。
- 组件总览按导航与布局、基础交互、数据与状态、浮层与反馈、业务组件五类组织，共 25 项组件与页面组合。
- 8 个基础或业务控件提供可操作示例；复杂页面组合提供原界面直达入口，不复制一份独立业务实现。
- 每个目录项包含源码位置与所在界面链接。分类、搜索条件和组件锚点均可通过 URL 保留。
- 首页的搜索、账号、登录和门户配置可直接打开；菜单编辑和可见范围入口会选中对应配置标签页。

目录定义、深链接约定和后续扩展方式见 [模板导航与说明书](docs/TEMPLATE-GUIDE.md)。

## 来源与改动边界

| 内容 | 来源 | 本项目处理 |
| --- | --- | --- |
| 首页导航、主视觉、系统卡片、业务链路、支持区、门户编辑界面 | `E:\Lesson\ShangYi\Project\Home\src` | 直接复制前端源码，替换真实服务访问，增加人员选择入口 |
| 首页原始样式 | `Home\src\index.css` | 原文件保留，模板适配集中在 `src/template.css` |
| 五个系统及菜单内容 | `Home\portal-content.json` | 保存为本地快照，默认业务链接改到模板内部 |
| 人员选择器结构与搜索规则 | `Invest\Intake\operator\frontend\src\operator\operator-assignee-combobox.tsx` | 抽为独立 `PersonPicker`，保留外观和字段匹配规则 |
| 弹层与基础控件 | 两个来源项目的 `components/ui` | 保留 Button、Input、Card、Dialog、DropdownMenu、Table 的使用方式；选择器的工具类转为独立 CSS |
| 模板参考导航、说明书和组件目录 | 本项目新增 | 独立于业务页面，统一维护分类与界面位置 |
| 组织与人员层级、下级人数口径 | `HRM\frontend\src\features\personnel-roster\` 及用户截图 | 参考结构与交互，改为 13 个虚构组织、22 名示例人员，不读取真实 HRM |
| 组织关联线与节点格式 | 用户提供的图二 | 细折线、小箭头、紧凑节点；三种布局沿用门户字体和配色 |
| B 经典结构（原 D） | 用户提供的 `index.html` | 保留蓝白配色、统计卡、组织树、人员表格和吸附操作列；改用现有虚构名册与 UI 组件，未复制原稿中的真实人员行 |
| A 拓扑结构（原 E） | 用户授权从 Chrome 下载的 Figma Make 源码 ZIP | 保留三级连线、节点几何、绩效底色和源稿演示快照；复用本项目 UI 组件，新增可操作的内存示例；未修改 Figma 原文件 |

模板适配包括固定字号档位、正常字间距、窄屏宽度与导航滚动、完整键盘选择，以及收藏刷新恢复。没有修改、重启原 Home、Invest、Operator 或 HRM。

更新来源配置快照后，可运行 `node scripts/localize-config.mjs` 将快照内的外部默认链接改为模板入口；该脚本只处理本项目的 `src/data/portal-config.json`。

## 目录

```text
src/
  template-app.tsx                 # 页面注册和共享顶部导航
  reference.css                    # 参考层样式、双层导航与锚点偏移
  App.tsx                         # Home 主界面副本
  index.css                       # Home 原始样式
  template.css                    # 模板适配与人员示例页样式
  organization.css                # C 树表工作台及共享组织组件样式
  personnel-management.css         # B 经典结构的隔离样式
  figma-organization.css            # A 拓扑结构的隔离样式
  components/
    template-navigation.tsx        # 常驻顶部导航
    catalog-navigation.tsx         # 分类与目录搜索
    component-previews.tsx         # 可操作组件示例
    person-picker/                # 可复用人员选择器及纯搜索函数
    organization/                 # 组织树、关联图、人员名册、详情与纯模型
    figma-organization/            # Figma 连线画布、人员操作弹窗与纯数据模型
    ui/                           # 来源项目的基础 UI 组件
  pages/people-page.tsx            # 标准、只读、历史与表格紧凑选框
  pages/guide-page.tsx             # 说明书、界面地图、组件位置索引
  pages/components-page.tsx        # 分类组件总览
  pages/organization-page.tsx      # C 树表工作台；旧布局不再注册路由
  pages/personnel-management-page.tsx # B 经典结构
  pages/figma-organization-page.tsx # A 拓扑结构
  data/template-catalog.ts        # 页面、分类、源码与位置登记
  data/demo-people.ts              # 22 名虚构人员和 8 家虚构门店
  data/demo-organization.ts        # B/C 共用的 13 个组织及 22 名人员
  data/demo-personnel.ts           # B 版虚构账号、资料状态及固定示例月份
  data/figma-organization.ts        # A 版 Figma 源稿演示快照
  data/portal-config.json          # 本地门户配置快照
  lib/portal-auth.ts               # 仅演示身份，不是真实认证
  lib/portal-content.ts            # 仅内存配置，不请求后端
  lib/portal-favorites.ts          # 收藏初始化与存储边界
tests/                            # Node 内置测试，无额外测试依赖
public/previews/                  # 说明书使用的真实界面缩略图
docs/                             # 组件接口与验收记录
artifacts/                        # 本次浏览器截图，未纳入版本控制
```

## 数据与存储

- 门户、人员分配和组织 B/C 使用虚构示例；A 使用用户提供的 Figma 演示快照。不读取真实 HRM 员工名册、客户或业务记录。
- 人员选择、门店分配、登录状态、门户配置修改只存在于当前页面内存；刷新恢复默认示例。
- C 版的选择、筛选和展开状态只保存在当前页面，刷新恢复鲜花事业部。节点人数包含下级，名册可单独切换直属范围。
- B 版默认显示全部组织的在职人员，统计随组织范围联动；月份固定为 `2026-08` 并标注“示例月份”。导入、入职、岗位履历、账号开通、离职只显示演示提示，刷新恢复默认。
- A 版的部/组节点按数据汇聚和权限所辖范围组织，工具栏“组织与权限说明书”展开原理与 [BDD 案例说明书](docs/ORGANIZATION-PERMISSIONS-BDD.md)。负责人可多人平级共同负责，同一人员可跨层任职，个人范围取各任职配置的并集；HRM 功能权限另行校验，人员标签不授予权限。支持网页内全屏、节点名称编辑和空组删除；唯一根部门不可删除。源稿 36 人汇总和 15 条成员节选不是完整名册的行数关系。各项配置与增改调离只更新页面内存，刷新恢复，未接入授权后端或真实数据聚合。来源、交互和接入边界见 [拓扑结构组件](docs/FIGMA-ORGANIZATION.md)。
- 只有系统收藏保存在当前浏览器、当前来源的 `localStorage`，键为 `ui-model:home-favorites:v1`。
- 说明书和组件总览的搜索条件保留在地址栏 `q` 参数，分类使用 `category`，不写入本地收藏或原系统存储。
- `localhost`、`127.0.0.1` 和不同端口属于不同存储来源；本项目不会读取原 Home 的收藏。
- 页面文件保存在项目目录，不随浏览器关闭而消失；浏览器状态与项目文件是两个独立的存储边界。
- 默认运行不请求 HRM、运营或门户配置接口，没有代理、真实登录、密码表单、数据库、凭据或业务写入。
- 原业务入口在模板里统一进入人员选择示例。门户编辑器可修改本页配置，但不修改来源项目或磁盘配置文件。

`portal-auth.ts` 中的示例管理员只用于展示全部菜单，绝不能作为其他系统的真实身份认证或权限实现。上线前必须替换它，并由服务端提供、校验授权范围。

人员拼音与首字母来自 `namePinyin`、`nameInitials` 字段；字段缺失时保留姓名、工号、账号搜索，不自行推断多音字或补齐权限。

详见 [人员选择器接口](docs/PERSON-PICKER.md)、[组织人员组件与版本](docs/ORGANIZATION-UI.md) 和 [验收记录](docs/ACCEPTANCE.md)。
