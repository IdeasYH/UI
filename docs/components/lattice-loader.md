# LatticeLoader：网格加载状态（React Bits）

适合空间有限的异步状态展示，一眼区分工作中、完成与失败；长任务还需解释进度或后台状态。

## 交互契约

- 关键输入：`status` 使用 `working`、`done`、`error`；`label`、`doneLabel`、`errorLabel` 与计时/颜色参数调整表达。
- 状态与回调：纯展示组件，没有请求或自动状态推断；由宿主传入状态。
- 宿主职责：开始、完成、失败来自真实操作结果；计时仅是视觉反馈，不表示服务端完成百分比。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。工作中、完成与失败三态的网格动效和计时展示。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/lattice-loader) · [JS-CSS 注册表原文](https://reactbits.dev/r/LatticeLoader-JS-CSS.json)。
- 组件：`src/components/react-bits/LatticeLoader.jsx`；样式：`src/components/react-bits/LatticeLoader.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/LatticeLoader.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/lattice-loader-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM；无需其他第三方包。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

三种状态切换、屏幕阅读器文字、减少动态效果和重复请求重置。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
