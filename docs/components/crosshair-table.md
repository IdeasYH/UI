# CrosshairTable：行列交叉定位

ID：`table-crosshair-highlight`。用于密集表格中跟随鼠标定位当前行、列及交汇单元格，不限于经营数据或具体业务。它不改变选择、点击、排序或权限。

将普通 table 替换为 CrosshairTable，继续传入原生表格属性及 thead/tbody。真实示例见 `src/examples/crosshair-table-example.tsx`；字段配置／筛选示例也已接入。

同行、同列默认背景 `#eee8fc`，交汇背景 `#ddd1f7`，110ms 淡入淡出，没有额外外框。移出清除；触屏不启用悬停，减少动态效果设置下取消过渡。通过 CSS 变量 `--crosshair-soft` 和 `--crosshair-intersection` 可调整色彩。控件自身焦点轮廓保留。

仅支持没有 rowspan/colspan 的平铺原生表格，不支持虚拟列表或合并单元格。使用浏览器行列索引；数据筛选／列重排时宿主应更新 key 重挂载，清除旧定位。样式按每个实例隔离，只在进入不同单元格时更新状态，不监听每个像素的鼠标移动。宿主传入的 id 由内部唯一 id 取代以隔离动态样式。

复制 `crosshair-table.tsx` 和同目录 CSS，需要 React/React DOM。表格边线、宽度、固定列、滚动与数据由宿主提供。只增加视觉辅助，不能把悬停当作已选中状态或依赖颜色表达业务信息。
