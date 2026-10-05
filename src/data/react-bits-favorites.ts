/** 2026-10-04 从用户浏览器的 React Bits 收藏页读取；原站分类与 UIModel 用途分类分别记录。 */
export const reactBitsFavorites = [
  { id: 'voice-pill', symbol: 'VoicePill', name: '语音胶囊', category: 'interaction', origin: 'Micro', description: '按住或切换录音态，显示计时与模拟声波；真实麦克风接入由宿主决定。', keywords: ['语音', '录音', '按住', '麦克风'], dependencies: ['@hugeicons/react', '@hugeicons/core-free-icons'] },
  { id: 'swipe-toast', symbol: 'SwipeToast', name: '滑动通知', category: 'overlay', origin: 'Micro', description: '可滑动关闭、计时消失或触发附带操作的轻量通知。', keywords: ['通知', 'Toast', '滑动关闭', '撤销'], dependencies: ['motion', '@hugeicons/react', '@hugeicons/core-free-icons'] },
  { id: 'card-nav', symbol: 'CardNav', name: '卡片导航', category: 'navigation', origin: 'Components', description: '展开为分组卡片的导航栏；链接、标志与色彩由宿主传入。', keywords: ['导航', '分组', '展开', '链接'], dependencies: ['gsap', 'react-icons'] },
  { id: 'pill-nav', symbol: 'PillNav', name: '胶囊导航', category: 'navigation', origin: 'Components', description: '胶囊形导航及悬停动效，支持当前路由与移动端菜单。', keywords: ['导航', '路由', '菜单', '移动端'], dependencies: ['react-router-dom', 'gsap'] },
  { id: 'gooey-nav', symbol: 'GooeyNav', name: '黏性导航', category: 'navigation', origin: 'Components', description: '切换链接时以粒子和黏性过渡提示当前项。', keywords: ['导航', '当前项', '粒子'], dependencies: [] },
  { id: 'animated-list', symbol: 'AnimatedList', name: '动画列表', category: 'display', origin: 'Components', description: '列表项进入视口时呈现动效，并支持选择与方向键浏览。', keywords: ['列表', '选择', '滚动', '动画'], dependencies: ['motion'] },
  { id: 'flowing-menu', symbol: 'FlowingMenu', name: '流动菜单', category: 'navigation', origin: 'Components', description: '悬停项目时显示重复文字与图片流动效果的导航菜单。', keywords: ['菜单', '悬停', '图片', '跑马灯'], dependencies: ['gsap'] },
  { id: 'dock', symbol: 'Dock', name: 'Dock 快捷栏', category: 'navigation', origin: 'Components', description: '图标随指针放大并展示标签的快捷导航栏。', keywords: ['Dock', '快捷入口', '图标', '放大'], dependencies: ['motion'] },
  { id: 'fuse-button', symbol: 'FuseButton', name: '可撤销按钮', category: 'interaction', origin: 'Micro', description: '动作触发后保留短暂撤销窗口，再由宿主决定何时真正提交。', keywords: ['按钮', '撤销', '确认窗口', '异步动作'], dependencies: ['@hugeicons/react', '@hugeicons/core-free-icons'] },
  { id: 'hold-button', symbol: 'HoldButton', name: '长按确认按钮', category: 'interaction', origin: 'Micro', description: '持续按住到阈值才触发动作，进度由按钮内填充显示。', keywords: ['按钮', '长按', '防误触', '确认'], dependencies: [] },
  { id: 'lattice-loader', symbol: 'LatticeLoader', name: '网格加载状态', category: 'display', origin: 'Micro', description: '工作中、完成与失败三态的网格动效和计时展示。', keywords: ['加载', '进度', '完成', '失败'], dependencies: [] },
  { id: 'jelly-radio', symbol: 'JellyRadio', name: '果冻单选', category: 'interaction', origin: 'Micro', description: '互斥选项以弹性胶囊提示当前值；支持受控和非受控模式。', keywords: ['单选', '互斥', '弹性', '值'], dependencies: ['motion'] },
  { id: 'paper-crumple', symbol: 'PaperCrumple', name: '纸张揉皱', category: 'display', origin: 'Micro', description: '图片作为可拖动、揉皱的三维纸张展示，需要 WebGL 和明确尺寸。', keywords: ['图片', '三维', '拖动', 'WebGL'], dependencies: ['three'] },
  { id: 'rubber-segment', symbol: 'RubberSegment', name: '橡胶分段选择', category: 'interaction', origin: 'Micro', description: '少量互斥选项在同一轨道切换，滑块以弹性变形呈现。', keywords: ['分段', '单选', '滑动', '弹性'], dependencies: ['motion'] },
  { id: 'spring-check', symbol: 'SpringCheck', name: '弹簧勾选', category: 'interaction', origin: 'Micro', description: '单项确认以弹跳勾选和划线反馈；值仍由宿主持有。', keywords: ['勾选', '布尔', '确认', '动效'], dependencies: ['motion', '@hugeicons/core-free-icons'] },
  { id: 'squish-switch', symbol: 'SquishSwitch', name: '挤压开关', category: 'interaction', origin: 'Micro', description: '布尔开关在切换时呈现挤压动效，支持受控状态。', keywords: ['开关', '布尔', '挤压', '动效'], dependencies: ['motion'] },
  { id: 'code-slots', symbol: 'CodeSlots', name: '验证码输入格', category: 'interaction', origin: 'Micro', description: '固定长度验证码输入、完成回调及成功/错误状态。', keywords: ['验证码', '输入', '单次密码', 'OTP'], dependencies: ['motion', '@hugeicons/react', '@hugeicons/core-free-icons'] },
  { id: 'bell-toggle', symbol: 'BellToggle', name: '通知铃开关', category: 'interaction', origin: 'Micro', description: '通知订阅状态切换，铃铛振动与可选角标可视化反馈。', keywords: ['通知', '订阅', '开关', '角标'], dependencies: ['motion', '@hugeicons/react', '@hugeicons/core-free-icons'] },
  { id: 'branched-menu', symbol: 'BranchedMenu', name: '分支菜单', category: 'navigation', origin: 'Micro', description: '分组展开、分支连线与叶节点选中组成的导航菜单。', keywords: ['分组', '树', '导航', '展开'], dependencies: ['@hugeicons/react', '@hugeicons/core-free-icons'] },
] as const

export type ReactBitsFavorite = typeof reactBitsFavorites[number]
export const reactBitsFavoriteIds = new Set<string>(reactBitsFavorites.map(item => item.id))
