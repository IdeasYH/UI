# CardNav：卡片导航（React Bits）

适合少数顶级栏目，每项展开后呈现多个相关入口；大量深层导航应先整理信息层级。

## 交互契约

- 关键输入：`logo`/`logoAlt` 与 `items: { label, bgColor, textColor, links: { label, href, ariaLabel? }[] }[]` 提供内容和目标。
- 状态与回调：组件负责展开/收起动画，实际跳转由链接 `href` 执行；当前示例不改变业务路由。
- 宿主职责：原版容器采用绝对定位；宿主要给它相对定位和足够高度，并提供真实 logo 与链接。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。展开为分组卡片的导航栏；链接、标志与色彩由宿主传入。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/components/card-nav) · [JS-CSS 注册表原文](https://reactbits.dev/r/CardNav-JS-CSS.json)。
- 组件：`src/components/react-bits/CardNav.jsx`；样式：`src/components/react-bits/CardNav.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/CardNav.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/card-nav-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`gsap`、`react-icons`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

桌面与窄屏展开、焦点与链接、长标签、层级遮挡和相对定位容器。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
