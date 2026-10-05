# IosSettingsPanel：iOS 风格设置面板

原作：[Uiverse / chase2k25](https://uiverse.io/chase2k25/shy-dingo-61)。圆角半透明设置列表，带彩色图标、逐项进入、按下缩放及内部滚动。

## 何时参考与泛化

遇到“设置、菜单、列表、滚动”或相近交互结构时可参考，不要求业务名称与演示相同。可替换文案、数据与配色；若改变状态关系、尺寸或运动轨迹，需重新核对默认、悬停、按下、聚焦与选中状态。原作只提供的视觉动作不等于已连接业务。

## 原版与宿主边界

原始 HTML/CSS 逐字保存在静态目录，预览只增加居中壳与背景；iframe 隔离全局选择器。保留原作 CSS 动效及原生输入、勾选行为。搜索过滤、网络请求、真实播放、链接导航与持久化由宿主接入；此预览不执行脚本或表单提交。不要仅凭外观推断存在业务功能。

## 复制与接入

组件 ID：`uiverse-ios-settings-panel`。在总览点击 ID 可复制；源码包为 `/references/uiverse-ios-settings-panel.json`。复制以下文件并保留 [MIT 许可](uiverse-license.md)，宿主需提供 `/uiverse-originals/` 静态路径：

- `src/components/uiverse/ios-settings-panel.tsx`
- `src/components/uiverse/original-frame.tsx`
- `src/examples/uiverse-ios-settings-panel-example.tsx`
- `public/uiverse-originals/chase2k25--shy-dingo-61.source.html`
- `public/uiverse-originals/chase2k25--shy-dingo-61.css`
- `public/uiverse-originals/chase2k25--shy-dingo-61.preview.html`
