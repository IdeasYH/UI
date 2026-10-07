import { CopyValue } from '../components/ui/copy-value'
import { CrosshairTable } from '../components/ui/crosshair-table'
import { FieldConfig } from '../components/ui/field-config'
import type { ConfigurableField } from '../components/ui/field-config-model'
import { useState } from 'react'
import { ConditionFilter } from '../components/ui/condition-filter'
import { formatDay, matchesFilter, type FilterField, type FilterValue } from '../components/ui/condition-filter-model'

const fields: FilterField[] = [
  { id: 'status', label: '合作状态', pinyin: 'hezuozhuangtai', initials: 'hzzt', type: 'select', options: [{ value: 'active', label: '合作中', pinyin: 'hezuozhong', initials: 'hzz', color: '#b7edb1' }, { value: 'ended', label: '已解约', pinyin: 'yijieyue', initials: 'yjy', color: '#ffb5b0' }, { value: 'pending', label: '待合作', pinyin: 'daihezuo', initials: 'dhz', color: '#dce5ff' }, { value: 'ending', label: '待解约', pinyin: 'daijieyue', initials: 'djy', color: '#ffe0bd' }] },
  { id: 'code', label: '店铺编号', pinyin: 'dianpubianhao', initials: 'dpbh', type: 'text' },
  { id: 'date', label: '合作日期', pinyin: 'hezuoriqi', initials: 'hzrq', type: 'date' },
  { id: 'days', label: '留存天数', pinyin: 'liucuntianshu', initials: 'lcts', type: 'number' },
]
export function ConditionFilterExample() {
  const [columns, setColumns] = useState<ConfigurableField[]>(() => [fields[1], fields[0], fields[2], fields[3]].map(field => ({ ...field, visible: true, locked: field.id === 'code', group: field.id === 'date' || field.id === 'days' ? '合作信息' : undefined })))
  const shown = columns.filter(field => field.visible)
  const [today] = useState(() => new Date())
  const [value, setValue] = useState<FilterValue>({ conjunction: 'all', conditions: [] })
  const rows = [
    { code: '示例门店-001', status: 'active', date: formatDay(today), days: 208 },
    { code: '示例门店-002', status: 'ended', date: formatDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)), days: 19 },
    { code: '示例门店-003', status: 'pending', date: formatDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)), days: 0 },
    { code: '示例门店-004', status: 'active', date: formatDay(new Date(today.getFullYear(), today.getMonth() - 1, 1)), days: 52 },
    { code: '示例门店-005', status: 'ending', date: null, days: null },
  ]
  const visible = rows.filter(row => matchesFilter(row, columns, value, today))
  return <div className="cf-demo"><div className="cf-demo-toolbar"><FieldConfig fields={columns} onChange={setColumns} /><ConditionFilter fields={columns} value={value} onChange={setValue} today={today} /><span>虚构数据 · {visible.length} / {rows.length} 条记录</span></div><div className="cf-demo-table"><CrosshairTable key={shown.map(field => field.id).join('|') + visible.map(row => row.code).join('|')}><thead><tr>{shown.map(field => <th key={field.id}>{field.label}</th>)}</tr></thead><tbody>{visible.map(row => <tr key={row.code}>{shown.map(field => { const raw = (row as Record<string, unknown>)[field.id]; const option = field.options?.find(item => item.value === raw); return <td key={field.id}>{field.id === 'code' && typeof raw === 'string' ? <CopyValue value={raw} /> : option ? <span className="cf-tag" style={{ background: option.color }}>{option.label}</span> : raw === null || raw === undefined ? '—' : String(raw)}</td> })}</tr>)}</tbody></CrosshairTable>{!visible.length && <p className="cf-empty" role="status">没有符合条件的记录</p>}</div><p>点击筛选添加条件；完整条件即时生效，未填写条件暂不参与。此处不连接飞书数据。</p></div>
}
