# JellyRadio：果冻单选（React Bits）

适合少量互斥值并列展示；选项很多或需要检索时用搜索选择器。

## 交互契约

- 关键输入：`items` 可以是字符串或 `{ value, label }`，`value`/`defaultValue` 选择受控或默认模式；弹性参数可调。
- 状态与回调：`onChange(value)` 选择即回调；不要同时让组件内部与宿主分别维护互相矛盾的值。
- 宿主职责：稳定值、业务校验和持久化由宿主提供；仅复制动效不能改变单选语义。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。互斥选项以弹性胶囊提示当前值；支持受控和非受控模式。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/jelly-radio) · [JS-CSS 注册表原文](https://reactbits.dev/r/JellyRadio-JS-CSS.json)。
- 组件：`src/components/react-bits/JellyRadio.jsx`；样式：`src/components/react-bits/JellyRadio.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/JellyRadio.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/jelly-radio-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`motion`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

互斥选择、外部值更新、禁用、方向键与长标签。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
