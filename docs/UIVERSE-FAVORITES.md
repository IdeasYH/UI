# Uiverse 收藏组件选型

2026-10-04 在用户登录的 Uiverse 收藏页核对到 5 项。2026-10-05 另增加用户指定的 Tsiangana 环形社交按钮（不是重新核对收藏数量）。以下前五项是用户当时的收藏快照；收藏增减需重新核对页面。每项保留原作链接、React 适配、CSS 动效和可复制源码包。Uiverse 原作页面均标注 MIT，复制时保留 [原作者与许可](components/uiverse-license.md)。

| 需求结构 | 组件 ID（组件总览可点复制） | 原作与边界 |
| --- | --- | --- |
| 文本 + 可选附件 + 发送 | [`uiverse-message-composer`](components/uiverse-message-composer.md) | [消息输入框](https://uiverse.io/vinodjangid07/good-donkey-28)；宿主负责上传与发送 |
| 保存/收藏动作，希望图标块展开 | [`uiverse-expanding-bookmark-save`](components/uiverse-expanding-bookmark-save.md) | [Save 按钮](https://uiverse.io/vinodjangid07/heavy-badger-29)；宿主负责持久化 |
| 退出入口，悬停显示文字 | [`uiverse-expanding-logout`](components/uiverse-expanding-logout.md) | [Logout 按钮](https://uiverse.io/vinodjangid07/thin-duck-22)；宿主负责会话结束 |
| 一个即时布尔值，需要悬浮光晕 | [`uiverse-floating-glow-switch`](components/uiverse-floating-glow-switch.md) | [光晕开关](https://uiverse.io/EddyBel/slimy-penguin-36)；宿主持有 `checked` |
| 删除入口，悬停显示警示字样 | [`uiverse-expanding-delete`](components/uiverse-expanding-delete.md) | [Delete 按钮](https://uiverse.io/vinodjangid07/smart-emu-83)；宿主负责确认与删除 |

| 一个入口展开八个社交动作 | [`uiverse-social-tooltip`](components/uiverse-social-tooltip.md) | [Tsiangana 原作](https://uiverse.io/Tsiangana/honest-bobcat-61)；保留公开 SVG/CSS，宿主负责实际分享 |

在 `/components` 搜索 ID 或点击每张组件卡的 ID 即可复制给其他 agent。ID 同时是页面锚点及源码 JSON 文件名，例如 `/components?category=interaction#uiverse-floating-glow-switch` 和 `/references/uiverse-floating-glow-switch.json`。使用时仍需按 [通用复用方法](UI-REUSE.md) 判断值、确认时机和动作所有者，不能仅凭外观替换业务操作。
