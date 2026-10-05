# CollapsePanel：标题与详情

当多段信息平时只显示标题、阅读时按需展开时使用。适合问答、解释和分组详情；需要同时展开多项或由外部驱动展开状态时，需扩展当前单开契约。

## 接口与状态

`items: { id, title, content }[]`，可传 `defaultOpenId`。条目 ID 稳定且唯一，`content` 是 React 内容。组件内部保存一个展开 ID：点未展开项会切换并收起旧项，点当前项会收起。`defaultOpenId` 只影响首次渲染，后续外部改变它不会覆盖内部状态。服务端内容和权限仍由宿主决定。

每个标题是原生按钮，`aria-expanded` 与内容同步；Tab 后按 Enter/空格操作。内容在收起时不挂载，因此内部表单草稿会丢失，需要保留草稿的场景应在宿主持有值。

## 复制与迁移

- 组件与样式：`src/components/ui/collapse-panel.tsx`、`collapse-panel.css`。
- 可运行调用：`src/examples/collapse-panel-example.tsx`。
- 依赖：React / React DOM、`lucide-react`；宿主加载 CSS。

验收时依次展开、切换、收起，核对长内容折行与键盘操作。
