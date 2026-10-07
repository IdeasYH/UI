# 页面反馈与侧边抽屉

三种不同结构：持续需要注意的状态使用 `PersistentBanner`；短暂操作反馈使用 `ToastStack`；保留原页面上下文的详情／编辑使用 `Drawer`。不局限于账户、文章或任务等演示业务。

## 常驻条：persistent-alert-banner

`PersistentBanner({ tone: 'warning' | 'error', children, onClose })` 通过 Portal 固定在页面顶部。warning 纯黄底、error 纯红底，背景不使用网格或纹理，不设定时器，只有宿主移除或用户点击关闭才消失。使用 role=alert；宿主负责真实错误和重试。默认覆盖页面顶部，若业务要求推开布局，由宿主改为占位布局。

## 轻提示：grid-toast-stack

`ToastStack({ items, onDismiss, duration=2500 })`，items 为带唯一 id、text 和可选 success/error/info 的列表。右下堆叠，底部进度条清空后请求宿主移除，手动关闭同样回调；悬停或键盘焦点在提示内暂停，离开后继续剩余时间。duration≤0 时不自动关闭。示例保留最近 4 条，宿主决定队列上限。

文字支持拖动选择及复制。成功绿底、信息蓝底、错误红底，去掉网格纹理，保留原收藏的纯色背景、圆角与阴影。配色、圆角与图标参考已有 `uiverse-grid-notification-stack` 收藏视觉，是可传数据的 React 改编，非逐字复制原 CSS。原收藏的来源与许可见 `uiverse-license.md`；原始文件不变。本组件不执行保存／复制等业务操作，提示由真实结果驱动。

## 抽屉：side-drawer

`Drawer({ open, onClose, title, children, footer })` 使用原生 modal dialog，右侧滑入，浏览器提供模态焦点约束；打开锁定页面滚动，关闭恢复。Escape、关闭按钮与侧面遮罩请求 onClose。内容和 footer 由宿主提供；示例将输入作为草稿，保存才更新，关闭后重新打开恢复已保存值。未实现退出动画或多个重叠抽屉。

## 复制与验收

复制 `feedback-controls.tsx`、`feedback-controls.css`，依赖 React/React DOM，无新增库。真实示例 `src/examples/feedback-controls-example.tsx`。样式采用 feedback- 前缀，支持减少动态效果。宿主负责持久化、权限、请求、错误数据和关闭前的未保存提示。测试应覆盖手动关闭、自动消失、连续消息、Escape、保存与取消、键盘焦点。
