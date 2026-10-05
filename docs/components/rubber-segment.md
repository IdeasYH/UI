# RubberSegment：橡胶分段选择（React Bits）

适合少量互斥选项切换同一区域，与原生 SegmentedControl 相同值形状但提供拖动与橡胶动效。

## 交互契约

- 关键输入：`items` 为字符串或 `{ value, label, icon? }`，`value`/`defaultValue` 是当前项；`draggable` 等调整动效。
- 状态与回调：`onChange(value)` 在确认新分段时回调，宿主据此替换内容。
- 宿主职责：切换的实际数据查询或内容渲染仍由宿主负责；不能把动画进度当成已加载结果。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。少量互斥选项在同一轨道切换，滑块以弹性变形呈现。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/rubber-segment) · [JS-CSS 注册表原文](https://reactbits.dev/r/RubberSegment-JS-CSS.json)。
- 组件：`src/components/react-bits/RubberSegment.jsx`；样式：`src/components/react-bits/RubberSegment.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/RubberSegment.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/rubber-segment-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`motion`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

点击、拖动、键盘、外部值更新、禁用与窄屏。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
