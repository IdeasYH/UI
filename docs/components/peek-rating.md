# PeekRating：悬停反馈评分（React Bits）

适合整数级别的轻量打分，悬停时抬升星形并显示对应文字，点击确认。它与本项目的半星 `StarRating` 是不同契约：若需要 0.5 分精度，使用半星组件。

## 来源与当前用法

本项目的 `PeekRating.jsx` 和 `PeekRating.css` 逐字来自 [React Bits JS-CSS 注册表](https://reactbits.dev/r/PeekRating-JS-CSS.json)，使用说明见 [官方文档](https://reactbits.dev/micro/peek-rating)。注册表列出 `@hugeicons/react@^1.1.10` 与 `@hugeicons/core-free-icons@^4.3.3`。原版源文件保持 `.jsx` / plain CSS。

`src/examples/peek-rating-example.tsx` 使用 5 颗星、`defaultValue={3}`、英文等级标签、指定颜色及动效参数。`onChange` 由宿主接收确认分数并展示；当前示例只保存在页面内存。`allowClear` 允许再次点击已选分数清空；`showTip` 显示悬停等级。原版还支持只读、禁用和受控 `value`，接入时选定一个状态所有者。

## 复制与迁移

- 组件、样式与 TypeScript 接口：`src/components/react-bits/PeekRating.jsx`、`PeekRating.css`、`PeekRating.d.ts`。前两份是注册表原文，声明文件是本项目为 TypeScript 增加的适配。
- 可运行调用：`src/examples/peek-rating-example.tsx`。
- 依赖：React / React DOM、上述 Hugeicons 两个包；构建需支持 JSX/CSS，TypeScript 项目需允许 JS 或提供模块声明。

验收鼠标预览、点击确认、再次点击清空、方向键/空格操作与减少动态效果设置；真实评分保存、权限和错误反馈由宿主负责。
