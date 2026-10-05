# BookmarkButton：展开书签保存按钮

原作：[Uiverse / vinodjangid07 / heavy-badger-29](https://uiverse.io/vinodjangid07/heavy-badger-29)。适合用书签形象表示保存、收藏或稍后阅读；视觉用途不等于已持久化结果。

可选 `onClick()`，宿主接实际保存请求和状态。组件保持原作 100×40px 黑色胶囊、30→90px 紫色图标块扩张、文字收缩、0.3s 过渡及按下 0.95 缩放。键盘聚焦可看到相同展开状态；减少动态效果时取消过渡。示例只计点击，不进行保存。

复制 `src/components/uiverse/bookmark-button.tsx`、`bookmark-button.css`、`src/examples/uiverse-expanding-bookmark-save-example.tsx` 和 [许可](uiverse-license.md)。依赖 React / React DOM。验收鼠标悬停、焦点、按下、点击回调及黑底对比。
