# SegmentedControl：少量互斥选项

当几个短选项切换**同一个内容区域**，且选择立即生效时使用。筛选周期、密度和视图模式只是例子；若每项对应独立页面及复杂导航，应考虑 Tabs 或路由。选项很多或需检索时改看 SearchSelect。

## 接口与状态

`options: { value, label, disabled? }[]`、`value: string`、`onChange(value)` 和描述用途的 `label`。调用方持有唯一选中值并根据它渲染内容；组件只负责互斥切换、高亮和键盘操作。`value` 应对应一个可用选项，选项 ID 保持稳定。空选项不能形成有效切换，宿主应给空态。

点击即调用 `onChange`；左右/上下方向键、Home、End 可切换可用选项。原生按钮配合 `radiogroup` / `radio` 语义和 `aria-checked`。选中底块滑动；系统要求减少动态效果时取消过渡。

## 复制与迁移

- 组件与样式：`src/components/ui/segmented-control.tsx`、`segmented-control.css`。
- 可运行调用：`src/examples/segmented-control-example.tsx`。数值与柱形只用于演示，应换成宿主的实际数据和内容。
- 依赖：React / React DOM；宿主提供 JSX 构建和 CSS 导入。不要只复制演示数值当作真实统计。

验收时切换三项并检查内容同步、禁用项无法选中、键盘焦点与已选状态一致，以及窄屏时不溢出。
