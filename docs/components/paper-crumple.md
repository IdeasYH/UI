# PaperCrumple：纸张揉皱（React Bits）

适合图片或作品的可玩味展示；不适合承担必须清晰可读的关键文档或表单。

## 交互契约

- 关键输入：`src`、`alt`、`width`、`height`、`sceneHeight` 定义内容与画布；`releaseBehavior`、`draggable` 等控制物理外观。
- 状态与回调：`onStateChange` 与 `onError` 可观察渲染/交互结果；原版依赖 Three.js 与 WebGL。
- 宿主职责：宿主提供图片资源、许可和明确尺寸，并在 WebGL 不可用时检查图片后备展示。示例使用 UIModel 的 `/images/one.jpg`，跨项目复制须替换该地址。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。图片作为可拖动、揉皱的三维纸张展示，需要 WebGL 和明确尺寸。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/paper-crumple) · [JS-CSS 注册表原文](https://reactbits.dev/r/PaperCrumple-JS-CSS.json)。
- 组件：`src/components/react-bits/PaperCrumple.jsx`；样式：`src/components/react-bits/PaperCrumple.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/PaperCrumple.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/paper-crumple-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`three`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

初次纹理加载、拖动与释放、窄屏、低性能设备、错误回调和后备图片。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
