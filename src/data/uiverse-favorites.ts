/** 2026-10-04 从用户 Uiverse 收藏页核对的五个公开原作，2026-10-05 增加用户指定的 Tsiangana 原作。ID 描述形状与用途，并兼作稳定锚点。 */
export const uiverseFavorites = [
  {
    id: 'uiverse-message-composer', name: '附件消息输入框', symbol: 'MessageBox', fileStem: 'message-box', exampleExport: 'UiverseMessageComposerExample', author: 'vinodjangid07',
    sourceUrl: 'https://uiverse.io/vinodjangid07/good-donkey-28',
    description: '深色圆角消息框，添加图片图标悬停变亮并出现提示，输入后发送箭头变亮。',
    keywords: ['消息', '输入', '附件', '图片', '发送', '焦点', '悬停'],
  },
  {
    id: 'uiverse-expanding-bookmark-save', name: '展开书签保存按钮', symbol: 'BookmarkButton', fileStem: 'bookmark-button', exampleExport: 'UiverseExpandingBookmarkSaveExample', author: 'vinodjangid07',
    sourceUrl: 'https://uiverse.io/vinodjangid07/heavy-badger-29',
    description: '黑色胶囊保存按钮，悬停时紫色书签圆块扩张覆盖文字，按下缩小。',
    keywords: ['保存', '书签', '按钮', '展开', '紫色', '悬停'],
  },
  {
    id: 'uiverse-expanding-logout', name: '展开退出按钮', symbol: 'LogoutButton', fileStem: 'logout-button', exampleExport: 'UiverseExpandingLogoutExample', author: 'vinodjangid07',
    sourceUrl: 'https://uiverse.io/vinodjangid07/thin-duck-22',
    description: '红色圆形退出图标，悬停展开为 Logout 胶囊，按下轻微位移。',
    keywords: ['退出', '登出', '按钮', '红色', '展开', '悬停'],
  },
  {
    id: 'uiverse-floating-glow-switch', name: '悬浮光晕开关', symbol: 'GlowSwitch', fileStem: 'glow-switch', exampleExport: 'UiverseFloatingGlowSwitchExample', author: 'EddyBel',
    sourceUrl: 'https://uiverse.io/EddyBel/slimy-penguin-36',
    description: '多色柔光开关持续悬浮；关闭时深色轨道配灰色圆球，开启时浅色轨道配紫色圆球。',
    keywords: ['开关', '切换', '悬浮', '光晕', '渐变', '布尔'],
  },
  {
    id: 'uiverse-expanding-delete', name: '展开删除按钮', symbol: 'DeleteButton', fileStem: 'delete-button', exampleExport: 'UiverseExpandingDeleteExample', author: 'vinodjangid07',
    sourceUrl: 'https://uiverse.io/vinodjangid07/smart-emu-83',
    description: '黑色圆形垃圾桶，悬停扩张为红色胶囊并露出 Delete 字样。',
    keywords: ['删除', '垃圾桶', '按钮', '红色', '展开', '悬停'],
  },
  {
    id: 'uiverse-social-tooltip', name: '环形展开社交按钮', symbol: 'SocialTooltip', fileStem: 'social-tooltip', exampleExport: 'UiverseSocialTooltipExample', author: 'Tsiangana',
    sourceUrl: 'https://uiverse.io/Tsiangana/honest-bobcat-61',
    description: '蓝色纸飞机悬停后展开八个环形社交图标，保留原作 SVG、品牌色和位移动画。',
    keywords: ['社交', '分享', '环形', '展开', '悬停', 'tooltip', 'Tsiangana'],
  },
] as const

export const uiverseFavoriteIds = new Set<string>(uiverseFavorites.map(item => item.id))
