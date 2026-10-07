# TeamActionCard：团队动作卡片

原作：[Uiverse / nazar-gavrylyk / terrible-gecko-91](https://uiverse.io/nazar-gavrylyk/terrible-gecko-91)。这是一份原作 HTML 与 CSS 的逐字保存版本；`nazar-gavrylyk--terrible-gecko-91.source.html` 和 `nazar-gavrylyk--terrible-gecko-91.css` 是可检查的原始代码，`nazar-gavrylyk--terrible-gecko-91.preview.html` 只加预览页面壳。CSS 悬停、按下、选中、关键帧和 SVG 保持原作实现。预览 iframe 将原作选择器与 UIModel 样式隔离。

分组操作卡片，悬停行改变背景、文字和图标颜色。

## 何时参考

当场景需要团队、菜单、管理、操作等视觉或交互时，先看原作代码和运行示例。演示内容不限定业务用途。原作的文字、颜色和尺寸可替换；若改动运动轨迹或状态关系，须重新验收视觉与输入行为。

## 复制与接入

复制 `src/components/uiverse/team-action-card.tsx`、`original-frame.tsx`、`public/uiverse-originals/nazar-gavrylyk--terrible-gecko-91.source.html`、`nazar-gavrylyk--terrible-gecko-91.css`、`nazar-gavrylyk--terrible-gecko-91.preview.html`，以及 [MIT 原作者许可](uiverse-license.md)。运行示例是 `src/examples/uiverse-team-action-card-example.tsx`。宿主静态资源目录必须提供 `/uiverse-originals/` 路径。复制包收录上述完整文件。

原作中的按钮、表单或链接只演示前端交互；真实保存、提交、导航、权限和数据由接入项目负责。此处的 sandbox 预览不执行脚本或表单提交。若需要业务回调，请以原始 HTML/CSS 为依据改写成受控 React 组件，并分别核对默认、悬停、聚焦、选中与按下状态。

## 配色变体

`<TeamActionCard />` 默认保留深色原版；`<TeamActionCard variant="light" />` 使用白色卡片、深色文字、浅灰分隔线。两版共用原版 CSS 的位移、缩放与 0.3 秒过渡。原始源码不修改，浅色样式集中在 `nazar-gavrylyk--terrible-gecko-91.light.css`，由 `nazar-gavrylyk--terrible-gecko-91-light.preview.html` 引用；复制白色版需同时携带这两个文件，复制包已收录。总览中并排对照，空间不足自动换行。配色可用于其他分组操作场景，不限定团队业务。
