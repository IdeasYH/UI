# PurpleDepthCard：紫色立体玻璃卡

原作：[Uiverse / chase2k25](https://uiverse.io/chase2k25/mighty-dragonfly-75)。默认 3D 展开，悬停时收回为平面。

## 何时参考与泛化

遇到“立体、玻璃、社交、卡片”或相近交互结构时可参考，不要求业务名称与演示相同。可替换文案、数据与配色；若改变状态关系、尺寸或运动轨迹，需重新核对默认、悬停、按下、聚焦与选中状态。原作只提供的视觉动作不等于已连接业务。

## 原版与宿主边界

原始 HTML/CSS 逐字保存在静态目录，预览只增加居中壳与背景；iframe 隔离全局选择器。保留原作 CSS 动效及原生输入、勾选行为。搜索过滤、网络请求、真实播放、链接导航与持久化由宿主接入；此预览不执行脚本或表单提交。不要仅凭外观推断存在业务功能。

## 复制与接入

组件 ID：`uiverse-purple-depth-card`。在总览点击 ID 可复制；源码包为 `/references/uiverse-purple-depth-card.json`。复制以下文件并保留 [MIT 许可](uiverse-license.md)，宿主需提供 `/uiverse-originals/` 静态路径：

- `src/components/uiverse/purple-depth-card.tsx`
- `src/components/uiverse/original-frame.tsx`
- `src/examples/uiverse-purple-depth-card-example.tsx`
- `public/uiverse-originals/chase2k25--mighty-dragonfly-75.source.html`
- `public/uiverse-originals/chase2k25--mighty-dragonfly-75.css`
- `public/uiverse-originals/chase2k25--mighty-dragonfly-75.preview.html`

## UIModel 适配

按用户要求改为默认 3D 展开、悬停时卡片和全部深度层归零为平面，移出后恢复；此状态方向是 UIModel 定制，区别于原作。

复制时同时保留 `public/uiverse-originals/chase2k25--mighty-dragonfly-75.override.css`。原始源码和指纹不变，差异集中于该适配文件。
