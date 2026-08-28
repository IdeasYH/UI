# 人员选择器

## 复用文件

入口：`src/components/person-picker/index.ts`。

复制 `person-picker` 目录，同时复用或复制 `components/ui/dropdown-menu.tsx`、`button.tsx`、`input.tsx` 和 `lib/utils.ts`。业务示例页及 `demo-people.ts` 不属于组件依赖。

选择器 CSS 在组件内导入，匹配自身类名，不依赖 Home 的页面布局或 Tailwind 编译。已有 shadcn/ui 的项目可接到现有 Button / Input，保留 ref、原生按钮/输入属性，以及 outline / ghost 变体。

在 Next.js 的客户端组件边界使用时，为组件入口及依赖的 DropdownMenu 增加 `"use client"`；不要导入本模板的示例认证作为生产认证。

## 最小使用

以下代码可放在 `src` 内的客户端组件中。实际项目应将示例数组替换为后端授权名册。

```tsx
import { useState } from 'react'
import { PersonPicker, type PersonOption } from './components/person-picker'

const people: PersonOption[] = [{
  personId: 'demo-person-001',
  displayName: '林知夏',
  employeeNumber: 'DEMO001',
  organizationName: '运营一组',
  accountLoginName: 'lin.zhi.xia',
  namePinyin: 'lin zhi xia',
  nameInitials: 'lzx',
}]

export function OwnerField() {
  const [personId, setPersonId] = useState('')
  return <PersonPicker
    assignees={people}
    value={personId}
    onValueChange={setPersonId}
    shopLabel="当前门店"
    subjectLabel="运营人员"
  />
}
```

## Props

| 属性 | 类型 / 默认 | 用途 |
| --- | --- | --- |
| `assignees` | `readonly PersonOption[]` | 调用方已经授权、筛选的可选名册 |
| `value` | `string` | 稳定 `personId`；空字符串表示未选择 |
| `onValueChange` | `(personId: string) => void` | 选中回传 ID，清除回传空字符串 |
| `id` | 可选字符串 | 与表单 label 关联 |
| `shopLabel` | `''` | 区分表格各行的可访问名称 |
| `subjectLabel` | `'运营人员'` | 可复用于负责人、直属上级等字段 |
| `compact` | `false` | 标准宽度为容器宽；紧凑触发器为 4.75rem × 2rem |
| `disabled` | `false` | 只读状态，仍保留选中回显 |
| `emptyLabel` | 可选字符串 | 未选择时的占位 |
| `unavailableValueLabel` | 可选字符串 | 历史 ID 已不在名册时保留显示，不把它放回可选名单 |

除 `personId` 与 `displayName` 外，人员字段均允许 `null`。同名人员按稳定 ID 区分，列表显示工号和组织辅助识别。

## 搜索契约

沿用 Operator 原实现，在以下五个字段中做包含匹配：姓名、工号、账号、全拼、首字母。

搜索前将查询和字段值转小写，并去掉空格、点、下划线和连字符。空查询展示全部人员，保持输入名册顺序，不修改输入数组。

| 示例输入 | 匹配依据 |
| --- | --- |
| `林知夏` / `知夏` | 姓名 |
| `linzhixia` / `LIN ZHI XIA` | `namePinyin` |
| `lzx` / `L.Z.X` | `nameInitials` |
| `DEMO001` / `001` | 工号 |
| `lin.zhi.xia` | 账号，或相同规范化后的全拼 |

组件不调用拼音服务，不引入拼音库，不按中文姓名猜测读音。多音姓应由名册提供准确读音。例如示例“单予宁”提供 `shan yu ning`，不会按 `dan` 检索出来。

组织只用于展示，不额外加入原实现未包含的搜索字段。空名册和无匹配结果显示空态，回车不会改变已有选择。

## 交互与权限边界

- 打开时重置搜索并聚焦输入框。
- 输入框按向下键进入结果，按回车选择首项；中文输入法组合输入期间不抢占确认键。
- 列表支持上下键、Home / End、回车 / 空格确认。
- 选中或清除后关闭弹层并归还触发器焦点；Esc 关闭，点击或移动焦点到外部关闭。
- 弹层通过 Portal 挂到 body，避开表格滚动裁剪；根据空间向上或向下展开，限制视口内宽度和高度，人员列表独立滚动。
- `disabled` 和可选名单只是 UI 状态，不构成业务授权。后端仍需校验实际分配权限、当前在职状态、稳定人员 ID、并发版本和幂等请求。
- 历史值只回显；业务接入时，不得将离职、无权限或故障时的过期名单作为可选人员兜底。
