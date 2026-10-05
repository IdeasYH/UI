# Dock：Dock 快捷栏（React Bits）

适合少量高频快捷动作或页面入口，指针接近时放大图标；不应替代必要的可见文字导航。

## 交互契约

- 关键输入：`items: { icon, label, onClick, className? }[]`；`magnification`、`distance`、`panelHeight` 调整空间反馈。
- 状态与回调：每项 `onClick` 由宿主执行动作；组件只显示 Dock 与提示标签。
- 宿主职责：给组件一个定位容器和清晰的标签；导航项应在回调中接真实路由或动作。原版项目把可点击项渲染为 `div`，目标站点若要求键盘可操作，应补按钮语义与焦点/按键处理。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。图标随指针放大并展示标签的快捷导航栏。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/components/dock) · [JS-CSS 注册表原文](https://reactbits.dev/r/Dock-JS-CSS.json)。
- 组件：`src/components/react-bits/Dock.jsx`；样式：`src/components/react-bits/Dock.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/Dock.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/dock-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`motion`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

鼠标移动、点击、键盘可聚焦、窄屏与长标签；检查底部绝对定位不覆盖内容。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
