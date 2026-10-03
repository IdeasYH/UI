# UIModel 阅读入口

- 新增或修改前端界面、交互、样式，以及跨项目参考时，先读 [docs/UI-REUSE.md](docs/UI-REUSE.md)，按值的数量、层级、确认时机和依赖寻找原型；业务或组件名称未在目录出现，也先执行这一步。演示业务不是使用白名单。
- 选中组件后读 `docs/components/` 对应契约、`src/examples/` 真实示例与实现；目录只提供索引，复制时核对传递依赖、样式和宿主职责。
- 修改组件行为或复用接口时，同步说明、真实示例、`src/data/template-catalog.ts` 和相关验证；页面注册与文档入口约定见 [docs/TEMPLATE-GUIDE.md](docs/TEMPLATE-GUIDE.md)。
