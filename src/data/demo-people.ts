import type { PersonOption } from '../components/person-picker/types'

// Fictional fixtures only. These are not copied from the live HRM roster.
const names = [
  ['林知夏', 'lin zhi xia', 'lzx'],
  ['陈景行', 'chen jing xing', 'cjx'],
  ['周予安', 'zhou yu an', 'zya'],
  ['许嘉宁', 'xu jia ning', 'xjn'],
  ['沈清和', 'shen qing he', 'sqh'],
  ['陆星遥', 'lu xing yao', 'lxy'],
  ['宋云舟', 'song yun zhou', 'syz'],
  ['江书言', 'jiang shu yan', 'jsy'],
  ['顾南乔', 'gu nan qiao', 'gnq'],
  ['苏念初', 'su nian chu', 'snc'],
  ['程以南', 'cheng yi nan', 'cyn'],
  ['叶知秋', 'ye zhi qiu', 'yzq'],
  ['温予白', 'wen yu bai', 'wyb'],
  ['唐时雨', 'tang shi yu', 'tsy'],
  ['季明川', 'ji ming chuan', 'jmc'],
  ['方亦辰', 'fang yi chen', 'fyc'],
  ['夏语桐', 'xia yu tong', 'xyt'],
  ['白景初', 'bai jing chu', 'bjc'],
  ['何沐青', 'he mu qing', 'hmq'],
  ['单予宁', 'shan yu ning', 'syn'],
  ['曾嘉禾', 'zeng jia he', 'zjh'],
  ['欧阳一诺', 'ou yang yi nuo', 'oyyn'],
] as const

export const demoPeople: PersonOption[] = names.map(([displayName, namePinyin, nameInitials], index) => ({
  personId: `demo-person-${String(index + 1).padStart(3, '0')}`,
  displayName,
  employeeNumber: `DEMO${String(index + 1).padStart(3, '0')}`,
  organizationName: ['运营一组', '运营二组', '运营三组'][index % 3],
  accountLoginName: namePinyin.replaceAll(' ', '.'),
  namePinyin,
  nameInitials,
}))

export type DemoStore = {
  id: string
  name: string
  province: string
  city: string
  signedAt: string
  initialPersonId: string
  readOnly?: boolean
}

export const demoStores: DemoStore[] = [
  { id: 'DEMO-S001', name: '青禾果园滨江店', province: '浙江省', city: '杭州', signedAt: '2026/08/27 10:30', initialPersonId: 'demo-person-001' },
  { id: 'DEMO-S002', name: '拾光鲜果南山店', province: '广东省', city: '深圳', signedAt: '2026/08/27 09:15', initialPersonId: '' },
  { id: 'DEMO-S003', name: '四季果集天河店', province: '广东省', city: '广州', signedAt: '2026/08/26 16:42', initialPersonId: 'demo-person-003' },
  { id: 'DEMO-S004', name: '果然新鲜江宁店', province: '江苏省', city: '南京', signedAt: '2026/08/26 14:20', initialPersonId: 'demo-person-004' },
  { id: 'DEMO-S005', name: '一口清甜武侯店', province: '四川省', city: '成都', signedAt: '2026/08/26 11:05', initialPersonId: '' },
  { id: 'DEMO-S006', name: '青禾果园鄞州店', province: '浙江省', city: '宁波', signedAt: '2026/08/25 15:36', initialPersonId: 'demo-person-006' },
  { id: 'DEMO-S007', name: '拾光鲜果思明店', province: '福建省', city: '厦门', signedAt: '2026/08/25 10:18', initialPersonId: '' },
  { id: 'DEMO-S008', name: '四季果集姑苏店', province: '江苏省', city: '苏州', signedAt: '2026/08/24 17:50', initialPersonId: 'demo-person-009', readOnly: true },
]

export function initialAssignments(): Record<string, string> {
  return Object.fromEntries(demoStores.map((store) => [store.id, store.initialPersonId]))
}
