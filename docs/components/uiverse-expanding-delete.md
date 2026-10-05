# DeleteButton：展开垃圾桶删除按钮

原作：[Uiverse / vinodjangid07 / smart-emu-83](https://uiverse.io/vinodjangid07/smart-emu-83)。黑色圆形垃圾桶在悬停时扩张为红色 Delete 胶囊。按钮只负责动效和回调，是否确认、如何删除及撤销都由宿主决定。

可选 `onClick()`。保留原作 50→140px 宽、0.3s 过渡、垃圾桶下移和伪元素文字进入；键盘聚焦也展开。示例点击不会删除数据。

复制 `src/components/uiverse/delete-button.tsx`、`delete-button.css`、`src/examples/uiverse-expanding-delete-example.tsx` 和 [许可](uiverse-license.md)。依赖 React / React DOM。验收静态、悬停、按下、焦点以及容器为扩张预留的空间。
