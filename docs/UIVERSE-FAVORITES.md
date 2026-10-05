# Uiverse 收藏组件选型

2026-10-05 在用户登录的 [Uiverse 收藏夹](https://uiverse.io/favorites)核对到 24 项：此前已实现 7 项（下表 6 项，以及 [`swatch-color-picker`](components/swatch-color-picker.md) 对应的 `witty-squid-83`），本轮补入其余 17 项。每项提供原作链接、可运行示例、复用契约和源码包。收藏夹会变化，本页是该日快照。Uiverse 原作页面均标注 MIT，复制时保留 [原作者与许可](components/uiverse-license.md)。

| 需求结构 | 组件 ID（组件总览可点复制） | 原作与边界 |
| --- | --- | --- |
| 文本 + 可选附件 + 发送 | [`uiverse-message-composer`](components/uiverse-message-composer.md) | [消息输入框](https://uiverse.io/vinodjangid07/good-donkey-28)；宿主负责上传与发送 |
| 保存/收藏动作，希望图标块展开 | [`uiverse-expanding-bookmark-save`](components/uiverse-expanding-bookmark-save.md) | [Save 按钮](https://uiverse.io/vinodjangid07/heavy-badger-29)；宿主负责持久化 |
| 退出入口，悬停显示文字 | [`uiverse-expanding-logout`](components/uiverse-expanding-logout.md) | [Logout 按钮](https://uiverse.io/vinodjangid07/thin-duck-22)；宿主负责会话结束 |
| 一个即时布尔值，需要悬浮光晕 | [`uiverse-floating-glow-switch`](components/uiverse-floating-glow-switch.md) | [光晕开关](https://uiverse.io/EddyBel/slimy-penguin-36)；宿主持有 `checked` |
| 删除入口，悬停显示警示字样 | [`uiverse-expanding-delete`](components/uiverse-expanding-delete.md) | [Delete 按钮](https://uiverse.io/vinodjangid07/smart-emu-83)；宿主负责确认与删除 |

| 一个入口展开八个社交动作 | [`uiverse-social-tooltip`](components/uiverse-social-tooltip.md) | [Tsiangana 原作](https://uiverse.io/Tsiangana/honest-bobcat-61)；保留公开 SVG/CSS，宿主负责实际分享 |

## 新补的 17 项：按交互结构找原型

| 结构 | 组件 ID | 原作 |
| --- | --- | --- |
| 五种状态通知与进度线 | [`uiverse-grid-notification-stack`](components/uiverse-grid-notification-stack.md) | [xerith_8140](https://uiverse.io/xerith_8140/stupid-panther-7) |
| 八点环绕加载 | [`uiverse-orbit-dot-spinner`](components/uiverse-orbit-dot-spinner.md) | [abrahamcalsin](https://uiverse.io/abrahamcalsin/serious-turkey-52) |
| 昼夜主题切换 | [`uiverse-day-night-theme-switch`](components/uiverse-day-night-theme-switch.md) | [Galahhad](https://uiverse.io/Galahhad/strong-squid-82) |
| 横向社交悬停提示 | [`uiverse-horizontal-social-tooltips`](components/uiverse-horizontal-social-tooltips.md) | [PriyanshuGupta28](https://uiverse.io/PriyanshuGupta28/chilly-eagle-55) |
| 层叠联系表单 | [`uiverse-stacked-contact-form`](components/uiverse-stacked-contact-form.md) | [MBerkayHamurcu](https://uiverse.io/MBerkayHamurcu/slimy-quail-55) |
| 五色跳动加载 | [`uiverse-google-color-bars-loader`](components/uiverse-google-color-bars-loader.md) | [satyamchaudharydev](https://uiverse.io/satyamchaudharydev/ugly-bulldog-75) |
| 黏土质感色板 | [`uiverse-clay-color-swatch`](components/uiverse-clay-color-swatch.md) | [chase2k25](https://uiverse.io/chase2k25/horrible-zebra-60) |
| 迷你音频播放视觉 | [`uiverse-mini-audio-player`](components/uiverse-mini-audio-player.md) | [ahmed150up](https://uiverse.io/ahmed150up/quiet-goat-67) |
| 团队操作卡片 | [`uiverse-team-action-card`](components/uiverse-team-action-card.md) | [nazar-gavrylyk](https://uiverse.io/nazar-gavrylyk/terrible-gecko-91) |
| 层叠输入表单 | [`uiverse-stacked-input-form`](components/uiverse-stacked-input-form.md) | [andrew-demchenk0](https://uiverse.io/andrew-demchenk0/ordinary-lizard-16) |
| 深色动作菜单 | [`uiverse-dark-action-menu`](components/uiverse-dark-action-menu.md) | [nazar-gavrylyk](https://uiverse.io/nazar-gavrylyk/yellow-puma-19) |
| 纵向社交悬停提示 | [`uiverse-vertical-social-tooltips`](components/uiverse-vertical-social-tooltips.md) | [Faizuddinq](https://uiverse.io/Faizuddinq/cowardly-quail-47) |
| 录制笔记本加载动画 | [`uiverse-laptop-recording-loader`](components/uiverse-laptop-recording-loader.md) | [SelfMadeSystem](https://uiverse.io/SelfMadeSystem/silent-cougar-84) |
| 透视邻项弹性色板 | [`uiverse-perspective-color-swatch`](components/uiverse-perspective-color-swatch.md) | [Cobp](https://uiverse.io/Cobp/horrible-quail-18) |
| 分栏注册表单 | [`uiverse-auth-split-form`](components/uiverse-auth-split-form.md) | [anest_6070](https://uiverse.io/anest_6070/plastic-panther-15) |
| 扩散圆球单选 | [`uiverse-orb-gender-radio`](components/uiverse-orb-gender-radio.md) | [ayman-ashine](https://uiverse.io/ayman-ashine/wicked-liger-39) |
| 发光难度单选 | [`uiverse-glow-difficulty-radio`](components/uiverse-glow-difficulty-radio.md) | [Cybercom682](https://uiverse.io/Cybercom682/jolly-liger-24) |

这 17 项把原作者的 HTML、CSS 原样保存在 `public/uiverse-originals/`；可运行页面只加背景、居中和样式链接，再以受限 iframe 与 UIModel 样式隔离。两项 Tailwind 原作没有独立 CSS，随包保存原站实际生成的完整 Tailwind CSS。隔离预览保留 CSS 动效、原生勾选与输入；业务提交、真实音频播放、复制到剪贴板和外部导航需要宿主接入，不能把预览当作业务完成态。

在 `/components` 搜索 ID 或点击每张组件卡的 ID 即可复制给其他 agent。ID 同时是页面锚点及源码 JSON 文件名，例如 `/components?category=interaction#uiverse-floating-glow-switch` 和 `/references/uiverse-floating-glow-switch.json`。使用时仍需按 [通用复用方法](UI-REUSE.md) 判断值、确认时机和动作所有者，不能仅凭外观替换业务操作。
