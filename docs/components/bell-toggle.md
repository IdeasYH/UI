# BellToggle：通知铃开关（React Bits）

适合通知意愿的开关及未读数量提示；不能直接代表浏览器或系统通知权限。

## 交互契约

- 关键输入：`pressed`/`defaultPressed` 为当前态，`offLabel`/`onLabel` 为文字，`count`/`badge` 为角标。
- 状态与回调：`onChange(pressed)` 把选择交给宿主；组件自身只演示铃声般的视觉动作。
- 宿主职责：真实订阅、推送权限、未读数和跨设备同步均由宿主提供；示例数字不是业务事实。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。通知订阅状态切换，铃铛振动与可选角标可视化反馈。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/bell-toggle) · [JS-CSS 注册表原文](https://reactbits.dev/r/BellToggle-JS-CSS.json)。
- 组件：`src/components/react-bits/BellToggle.jsx`；样式：`src/components/react-bits/BellToggle.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/BellToggle.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/bell-toggle-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`motion`、`@hugeicons/react`、`@hugeicons/core-free-icons`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

开启、关闭、外部状态回写、角标零值、禁用和减少动态效果。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
