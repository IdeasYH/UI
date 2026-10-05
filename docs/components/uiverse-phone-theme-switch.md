# PhoneThemeSwitch：手机昼夜主题卡

原作：[Uiverse / Pradeepsaranbishnoi](https://uiverse.io/Pradeepsaranbishnoi/strong-treefrog-90)。手机造型的昼夜切换，太阳月牙、背景与滑块随勾选状态变化。

## 何时参考与泛化

遇到“主题、手机、开关”或相近交互结构时可参考，不要求业务名称与演示相同。可替换文案、数据与配色；若改变状态关系、尺寸或运动轨迹，需重新核对默认、悬停、按下、聚焦与选中状态。原作只提供的视觉动作不等于已连接业务。

## 原版与宿主边界

原始 HTML/CSS 逐字保存在静态目录，预览只增加居中壳与背景；iframe 隔离全局选择器。保留原作 CSS 动效及原生输入、勾选行为。搜索过滤、网络请求、真实播放、链接导航与持久化由宿主接入；此预览不执行脚本或表单提交。不要仅凭外观推断存在业务功能。

## 复制与接入

组件 ID：`uiverse-phone-theme-switch`。在总览点击 ID 可复制；源码包为 `/references/uiverse-phone-theme-switch.json`。复制以下文件并保留 [MIT 许可](uiverse-license.md)，宿主需提供 `/uiverse-originals/` 静态路径：

- `src/components/uiverse/phone-theme-switch.tsx`
- `src/components/uiverse/original-frame.tsx`
- `src/examples/uiverse-phone-theme-switch-example.tsx`
- `public/uiverse-originals/Pradeepsaranbishnoi--strong-treefrog-90.source.html`
- `public/uiverse-originals/Pradeepsaranbishnoi--strong-treefrog-90.css`
- `public/uiverse-originals/Pradeepsaranbishnoi--strong-treefrog-90.preview.html`
