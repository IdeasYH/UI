# MiniAudioPlayer：迷你音频播放器

原作：[Uiverse / ahmed150up / quiet-goat-67](https://uiverse.io/ahmed150up/quiet-goat-67)。这是一份原作 HTML 与 CSS 的逐字保存版本；`ahmed150up--quiet-goat-67.source.html` 和 `ahmed150up--quiet-goat-67.css` 是可检查的原始代码，`ahmed150up--quiet-goat-67.preview.html` 只加预览页面壳。CSS 悬停、按下、选中、关键帧和 SVG 保持原作实现。预览 iframe 将原作选择器与 UIModel 样式隔离。

深色迷你播放器外观，保留唱片封面、控制图标和进度条；原作不含音频逻辑。

## 何时参考

当场景需要音频、播放、暂停、音乐等视觉或交互时，先看原作代码和运行示例。演示内容不限定业务用途。原作的文字、颜色和尺寸可替换；若改动运动轨迹或状态关系，须重新验收视觉与输入行为。

## 复制与接入

复制 `src/components/uiverse/mini-audio-player.tsx`、`original-frame.tsx`、`public/uiverse-originals/ahmed150up--quiet-goat-67.source.html`、`ahmed150up--quiet-goat-67.css`、`ahmed150up--quiet-goat-67.preview.html`，以及 [MIT 原作者许可](uiverse-license.md)。运行示例是 `src/examples/uiverse-mini-audio-player-example.tsx`。宿主静态资源目录必须提供 `/uiverse-originals/` 路径。复制包收录上述完整文件。

原作中的按钮、表单或链接只演示前端交互；真实保存、提交、导航、权限和数据由接入项目负责。此处的 sandbox 预览不执行脚本或表单提交。若需要业务回调，请以原始 HTML/CSS 为依据改写成受控 React 组件，并分别核对默认、悬停、聚焦、选中与按下状态。
