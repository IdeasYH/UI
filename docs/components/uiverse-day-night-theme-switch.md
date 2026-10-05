# DayNightThemeSwitch：昼夜主题开关

原作：[Uiverse / Galahhad / strong-squid-82](https://uiverse.io/Galahhad/strong-squid-82)。这是一份原作 HTML 与 CSS 的逐字保存版本；`Galahhad--strong-squid-82.source.html` 和 `Galahhad--strong-squid-82.css` 是可检查的原始代码，`Galahhad--strong-squid-82.preview.html` 只加预览页面壳。CSS 悬停、按下、选中、关键帧和 SVG 保持原作实现。预览 iframe 将原作选择器与 UIModel 样式隔离。

太阳、月亮、云朵和星空随复选状态切换，保留多层阴影与滑动轨迹。

## 何时参考

当场景需要开关、主题、白天、黑夜、动效等视觉或交互时，先看原作代码和运行示例。演示内容不限定业务用途。原作的文字、颜色和尺寸可替换；若改动运动轨迹或状态关系，须重新验收视觉与输入行为。

## 复制与接入

复制 `src/components/uiverse/day-night-theme-switch.tsx`、`original-frame.tsx`、`public/uiverse-originals/Galahhad--strong-squid-82.source.html`、`Galahhad--strong-squid-82.css`、`Galahhad--strong-squid-82.preview.html`，以及 [MIT 原作者许可](uiverse-license.md)。运行示例是 `src/examples/uiverse-day-night-theme-switch-example.tsx`。宿主静态资源目录必须提供 `/uiverse-originals/` 路径。复制包收录上述完整文件。

原作中的按钮、表单或链接只演示前端交互；真实保存、提交、导航、权限和数据由接入项目负责。此处的 sandbox 预览不执行脚本或表单提交。若需要业务回调，请以原始 HTML/CSS 为依据改写成受控 React 组件，并分别核对默认、悬停、聚焦、选中与按下状态。
