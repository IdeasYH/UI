# CopyValue：点击值复制

ID：`click-copy-value`。用于编号、短文本等需要快速复制的单值，不限于门店。点击整个浅蓝色按钮或右侧复制图标均复制 value；只有 Clipboard API 成功后显示绿色小勾，1.8 秒后恢复。不会阻止表格行列悬停效果，点击不向表格行冒泡。

接口：`value: string` 为实际复制文本；可选 `label` 为显示文本，默认 value。保持编号的字符串类型，避免丢失前导零。真实示例见 `src/examples/copy-value-example.tsx`。字段配置／筛选示例的编号列已接入。

依赖 React/React DOM、项目已有 lucide-react。复制 `copy-value.tsx` 和同目录 CSS；需要 HTTPS 或 localhost 的 Clipboard API 权限。失败显示文字提示并允许重试，不假报成功。支持 Tab、Enter、空格和屏幕阅读器状态反馈。连续点击以最后一次操作为准；value 更新或卸载时清理旧反馈与定时器。

长文本、批量复制及敏感信息确认由宿主设计；该组件不保存数据，也不自动读取剪贴板。
