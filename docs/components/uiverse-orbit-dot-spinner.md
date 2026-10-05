# OrbitDotSpinner：八点环绕加载器

原作：[Uiverse / abrahamcalsin / serious-turkey-52](https://uiverse.io/abrahamcalsin/serious-turkey-52)。这是一份原作 HTML 与 CSS 的逐字保存版本；`abrahamcalsin--serious-turkey-52.source.html` 和 `abrahamcalsin--serious-turkey-52.css` 是可检查的原始代码，`abrahamcalsin--serious-turkey-52.preview.html` 只加预览页面壳。CSS 悬停、按下、选中、关键帧和 SVG 保持原作实现。预览 iframe 将原作选择器与 UIModel 样式隔离。

八个圆点按 45 度排列并错峰缩放，保留原版脉冲周期与阴影。

## 何时参考

当场景需要加载、转圈、等待、圆点等视觉或交互时，先看原作代码和运行示例。演示内容不限定业务用途。原作的文字、颜色和尺寸可替换；若改动运动轨迹或状态关系，须重新验收视觉与输入行为。

## 复制与接入

复制 `src/components/uiverse/orbit-dot-spinner.tsx`、`original-frame.tsx`、`public/uiverse-originals/abrahamcalsin--serious-turkey-52.source.html`、`abrahamcalsin--serious-turkey-52.css`、`abrahamcalsin--serious-turkey-52.preview.html`，以及 [MIT 原作者许可](uiverse-license.md)。运行示例是 `src/examples/uiverse-orbit-dot-spinner-example.tsx`。宿主静态资源目录必须提供 `/uiverse-originals/` 路径。复制包收录上述完整文件。

原作中的按钮、表单或链接只演示前端交互；真实保存、提交、导航、权限和数据由接入项目负责。此处的 sandbox 预览不执行脚本或表单提交。若需要业务回调，请以原始 HTML/CSS 为依据改写成受控 React 组件，并分别核对默认、悬停、聚焦、选中与按下状态。
