# Luminary Card 个人收藏

在 `/examples/luminary-card` 使用完整定制器；组件总览的“数据与状态”分类和说明书界面地图也可进入。

## 交互与数据

- 左侧为卡片预览，右侧为六组中文配置面板：卡片、配色、纹理、光照、内容、场景。输入和选择即时生效，面板可折叠；预设、选项、按钮、辅助说明与成功/错误提示均使用中文。
- 支持卡片比例、宽度、圆角、票券孔洞、五种配色、自定义颜色、纹理与浮雕、反光和倾斜、标题及持卡人、独立 Star / Rings 标记、极光背景。
- 鼠标和触屏驱动倾斜；聚焦卡片后用方向键调整，Escape / Home 回正。减少动态效果偏好会停止动态倾斜与背景动画；WebGL 不可用时保留 CSS 背景。
- 设置保存在当前浏览器、当前网站来源的 `localStorage`，键为 `uimodel:luminary-card:v1`；刷新可恢复。不是会员系统，不连接登录、支付、数据库或业务接口。初始持卡人和编号均为原作示例文案。
- “导入 / 导出”操作读写 JSON 配置，包含自定义图片；不是导出 PNG 或生成实体会员卡。上传图片上限 3 MB，解码后转为最长边不超过 1024px 的 PNG；JSON 文件上限 5 MB。格式错误在定制器内提示，原配置保留。
- 中文化只调整界面文案；JSON 的字段名、枚举值、版本号和本地保存键保持兼容，已有配置无需转换。卡面默认标题与持卡人保留原作示例，可在“内容”面板自行修改。
- 内容通过 `textContent` 写入；配置限制枚举、数值范围和颜色，自定义图片只接受限定格式的 data URL。HTML 入口只解析本仓库固定模板。

## 实现与复制边界

React 入口为 `src/components/luminary-card/luminary-card.tsx`，真实调用位于 `src/pages/luminary-card-page.tsx`，最小调用示例位于 `src/examples/luminary-card-example.tsx`。卡面和控制面板保留原始 DOM / CSS / JavaScript，通过 Shadow DOM 隔离 `.card` 等通用类名和 ID；没有新增第三方依赖。不是对原定制器的全量 React 重写。

复制需带整个 `src/components/luminary-card/` 目录，以及 `src/pages/luminary-card-page.css` 内的字体声明和容器尺寸。Vite 提供 `?raw` HTML 与 `?inline` CSS 导入，并将字体和纹理作为本地构建资产处理。仅复制 TSX 入口不足以运行。React 卸载时清理事件监听、观察器、倾斜动画、WebGL、延时任务和临时图片 URL；已开始的异步文件读取在卸载后不再更新配置。

本收藏以完整页面登记，不纳入自动组件源码 JSON 下载包。外部使用前需要自行核对素材与代码授权、宿主布局及浏览器能力。

## 来源

- 收藏仓库：[Johnlzx/luminary-card](https://github.com/Johnlzx/luminary-card)，固定提交 `dce991d1d1bf1f99f89e36821cec93f1c5b17cf3`。
- 原视觉参考：Ding / @dingyi。部分箔面素材、CSS 合成、弹簧运动和极光实现经 [wildematt/flashcard](https://github.com/wildematt/flashcard) 取得，原代码和素材来源为 [Elyx](https://elyx.design/)。
- `rosette.png` 与 `rosette-emboss.png` 由收藏仓库从参考视频提取。Instrument Serif 字体使用 SIL Open Font License 1.1，许可保存在 `assets/InstrumentSerif-OFL.txt`。
- 原始来源记录和上游说明完整保留在收藏目录的 `THIRD_PARTY.md`、`assets/UPSTREAM-README.md`。

这是用户授权加入的个人收藏参考。仓库及部分上游代码没有开放源代码许可证，上游声明学习及个人欣赏用途；此接入不改变授权范围，也不将原代码或素材重新标为 MIT。未引入参考视频和逐帧分析资料，不宣称逐像素复刻。
