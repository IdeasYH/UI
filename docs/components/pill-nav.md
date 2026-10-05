# PillNav：胶囊导航（React Bits）

适合入口较少的页面或站点导航，当前项和悬停态清晰；不是承载复杂子菜单的控件。

## 交互契约

- 关键输入：`items: { label, href, ariaLabel? }[]`、`activeHref`、`logo` 和颜色参数决定内容和当前态。
- 状态与回调：链接执行跳转；`activeHref` 需由宿主路由同步。示例只用锚点以便在本页演示。
- 宿主职责：原版对站内路径使用 `react-router-dom` 的 `Link`：真实路径接入时必须置于 Router 下。容器采用绝对定位，需要相对定位宿主。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。胶囊形导航及悬停动效，支持当前路由与移动端菜单。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/components/pill-nav) · [JS-CSS 注册表原文](https://reactbits.dev/r/PillNav-JS-CSS.json)。
- 组件：`src/components/react-bits/PillNav.jsx`；样式：`src/components/react-bits/PillNav.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/PillNav.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/pill-nav-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`react-router-dom`、`gsap`。官方注册表列出 Router 6；本仓库采用兼容该 `Link` 导入的 Router 7.18.4，以避开 6.x 的已知安全公告。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

当前项、悬停、移动端菜单、键盘链接与真实 Router 跳转。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
