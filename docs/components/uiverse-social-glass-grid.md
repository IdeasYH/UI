# SocialGlassGrid：九宫格玻璃社交卡

原作：[Uiverse / Praashoo7](https://uiverse.io/Praashoo7/smooth-crab-52)。悬停展开九宫格品牌图标，保留玻璃背景和逐块品牌色变化。

## 何时参考与泛化

遇到“社交、九宫格、玻璃、悬停”或相近交互结构时可参考，不要求业务名称与演示相同。可替换文案、数据与配色；若改变状态关系、尺寸或运动轨迹，需重新核对默认、悬停、按下、聚焦与选中状态。原作只提供的视觉动作不等于已连接业务。

## 原版与宿主边界

原始 HTML/CSS 逐字保存在静态目录，预览只增加居中壳与背景；iframe 隔离全局选择器。保留原作 CSS 动效及原生输入、勾选行为。搜索过滤、网络请求、真实播放、链接导航与持久化由宿主接入；此预览不执行脚本或表单提交。不要仅凭外观推断存在业务功能。

## 复制与接入

组件 ID：`uiverse-social-glass-grid`。在总览点击 ID 可复制；源码包为 `/references/uiverse-social-glass-grid.json`。复制以下文件并保留 [MIT 许可](uiverse-license.md)，宿主需提供 `/uiverse-originals/` 静态路径：

- `src/components/uiverse/social-glass-grid.tsx`
- `src/components/uiverse/original-frame.tsx`
- `src/examples/uiverse-social-glass-grid-example.tsx`
- `public/uiverse-originals/Praashoo7--smooth-crab-52.source.html`
- `public/uiverse-originals/Praashoo7--smooth-crab-52.css`
- `public/uiverse-originals/Praashoo7--smooth-crab-52.preview.html`

## UIModel 适配

主容器建立独立层叠上下文，修复负 z-index 被页面背景遮挡、无法触发悬停的问题；原作颜色和动画保持不变。

复制时同时保留 `public/uiverse-originals/Praashoo7--smooth-crab-52.override.css`。原始源码和指纹不变，差异集中于该适配文件。
