import { useState } from 'react'
import { Cascader, SearchSelect, StarRating, ToggleSwitch, TreeSelect } from './ui/selection-controls'
import type { SelectionNode } from './ui/selection-model'

const cityOptions = [
  { value: 'hz', label: '杭州', pinyin: 'hangzhou', initials: 'hz' },
  { value: 'sz', label: '深圳', pinyin: 'shenzhen', initials: 'sz' },
  { value: 'xa', label: '西安', pinyin: 'xian', initials: 'xa' },
  { value: 'xn', label: '西宁', pinyin: 'xining', initials: 'xn' },
  { value: 'sh', label: '上海', pinyin: 'shanghai', initials: 'sh' },
  { value: 'bj', label: '北京', pinyin: 'beijing', initials: 'bj' },
  { value: 'gz', label: '广州', pinyin: 'guangzhou', initials: 'gz' },
]
// 仅为交互演示的节选数据，不作为完整行政区划数据源。
const areas: SelectionNode[] = [
  { value: 'gd', label: '广东省', children: [
    { value: 'sz', label: '深圳市', children: [{ value: 'ns', label: '南山区' }, { value: 'ft', label: '福田区' }, { value: 'lh', label: '罗湖区' }] },
    { value: 'gz', label: '广州市', children: [{ value: 'th', label: '天河区' }, { value: 'yx', label: '越秀区' }] },
  ] },
  { value: 'zj', label: '浙江省', children: [
    { value: 'hz', label: '杭州市', children: [{ value: 'xh', label: '西湖区' }, { value: 'sc', label: '上城区' }] },
    { value: 'nb', label: '宁波市', children: [{ value: 'hs', label: '海曙区' }, { value: 'yz', label: '鄞州区' }] },
  ] },
]
const organizations: SelectionNode[] = [{ value: 'center', label: '研发中心', children: [
  { value: 'front', label: '前端组', children: [{ value: 'framework', label: '框架小组' }, { value: 'infra', label: '基建小组' }] },
  { value: 'back', label: '后端组' }, { value: 'data', label: '数据组' },
] }]

export function SwitchPreview() { const [checked, setChecked] = useState(false); return <ToggleSwitch label="消息通知" checked={checked} onChange={setChecked} /> }
export function RatingPreview() { const [value, setValue] = useState(3.5); return <StarRating value={value} onChange={setValue} /> }
export function SelectPreview() {
  const [plan, setPlan] = useState('旗舰版')
  const [city, setCity] = useState('sz')
  return <div className="selection-preview-stack"><SearchSelect label="选择套餐" options={['标准版', '专业版', '旗舰版', '企业版', '定制版'].map(label => ({ value: label, label }))} value={plan} onChange={setPlan} /><SearchSelect label="选择城市" options={cityOptions} value={city} onChange={setCity} /></div>
}
export function CascaderPreview() { const [value, setValue] = useState<string[]>([]); return <><Cascader label="收货地区（省市区三级，节选示例）" nodes={areas} value={value} onChange={setValue} /><p className="form-preview-result">在同一面板逐级选择，选到区后确认。</p></> }
export function TreePreview() { const [value, setValue] = useState<string[]>(['framework']); return <TreeSelect nodes={organizations} value={value} onChange={setValue} /> }
