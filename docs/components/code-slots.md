# CodeSlots：验证码输入格（React Bits）

适合固定长度的一次性代码输入；长度变化、自动填充与安全策略由宿主结合认证流程判断。

## 交互契约

- 关键输入：`length`、`value`/`defaultValue`、`status`、`mask` 决定输入与反馈；`status` 有 `idle`、`success`、`error`。
- 状态与回调：`onChange(value)` 报告输入，`onComplete(value)` 只表示填写完整，不表示验证码有效。
- 宿主职责：示例填满后只提示“尚未验证”，成功/错误样式需另点演示按钮切换；真实验证码必须由服务端验证，限制尝试次数与错误信息由宿主实现。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。固定长度验证码输入、完成回调及成功/错误状态。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/code-slots) · [JS-CSS 注册表原文](https://reactbits.dev/r/CodeSlots-JS-CSS.json)。
- 组件：`src/components/react-bits/CodeSlots.jsx`；样式：`src/components/react-bits/CodeSlots.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/CodeSlots.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/code-slots-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`motion`、`@hugeicons/react`、`@hugeicons/core-free-icons`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

输入、粘贴、退格、清空、错误和成功态、屏幕阅读器与移动设备自动填充。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
