# FlowingMenu：流动菜单（React Bits）

适合作品、栏目等图片与短文字并列的视觉导航；常规密集菜单更宜用普通链接列表。

## 交互契约

- 关键输入：`items: { text, link, image }[]`；容器必须有明确高度，颜色和滚动速度可变。
- 状态与回调：悬停触发文字/图片流动；点击按链接目标跳转，不保存额外选择值。
- 宿主职责：示例使用 UIModel 本地图片；跨项目复制时替换 `image` URL，并检查图像许可、尺寸和可访问文本。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。悬停项目时显示重复文字与图片流动效果的导航菜单。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/components/flowing-menu) · [JS-CSS 注册表原文](https://reactbits.dev/r/FlowingMenu-JS-CSS.json)。
- 组件：`src/components/react-bits/FlowingMenu.jsx`；样式：`src/components/react-bits/FlowingMenu.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/FlowingMenu.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/flowing-menu-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`gsap`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

悬停进入/离开、键盘链接、图片加载失败和小屏布局；原版通用 `.menu`/`.marquee` CSS 类可能与宿主样式冲突。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
