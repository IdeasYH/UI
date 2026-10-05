# HoldButton：长按确认按钮（React Bits）

适合需要避免误触的一次性确认动作；不能代替高风险业务的权限和二次校验。

## 交互契约

- 关键输入：`children` 与 `doneLabel` 是阶段文案；`holdTime` 是确认阈值，颜色、填充方向和重置时长可调。
- 状态与回调：按住到阈值触发 `onHold`，短点可交给 `onTap`；真实动作由宿主处理。
- 宿主职责：接口提交、失败恢复和审计不在组件内。移动端触摸和辅助输入应在目标环境验证。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。持续按住到阈值才触发动作，进度由按钮内填充显示。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/hold-button) · [JS-CSS 注册表原文](https://reactbits.dev/r/HoldButton-JS-CSS.json)。
- 组件：`src/components/react-bits/HoldButton.jsx`；样式：`src/components/react-bits/HoldButton.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/HoldButton.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/hold-button-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM；无需其他第三方包。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

短点不触发确认、长按触发一次、松开中断、禁用和键盘路径。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
