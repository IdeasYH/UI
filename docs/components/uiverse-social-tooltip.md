# 环形展开社交按钮（SocialTooltip）

原作：[Tsiangana / honest-bobcat-61](https://uiverse.io/Tsiangana/honest-bobcat-61)，MIT；2026-10-05 从原作公开 HTML/CSS 编辑器读取。保留原作者 SVG 路径、渐变、阴影、八个图标的位置与过渡时长，不使用替代图标库。

## 使用与边界

- 入口：`/components?q=uiverse-social-tooltip#uiverse-social-tooltip`；真实示例：`src/examples/uiverse-social-tooltip-example.tsx`。
- 接口：`onSelect?: (network: SocialNetwork) => void`，返回 Twitter、Facebook、WhatsApp、Discord、Pinterest、Dribbble、GitHub 或 Reddit。
- 这是动作集合，不是多选值或授权控件。宿主负责跳转、分享参数、权限和异步结果；组件不会自行访问第三方或发布内容。
- 鼠标悬停展开，移出收起；图标悬停切换品牌底色。键盘 Tab 聚焦也展开，Enter/空格激活图标。示例只显示所选名称。
- 原作中心 SVG 为 22px，周边为 20px；周边 10px 内边距、50px 圆角，展开动画 0.3s，中心颜色过渡 0.6s。百分比偏移与原作一致，包括原作第九个透明悬停连接区域。
- 宿主需预留约 220 × 220px 空间，避免 `overflow: hidden` 裁切。保留原作悬停区域几何；这不是支持任意图标数量的径向菜单，窄屏、触摸专用产品需另行设计交互。

## React 适配说明

仅转换 JSX 属性、增加样式前缀、固定容器内在宽度及隔离层叠，避免宿主布局拉伸或通用 `.text` 类冲突；增加可访问名称、键盘操作和焦点轮廓。鼠标视觉声明沿用公开 CSS，没有重画 SVG 或改变图标顺序。焦点停留时保持展开属于键盘适配。

## 复制与验证

复制 `src/components/uiverse/social-tooltip.tsx`、同名 CSS、真实示例及 `docs/components/uiverse-license.md`。只依赖 React；无图标包、网络请求或新增依赖。源码包：`/references/uiverse-social-tooltip.json`。

验收：中心初始为蓝色纸飞机；展开八项且不裁切；悬停各项切换品牌色；点击和键盘操作只回调对应名称；复制包在独立项目编译。不能把演示成功视作真实社交平台接入完成。
