# Timeline：有序事件

当事件有先后顺序且需要辨认完成进度时使用。物流、审批和项目里程碑都可映射为相同结构；时间轴只展示调用方已知的数据，不推算下一步时间，也不提交状态。

## 接口与状态

`steps: { id, title, time?, description? }[]`、`completedCount: number`，可选 `label`。数组顺序就是展示顺序，ID 应稳定；`completedCount` 从 0 到长度取界，前 N 项显示已完成。空数组显示空列表，宿主应按业务需要给空态。未来时间未知则不传 `time`。

使用有序列表语义，节点图标与连线区分完成和未完成；颜色并非唯一信息，文本顺序仍可读。示例的“下一步”按钮只修改本地演示状态。

## 复制与迁移

- 组件与样式：`src/components/ui/timeline.tsx`、`timeline.css`。
- 可运行调用：`src/examples/timeline-example.tsx`。四个时间均为演示数据，不应当作实际事件记录。
- 依赖：React / React DOM、`lucide-react`；宿主提供真实事件、时间口径和更新机制。

验收 0 项、部分、全部完成与空列表；确认历史时间与业务数据一致，窄屏文字不覆盖节点。
