# MiniAudioPlayer：迷你音频播放器

外观参考 [ahmed150up / quiet-goat-67](https://uiverse.io/ahmed150up/quiet-goat-67)，保留 MIT 署名。原始 HTML/CSS 逐字保存于 public/uiverse-originals，当前总览采用可操作 React 版本，不再使用静态 iframe 作为播放器。

## 何时参考与复制

用于短音频、试听、语音等需要紧凑播放控制的场景；演示曲目不是适用范围限制。复制 src/components/uiverse/mini-audio-player.tsx 和同名 CSS，参考 src/examples/uiverse-mini-audio-player-example.tsx。仅依赖 React，无外部音频服务。原作静态资源在复制包中保留用于溯源，并非 React 播放所必需。

## 当前展示与交互调整

现为 React 交互适配，保留深色播放器外观。MiniAudioPlayer 接受可选 src/title/artist；默认内生成 16 秒轻旋律，仅点击播放后发声。倍速依次 1→1.25→1.5→2→0.5；range 支持拖动和方向键，绑定真实 audio.currentTime。加载失败显示错误，宿主负责媒体授权与 URL 可用性。原始静态源码仍保留供比对，使用可交互版本须复制 mini-audio-player.tsx 与同名 CSS。
