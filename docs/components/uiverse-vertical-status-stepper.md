# VerticalStatusStepper：纵向状态步骤条

原作：[Uiverse / PriyanshuGupta28](https://uiverse.io/PriyanshuGupta28/orange-newt-23)。纵向展示已完成、当前和待办步骤，保留圆点、连接线与进度样式。

## 何时参考与泛化

遇到“步骤、流程、完成、进度”或相近交互结构时可参考，不要求业务名称与演示相同。可替换文案、数据与配色；若改变状态关系、尺寸或运动轨迹，需重新核对默认、悬停、按下、聚焦与选中状态。原作只提供的视觉动作不等于已连接业务。

## 原版与宿主边界

原始 HTML/CSS 逐字保存在静态目录，预览只增加居中壳与背景；iframe 隔离全局选择器。保留原作 CSS 动效及原生输入、勾选行为。搜索过滤、网络请求、真实播放、链接导航与持久化由宿主接入；此预览不执行脚本或表单提交。不要仅凭外观推断存在业务功能。

## 复制与接入

组件 ID：`uiverse-vertical-status-stepper`。在总览点击 ID 可复制；源码包为 `/references/uiverse-vertical-status-stepper.json`。复制以下文件并保留 [MIT 许可](uiverse-license.md)，宿主需提供 `/uiverse-originals/` 静态路径：

- `src/components/uiverse/vertical-status-stepper.tsx`
- `src/components/uiverse/original-frame.tsx`
- `src/examples/uiverse-vertical-status-stepper-example.tsx`
- `public/uiverse-originals/PriyanshuGupta28--orange-newt-23.source.html`
- `public/uiverse-originals/PriyanshuGupta28--orange-newt-23.css`
- `public/uiverse-originals/PriyanshuGupta28--orange-newt-23.preview.html`
