# LogoutButton：展开退出按钮

原作：[Uiverse / vinodjangid07 / thin-duck-22](https://uiverse.io/vinodjangid07/thin-duck-22)。圆形图标在悬停时扩张成红色 Logout 胶囊；按钮只表示操作入口，真正退出、二次确认和会话清理由宿主决定。

可选 `onClick()`。保留原作 45→125px 宽、0.3s 展开、文字渐显与按下 2px 位移；键盘聚焦也可展开。演示点击不会退出 UIModel。复制 `src/components/uiverse/logout-button.tsx`、`logout-button.css`、`src/examples/uiverse-expanding-logout-example.tsx` 和 [许可](uiverse-license.md)。依赖 React / React DOM。

验收圆形静态状态、展开图标/文字位置、点击回调、键盘聚焦，以及放在窄工具栏时是否预留扩张空间。
