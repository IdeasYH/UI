# MessageBox：带附件入口的消息输入框

原作：[Uiverse / vinodjangid07 / good-donkey-28](https://uiverse.io/vinodjangid07/good-donkey-28)。在用户提供这类结构时，保存一个文本值，附件另作输入；键盘焦点和填写状态决定边框与箭头亮度。聊天输入只是演示场景，任何“文本 + 可选文件 + 发送动作”都可参考。

`value: string`、`onChange(value)`、`onSend(value)`；可选 `onFileChange(file | null)`。宿主持有文本与附件、执行真正上传和提交。组件的 `required` 保证空文本不能触发表单提交；文件选择并不会上传。示例仅显示文件名与本地发送反馈。

HTML/SVG 与原作一致，CSS 的 40px 高度、深色背景、0.3s 图标过渡和焦点/有效输入状态保留；仅将选择器作用域限定在组件，避免与页面的 `input`、`label`、`button` 冲突。复制 `src/components/uiverse/message-box.tsx`、`message-box.css`、`src/examples/uiverse-message-composer-example.tsx` 和 [许可](uiverse-license.md)。依赖 React / React DOM。

验收：输入前后箭头颜色、附件图标悬停提示、回车与按钮发送、空输入、焦点边框和窄容器。
