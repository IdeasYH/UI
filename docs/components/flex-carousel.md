# FlexCarousel：图片画廊（React Bits）

适合少量有明确图片、标题的视觉作品浏览。它是 WebGL / OGL 动效组件，布局需要明确高度；大量文本、关键业务表单或不支持 WebGL 的场景应由宿主选择其他呈现方式。

## 来源与当前用法

本项目的 `FlexCarousel.jsx` 和 `FlexCarousel.css` 逐字来自 [React Bits JS-CSS 注册表](https://reactbits.dev/r/FlexCarousel-JS-CSS.json)，使用说明见 [官方文档](https://reactbits.dev/components/flex-carousel)。注册表列出 `ogl@^1.0.11`。原版源文件保持 `.jsx` / plain CSS；本项目通过 TypeScript 的 `allowJs` 编译。

`src/examples/flex-carousel-example.tsx` 按示例传入 `items`，并设置 `preset="liquid"`、`intro="rise"`、`cardHeight={0.5}`、`gap={12}`、`squeeze={0.2}`、`focusOnClick`、`captions`。外层 `height: 560px` 使画布有实际空间。`items` 每项提供 `src`、`alt`、`title`，可选 `subtitle`。图片演示资源位于 `public/images/one.jpg`、`two.jpg`、`three.jpg`，来源分别为 React Bits 原版示例中使用的 Unsplash 照片；目标项目应替换为自己的图片及对应替代文字。组件的焦点、鼠标与键盘交互沿用原版源码。

## 复制与迁移

- 组件、样式与 TypeScript 接口：`src/components/react-bits/FlexCarousel.jsx`、`FlexCarousel.css`、`FlexCarousel.d.ts`。前两份是注册表原文，声明文件是本项目为 TypeScript 增加的适配。
- 可运行调用：`src/examples/flex-carousel-example.tsx`；同时提供上述三个图片路径，或换成宿主可访问的图片 URL。公开 JSON 是文本源码包，不包含 JPG 二进制。
- 依赖：React / React DOM、`ogl@^1.0.11`；构建需支持 JSX/CSS，TypeScript 项目需允许 JS 或提供模块声明。

验收图片加载、容器高度、点击聚焦、方向键与窄屏效果；目标系统应自行决定图片授权、加载失败和 WebGL 不可用时的替代内容。
