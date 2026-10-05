# FuseButton：可撤销按钮（React Bits）

适合可延迟提交或可补偿的操作，用户在短窗口内能撤销；不可撤销的操作仍需宿主风险判断。

## 交互契约

- 关键输入：`label`、`undoLabel`、`doneLabel` 提供阶段文字；`undoWindow`、`commitOn`、`settle` 控制时序。
- 状态与回调：`commitOn="fuseEnd"` 时倒计时结束才 `onCommit`；`onUndo` 报告撤销，`onPhaseChange` 可供宿主同步。
- 宿主职责：组件不保存或回滚数据。选择延迟提交还是先提交再补偿，必须与目标业务的真实事务语义一致。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。动作触发后保留短暂撤销窗口，再由宿主决定何时真正提交。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/fuse-button) · [JS-CSS 注册表原文](https://reactbits.dev/r/FuseButton-JS-CSS.json)。
- 组件：`src/components/react-bits/FuseButton.jsx`；样式：`src/components/react-bits/FuseButton.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/FuseButton.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/fuse-button-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`@hugeicons/react`、`@hugeicons/core-free-icons`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

点击后撤销、等待倒计时提交、禁用态和请求失败；避免 UI 显示“已完成”但服务端失败。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
