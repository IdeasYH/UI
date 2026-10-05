# SwipeToast：滑动通知（React Bits）

适合一次操作后的短消息、可撤销提示或非阻断反馈；重要错误应同时保留页面内可追溯状态。

## 交互契约

- 关键输入：`title`、`description`、`actionLabel` 表达内容；`open` 控制可见；`inline` 放在容器流中，默认用于浮层；`duration` 控制自动消失。
- 状态与回调：`onAction` 只报告附带动作点击；`onClose(reason)` 报告关闭原因，外部需同步 `open`。
- 宿主职责：示例“撤销”只改变本地提示，不回滚业务。真实撤销或重试要连接宿主状态与接口。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。可滑动关闭、计时消失或触发附带操作的轻量通知。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/swipe-toast) · [JS-CSS 注册表原文](https://reactbits.dev/r/SwipeToast-JS-CSS.json)。
- 组件：`src/components/react-bits/SwipeToast.jsx`；样式：`src/components/react-bits/SwipeToast.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/SwipeToast.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/swipe-toast-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`motion`、`@hugeicons/react`、`@hugeicons/core-free-icons`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

等待自动消失、悬停暂停、滑动关闭、关闭按钮、动作按钮和键盘操作。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
