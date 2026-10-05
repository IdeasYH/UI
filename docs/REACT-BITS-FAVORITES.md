# React Bits 收藏组件：按交互结构选用

2026-10-04 从当前浏览器的 [React Bits 收藏夹](https://www.reactbits.dev/favorites) 读取到 21 项。FlexCarousel、PeekRating 已接入；本轮补齐 19 项。这里按 **UIModel 的使用目的** 分组，官方 Components/Micro 分类保留在 `src/data/react-bits-favorites.ts`；不要用官方分类代替交互契约。

所有新增项的 `.jsx` 和 `.css` 取自对应的 React Bits **JS-CSS 注册表**，未改原版实现；项目提供可交互示例、宽松 TypeScript 模块声明和单项契约。目录 `/components` 可以按分类/结构词检索，展开每项“完整用例与源码”可读取或下载包含通用复用方法、契约、示例和源码的 JSON。原版动效依赖的安装范围为 `motion`、`gsap`、`react-icons`、`react-router-dom`、`three` 以及已有 Hugeicons、`ogl`；每个复用包仅列自身所需。PillNav 的注册表指定 Router 6，本项目使用兼容其 `Link` 导入的 Router 7.18.4，避开 6.x 的已知安全公告。

| 结构 | 先查看 | 区分相邻方案 |
| --- | --- | --- |
| 顶级栏目展开为分组链接 | [CardNav](components/card-nav.md) | 一层胶囊链接看 PillNav；两层树状菜单看 BranchedMenu |
| 少量页面链接与当前项 | [PillNav](components/pill-nav.md)、[GooeyNav](components/gooey-nav.md) | PillNav 依赖路由适配；GooeyNav 强调切换粒子且内部持有视觉项 |
| 图片与短标题的视觉菜单 | [FlowingMenu](components/flowing-menu.md) | 需要宿主提供图片和容器高度 |
| 少量图标快捷动作 | [Dock](components/dock.md) | 图标动作回调由宿主负责，保持文字标签 |
| 两层分组与叶节点选择 | [BranchedMenu](components/branched-menu.md) | 更深层或多选看 TreeSelect |
| 单值/布尔值的微动效 | [JellyRadio](components/jelly-radio.md)、[RubberSegment](components/rubber-segment.md)、[SpringCheck](components/spring-check.md)、[SquishSwitch](components/squish-switch.md)、[BellToggle](components/bell-toggle.md) | 先分清互斥值与布尔值、立即生效与延迟提交 |
| 固定长度代码或语音入口 | [CodeSlots](components/code-slots.md)、[VoicePill](components/voice-pill.md) | 填满不等于代码验证成功；语音视觉反馈不等于已采集/转写 |
| 带撤销窗口或长按阈值的动作 | [FuseButton](components/fuse-button.md)、[HoldButton](components/hold-button.md) | FuseButton 可延迟提交；HoldButton 只降低误触，不能替代授权 |
| 轻量通知 | [SwipeToast](components/swipe-toast.md) | 请求结果和撤销逻辑由宿主决定 |
| 动态列表与异步状态 | [AnimatedList](components/animated-list.md)、[LatticeLoader](components/lattice-loader.md) | 列表不是大数据虚拟滚动；加载动效不是实际进度 |
| 图片交互展示 | [PaperCrumple](components/paper-crumple.md)、[FlexCarousel](components/flex-carousel.md) | 两者需要图像和明确空间，且分别依赖 Three.js 与 `ogl` WebGL |
| 整数评分 | [PeekRating](components/peek-rating.md) | 半星精度看项目既有 StarRating |

动效、色彩与演示文字是可替换表现；单选互斥、状态归属、确认时机、回调和宿主数据责任必须按契约处理。跨项目复制先读 [通用复用方法](UI-REUSE.md)，再读对应单项文档和 `src/examples/<id>-example.tsx`。原版 CSS 中部分选择器较通用，接入目标站点前检查样式冲突；`CardNav`、`PillNav`、`Dock` 等绝对定位元素还要给出明确定位容器。需要真实持久化、录音、验证码、通知权限或路由时，在宿主实现并验证，不要把 UIModel 演示状态当作完成的业务能力。
