# BranchedMenu：分支菜单（React Bits）

适合两层分组菜单，展开时用分支连线展示上下级；更深层选择或多选应参考树选择。

## 交互契约

- 关键输入：`items: { label, children?: { value, label, icon? }[] }[]`；`defaultOpen`/`defaultActive` 控制初态。
- 状态与回调：`onToggle(index, open)` 报告分组展开，`onSelect(value, item)` 报告叶节点选择。
- 宿主职责：选中值对应的实际页面或操作由宿主接入；示例只显示本地选择。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。分组展开、分支连线与叶节点选中组成的导航菜单。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/branched-menu) · [JS-CSS 注册表原文](https://reactbits.dev/r/BranchedMenu-JS-CSS.json)。
- 组件：`src/components/react-bits/BranchedMenu.jsx`；样式：`src/components/react-bits/BranchedMenu.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/BranchedMenu.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/branched-menu-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`@hugeicons/react`、`@hugeicons/core-free-icons`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

分组展开/收起、叶节点切换、无子项、键盘焦点及窄容器。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
