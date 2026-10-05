# GooeyNav：黏性导航（React Bits）

适合少量并列导航项，切换时强化“当前在哪一项”的视觉反馈。

## 交互契约

- 关键输入：`items: { label, href }[]` 与 `initialActiveIndex` 确定初始展示；粒子数量、颜色和时长可调整。
- 状态与回调：点击更新内部视觉选中态，同时原生链接继续导航；若页面路由可外部改变，宿主需处理重新挂载或扩展受控接口。
- 宿主职责：传入目标项目真实链接，不要把示例相同的锚点当成业务导航。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。切换链接时以粒子和黏性过渡提示当前项。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/components/gooey-nav) · [JS-CSS 注册表原文](https://reactbits.dev/r/GooeyNav-JS-CSS.json)。
- 组件：`src/components/react-bits/GooeyNav.jsx`；样式：`src/components/react-bits/GooeyNav.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/GooeyNav.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/gooey-nav-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM；无需其他第三方包。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

点击不同项、键盘 Enter/Space、窄屏溢出和路由返回后的当前态。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
