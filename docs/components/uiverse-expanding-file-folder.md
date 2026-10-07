# ExpandingFileFolder：展开文件列表夹

原作：[Uiverse / byllzz](https://uiverse.io/byllzz/great-wombat-13)。点击文件夹展开五条文件与搜索输入，保留翻盖、层叠与逐项进入动画。

## 何时参考与泛化

遇到“文件夹、展开、文件、搜索”或相近交互结构时可参考，不要求业务名称与演示相同。可替换文案、数据与配色；若改变状态关系、尺寸或运动轨迹，需重新核对默认、悬停、按下、聚焦与选中状态。原作只提供的视觉动作不等于已连接业务。

## 原版与宿主边界

原始 HTML/CSS 逐字保存在静态目录，预览只增加居中壳与背景；iframe 隔离全局选择器。保留原作 CSS 动效及原生输入、勾选行为。搜索过滤、网络请求、真实播放、链接导航与持久化由宿主接入；此预览不执行脚本或表单提交。不要仅凭外观推断存在业务功能。

## 复制与接入

组件 ID：`uiverse-expanding-file-folder`。在总览点击 ID 可复制；源码包为 `/references/uiverse-expanding-file-folder.json`。复制以下文件并保留 [MIT 许可](uiverse-license.md)，宿主需提供 `/uiverse-originals/` 静态路径：

- `src/components/uiverse/expanding-file-folder.tsx`
- `src/components/uiverse/original-frame.tsx`
- `src/examples/uiverse-expanding-file-folder-example.tsx`
- `public/uiverse-originals/byllzz--great-wombat-13.source.html`
- `public/uiverse-originals/byllzz--great-wombat-13.css`
- `public/uiverse-originals/byllzz--great-wombat-13.preview.html`

## 当前展示与交互调整

展示整体缩放为 0.52，框架高度 210px；原始 HTML/CSS 保留，缩放位于独立 override.css，复制必须携带该文件。
