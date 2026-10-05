# SwatchColorPicker：固定色板中的单值选择

原作：[Uiverse / chase2k25 / witty-squid-83](https://uiverse.io/chase2k25/witty-squid-83)，基于 Cobp 的色板变体。按原版 HTML 层级与 CSS 参数适配 React：奶油底色、白色漫画面板、4px 黑边与硬阴影、重叠色块和 300ms 动效。保留 ID `swatch-color-picker` 及受控接口。

当可选颜色是**有限且已确定的一组值**，需要让人并列比较并立即选中其中一个时使用。品牌色、标签色和主题预设只是例子；没有列出的业务仍可按“固定候选色 + 单值 + 即时确认”复用。需要连续调整色相、明暗或输入任意 HEX 时，使用已有的 `ColorPicker`，不要把固定色板当作完整色彩空间。

## 接口与状态

`label: string` 描述色板用途；`colors?: readonly string[]` 默认是示例中的 10 色；`value: string` 是已选 HEX；`onChange(color)` 在点击色块时立即触发。调用方持有唯一值，负责保存、撤销、校验和与其他字段的联动。候选色应是有效 CSS 颜色，推荐六位 HEX；每项须唯一。若 `value` 不在候选项中，所有色块都不标记为选中，原值不会被改写。空列表显示空态。

鼠标悬停时当前色块放大 1.5 倍并上移 5px，邻项放大 1.3 倍并上移 3px，次邻项放大 1.15 倍。按下时色块平移 2px、硬阴影缩短。聚焦显示原版绿色 `COPIED!` 气泡；这是原作的 CSS 焦点效果，本身不证明剪贴板成功。真实复制结果由示例下方状态文字报告。点击、Enter 或空格选择；保留 `aria-pressed` 表达受控值，移除旧版额外勾号和蓝框。原作保持单行，不自动换行，宿主需提供足够宽度（默认面板约 366px）和高度（示例 280px），避免放大及提示被裁切。

选色组件本身**不操作剪贴板**。示例在 `onChange` 中演示选中后复制 HEX；浏览器拒绝剪贴板权限时，选中值仍成立。若目标业务不需要复制，直接传 `onChange={setColor}` 即可。

## 复制与迁移

- 组件与样式：`src/components/ui/swatch-color-picker.tsx`、`swatch-color-picker.css`。
- 可运行调用：`src/examples/swatch-color-picker-example.tsx`。示例的 10 色、主题文案和自动复制均可替换。
- 依赖：React / React DOM；宿主提供 JSX 构建与 CSS 导入。组件不依赖 UIModel 门户样式。

验收时检查悬停、邻近放大、选中标识、键盘激活、空候选、窄容器，以及外部更新 `value` 后选中状态同步。

## 原作者许可（复制时保留）

Copyright - 2026 Cobp (Fabio Cobb)

Copyright - 2026 chase2k25 (chandu.exe)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
