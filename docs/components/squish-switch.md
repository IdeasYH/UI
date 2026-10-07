# SquishSwitch：挤压开关（React Bits）

适合即时生效的布尔设置；需要先阅读条款或多条件后提交时应使用明确的勾选流程。

## 交互契约

- 关键输入：`checked`/`defaultChecked` 与 `label`/`ariaLabel` 说明当前控制对象；轨道颜色、尺寸和弹性可调。
- 状态与回调：`onChange(checked)` 即时回调；保存成功与失败仍由宿主处理。
- 宿主职责：目标业务的设置读写、失败回滚和权限由宿主负责。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。布尔开关在切换时呈现挤压动效，支持受控状态。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/squish-switch) · [JS-CSS 注册表原文](https://reactbits.dev/r/SquishSwitch-JS-CSS.json)。
- 组件：`src/components/react-bits/SquishSwitch.jsx`；样式：`src/components/react-bits/SquishSwitch.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/SquishSwitch.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/squish-switch-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`motion`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

开/关、键盘空格、禁用、外部同步与颜色之外的状态提示。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。

## 演示背景

示例使用深灰背景（#15171c）和浅色文字，保证轮廓、文字和动效在演示区域中可见。背景由示例宿主提供，复制到其他界面时应连同文字、轨道和滑块配色一起核对对比度。
