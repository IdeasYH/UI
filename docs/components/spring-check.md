# SpringCheck：弹簧勾选（React Bits）

适合单项任务完成或轻量确认；多项列表和全选仍使用复选框集合。

## 交互契约

- 关键输入：`checked`/`defaultChecked` 为布尔值，`label` 为文字；颜色、划线方向及弹跳程度可调。
- 状态与回调：`onChange(checked)` 选择即回调；受控模式由宿主持有值。
- 宿主职责：“已完成”只是界面状态；实际保存、撤销或权限校验由宿主实现。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。单项确认以弹跳勾选和划线反馈；值仍由宿主持有。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/spring-check) · [JS-CSS 注册表原文](https://reactbits.dev/r/SpringCheck-JS-CSS.json)。
- 组件：`src/components/react-bits/SpringCheck.jsx`；样式：`src/components/react-bits/SpringCheck.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/SpringCheck.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/spring-check-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`motion`、`@hugeicons/core-free-icons`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

反复勾选、外部值变化、禁用、焦点与减少动态效果。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
