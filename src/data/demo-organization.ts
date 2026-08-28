import type { PersonOption } from '../components/person-picker/types'
import { demoPeople } from './demo-people.ts'

export type EmploymentStatus = 'active' | 'pending' | 'departed'
export type OrganizationTone = 'blue' | 'mint' | 'peach' | 'neutral'

export type Organization = {
  id: string
  name: string
  parentId: string | null
  kind: '公司' | '事业部' | '部门' | '小组'
  code: string
  tone: OrganizationTone
  managerId: string
}

export type OrganizationPerson = PersonOption & {
  organizationId: string
  position: string
  level: string
  status: EmploymentStatus
  joinedAt: string
  office: string
}

export const organizationStatuses = [
  { id: 'active', label: '在职人员', shortLabel: '在职' },
  { id: 'pending', label: '待入职', shortLabel: '待入职' },
  { id: 'departed', label: '已离职', shortLabel: '已离职' },
] as const

// All relationships are fictional. No live HRM roster or organization data is loaded.
export const demoOrganizations: readonly Organization[] = [
  { id: 'company', name: '尚毅中台', parentId: null, kind: '公司', code: 'ORG-001', tone: 'neutral', managerId: 'demo-person-001' },
  { id: 'flower', name: '鲜花事业部', parentId: 'company', kind: '事业部', code: 'ORG-010', tone: 'blue', managerId: 'demo-person-002' },
  { id: 'flower-operations', name: '鲜花美团运营部', parentId: 'flower', kind: '部门', code: 'ORG-011', tone: 'blue', managerId: 'demo-person-003' },
  { id: 'flower-one', name: '运营一组', parentId: 'flower-operations', kind: '小组', code: 'ORG-012', tone: 'blue', managerId: 'demo-person-005' },
  { id: 'flower-two', name: '运营二组', parentId: 'flower-operations', kind: '小组', code: 'ORG-013', tone: 'blue', managerId: 'demo-person-006' },
  { id: 'flower-growth', name: '鲜花商家成长部', parentId: 'flower', kind: '部门', code: 'ORG-014', tone: 'blue', managerId: 'demo-person-004' },
  { id: 'flower-onboarding', name: '新商培育组', parentId: 'flower-growth', kind: '小组', code: 'ORG-015', tone: 'blue', managerId: 'demo-person-007' },
  { id: 'fruit', name: '水果事业部', parentId: 'company', kind: '事业部', code: 'ORG-020', tone: 'mint', managerId: 'demo-person-013' },
  { id: 'fruit-operations', name: '水果运营部', parentId: 'fruit', kind: '部门', code: 'ORG-021', tone: 'mint', managerId: 'demo-person-014' },
  { id: 'fruit-service', name: '客户服务组', parentId: 'fruit', kind: '小组', code: 'ORG-022', tone: 'mint', managerId: 'demo-person-015' },
  { id: 'support', name: '职能支持部', parentId: 'company', kind: '部门', code: 'ORG-030', tone: 'peach', managerId: 'demo-person-018' },
  { id: 'hr', name: '人力资源组', parentId: 'support', kind: '小组', code: 'ORG-031', tone: 'peach', managerId: 'demo-person-019' },
  { id: 'product', name: '产品研发组', parentId: 'support', kind: '小组', code: 'ORG-032', tone: 'peach', managerId: 'demo-person-020' },
]

const assignments = [
  ['company', '总经理', 'M5'],
  ['flower', '事业部负责人', 'M4'],
  ['flower-operations', '运营经理', 'M3'],
  ['flower-growth', '成长经理', 'M3'],
  ['flower-one', '运营组长', 'M2'],
  ['flower-two', '运营组长', 'M2'],
  ['flower-onboarding', '培育组长', 'M2'],
  ['flower-one', '高级运营', 'P5'],
  ['flower-one', '运营专员', 'P4'],
  ['flower-two', '高级运营', 'P5'],
  ['flower-two', '运营专员', 'P4'],
  ['flower-onboarding', '商家顾问', 'P4'],
  ['fruit', '事业部负责人', 'M4'],
  ['fruit-operations', '运营经理', 'M3'],
  ['fruit-service', '客服组长', 'M2'],
  ['fruit-operations', '运营专员', 'P4'],
  ['fruit-service', '客户顾问', 'P4'],
  ['support', '职能负责人', 'M3'],
  ['hr', '人事专员', 'P5'],
  ['product', '产品负责人', 'M2'],
  ['flower-one', '运营专员', 'P3'],
  ['flower-two', '运营专员', 'P4'],
] as const

export const organizationPeople: readonly OrganizationPerson[] = demoPeople.map((person, index) => {
  const [organizationId, position, level] = assignments[index]
  return {
    ...person,
    organizationId,
    organizationName: demoOrganizations.find((organization) => organization.id === organizationId)!.name,
    position,
    level,
    status: index === 20 ? 'pending' : index === 21 ? 'departed' : 'active',
    joinedAt: index === 20 ? '2026-09-01' : `202${3 + index % 3}-${String(1 + index % 9).padStart(2, '0')}-18`,
    office: '杭州 · 总部',
  }
})
