# OrbGenderRadio：扩散圆球单选框

原作：[Uiverse / ayman-ashine / wicked-liger-39](https://uiverse.io/ayman-ashine/wicked-liger-39)。这是一份原作 HTML 与 CSS 的逐字保存版本；`ayman-ashine--wicked-liger-39.source.html` 和 `ayman-ashine--wicked-liger-39.css` 是可检查的原始代码，`ayman-ashine--wicked-liger-39.preview.html` 只加预览页面壳。CSS 悬停、按下、选中、关键帧和 SVG 保持原作实现。预览 iframe 将原作选择器与 UIModel 样式隔离。

四个图标单选项，选中圆球放大、描边，并扩散同色背景。

## 何时参考

当场景需要单选、圆球、扩散、图标等视觉或交互时，先看原作代码和运行示例。演示内容不限定业务用途。原作的文字、颜色和尺寸可替换；若改动运动轨迹或状态关系，须重新验收视觉与输入行为。

## 复制与接入

复制 `src/components/uiverse/orb-gender-radio.tsx`、`original-frame.tsx`、`public/uiverse-originals/ayman-ashine--wicked-liger-39.source.html`、`ayman-ashine--wicked-liger-39.css`、`ayman-ashine--wicked-liger-39.preview.html`，以及 [MIT 原作者许可](uiverse-license.md)。运行示例是 `src/examples/uiverse-orb-gender-radio-example.tsx`。宿主静态资源目录必须提供 `/uiverse-originals/` 路径。复制包收录上述完整文件。

原作中的按钮、表单或链接只演示前端交互；真实保存、提交、导航、权限和数据由接入项目负责。此处的 sandbox 预览不执行脚本或表单提交。若需要业务回调，请以原始 HTML/CSS 为依据改写成受控 React 组件，并分别核对默认、悬停、聚焦、选中与按下状态。

原作使用 Tailwind 类而不提供独立 CSS。本仓库的 `ayman-ashine--wicked-liger-39.adapter.css` 保存原站预览实际生成的 Tailwind 3.4.17 样式（含基础重置、类和选中/悬停状态），无需在目标项目新增 Tailwind 依赖。复制时也要带上该文件；若目标已有 Tailwind，可直接使用原始 HTML 并比较视觉。
