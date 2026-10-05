# GlowSwitch：悬浮光晕布尔开关

原作：[Uiverse / EddyBel / slimy-penguin-36](https://uiverse.io/EddyBel/slimy-penguin-36)。保存一个即时布尔值，适合需要持续可见的轻量开关；业务写入和权限由宿主负责。

`label: string`、`checked: boolean`、`onChange(checked)`；使用原生 checkbox，键盘空格可切换。保留原作 3s 循环的上下浮动/3D 倾斜、多色模糊光晕与 0.4s 轨道及滑块过渡。根据 UIModel 需求交换开关双态外观：关时深色轨道、右侧灰暗圆球；开时浅色轨道、左侧紫色渐变圆球。`checked` 的布尔语义不变。仅将关键帧重命名并限定选择器作用域，减少动态效果时暂停动画。

复制 `src/components/uiverse/glow-switch.tsx`、`glow-switch.css`、`src/examples/uiverse-floating-glow-switch-example.tsx` 和 [许可](uiverse-license.md)。依赖 React / React DOM。验收开关双态、滑块位置、浮动周期、光晕及键盘切换。
