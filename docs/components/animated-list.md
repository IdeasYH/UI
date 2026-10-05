# AnimatedList：动画列表（React Bits）

适合可滚动的短至中等列表，在项进入视口时强调内容；不是虚拟化海量数据表。

## 交互契约

- 关键输入：`items` 为列表内容，`initialSelectedIndex` 设置起始选择；滚动条、渐变和方向键可配置。
- 状态与回调：`onItemSelect(item, index)` 报告选择；原版自身管理当前选中索引。
- 宿主职责：示例数据为本地字符串；真实内容、稳定 ID、远程分页和业务选中值由宿主处理。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。列表项进入视口时呈现动效，并支持选择与方向键浏览。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/components/animated-list) · [JS-CSS 注册表原文](https://reactbits.dev/r/AnimatedList-JS-CSS.json)。
- 组件：`src/components/react-bits/AnimatedList.jsx`；样式：`src/components/react-bits/AnimatedList.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/AnimatedList.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/animated-list-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`motion`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

滚动进入动画、鼠标选中、方向键、空列表和长文本。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
