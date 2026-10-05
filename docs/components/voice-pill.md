# VoicePill：语音胶囊（React Bits）

需要一个短暂的语音录入入口，并让用户看见开始、录音中、停止或取消；不适合作为完整的转写编辑器。

## 交互契约

- 关键输入：`mode` 决定按住/切换方式；`reactive="simulated"` 产生演示声波；`showTime`、`waveform`、`slideToCancel` 调整反馈。
- 状态与回调：`onStart` 与 `onStop({ reason, duration })` 把开始和停止交给宿主，组件自身只维护录入的视觉状态。
- 宿主职责：演示不请求麦克风。真实采音、权限请求、语音转文字、文件保存、失败重试及隐私提示由宿主实现。

演示名称和数据只是例子。迁移时先比较值形状、确认时机与依赖，再替换内容；需要不同状态协议时明确扩展，不能仅改文字。按住或切换录音态，显示计时与模拟声波；真实麦克风接入由宿主决定。

## 来源、复制清单与样式

- [官方演示](https://reactbits.dev/micro/voice-pill) · [JS-CSS 注册表原文](https://reactbits.dev/r/VoicePill-JS-CSS.json)。
- 组件：`src/components/react-bits/VoicePill.jsx`；样式：`src/components/react-bits/VoicePill.css`。这两份保持官方注册表原文。
- TypeScript 适配：`src/components/react-bits/VoicePill.d.ts`。这是宽松的模块声明，不替代原版参数检查；集成时以此契约和源码函数签名为准。
- 最小可运行示例：`src/examples/voice-pill-example.tsx`。示例逻辑只在页面内存中运行。
- 依赖：React / React DOM、`@hugeicons/react`、`@hugeicons/core-free-icons`。宿主需处理 JSX、CSS 导入与对应包安装。

把组件源码、CSS 和相对 import 一起复制，或在网站展开“完整用例与源码”下载 JSON。图片、路由、请求、权限及通知等宿主资源按目标项目替换。原版样式保持原貌，迁移前检查全局类名冲突、层级、容器尺寸和暗色背景。

## 验收重点

鼠标点击、按住、键盘启动/结束和取消路径；确认停止原因与时长不会被当作转写成功。 同时核对减少动态效果、长文案、小屏和未提供真实服务时的提示。
