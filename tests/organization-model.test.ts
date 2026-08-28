import assert from 'node:assert/strict'
import test from 'node:test'
import { demoOrganizations, organizationPeople } from '../src/data/demo-organization.ts'
import { descendantIds, organizationConnector, organizationCounts, organizationMembers, organizationPath, visibleOrganizationIds } from '../src/components/organization/organization-model.ts'
import { personnelDemoMonth, personnelRecords } from '../src/data/demo-personnel.ts'
import { personnelOverview, personnelPagination } from '../src/components/organization/personnel-management-model.ts'

test('组织版本共用完整的虚构组织与人员，负责人属于当前组织', () => {
  assert.equal(demoOrganizations.length, 13)
  assert.equal(organizationPeople.length, 22)
  assert.equal(new Set(demoOrganizations.map((organization) => organization.id)).size, 13)
  assert.equal(new Set(organizationPeople.map((person) => person.personId)).size, 22)
  assert.deepEqual(demoOrganizations.filter((organization) => !organization.parentId).map((organization) => organization.id), ['company'])
  for (const organization of demoOrganizations) {
    if (organization.parentId) assert.ok(demoOrganizations.some((parent) => parent.id === organization.parentId))
    assert.equal(organizationPeople.find((person) => person.personId === organization.managerId)?.organizationId, organization.id)
    const path = organizationPath(demoOrganizations, organization.id)
    assert.equal(path[0].id, 'company')
    assert.equal(path.at(-1)?.id, organization.id)
  }
  for (const person of organizationPeople) {
    assert.ok(demoOrganizations.some((organization) => organization.id === person.organizationId))
    assert.ok(person.employeeNumber?.startsWith('DEMO'))
  }
})

test('人员管理补充展示状态，不改变共享名册或包含下级的统计范围', () => {
  const snapshot = JSON.stringify(organizationPeople)
  assert.deepEqual(personnelRecords.map(({ accountStatus, documentStatus, ...person }) => person), organizationPeople)
  const flowerIds = descendantIds(demoOrganizations, 'flower')
  const scoped = personnelRecords.filter((person) => flowerIds.has(person.organizationId))
  assert.deepEqual(personnelOverview(scoped, personnelDemoMonth), { active: 11, pending: 1, joinedThisMonth: 0, withoutAccount: 3 })
  assert.equal(JSON.stringify(organizationPeople), snapshot)
  assert.ok(personnelRecords.filter((person) => person.status === 'pending').every((person) => person.accountStatus === '未开通'))
})

test('人员概览按指定月份精确取值，不计入离职、待入职和未来月份', () => {
  const person = personnelRecords[0]
  const rows = [
    { ...person, joinedAt: '2026-08-01', accountStatus: '未开通' as const },
    { ...person, joinedAt: '2026-08-31' },
    { ...person, joinedAt: '2026-09-01' },
    { ...person, joinedAt: '2025-08-01' },
    { ...person, joinedAt: '2026-08-10', status: 'pending' as const, accountStatus: '未开通' as const },
    { ...person, joinedAt: '2026-08-10', status: 'departed' as const },
  ]
  assert.deepEqual(personnelOverview(rows, '2026-08'), { active: 4, pending: 1, joinedThisMonth: 2, withoutAccount: 1 })
  assert.deepEqual(personnelOverview([], '2026-08'), { active: 0, pending: 0, joinedThisMonth: 0, withoutAccount: 0 })
})

test('人员管理分页处理末页、筛选后越界、每页条数和空列表', () => {
  const rows = Array.from({ length: 125 }, (_, index) => index + 1)
  assert.deepEqual(personnelPagination(rows, 2, 10).items, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  assert.deepEqual(personnelPagination(rows, 99, 10), { page: 13, pages: 13, items: [121, 122, 123, 124, 125], buttons: [1, '…', 12, 13] })
  assert.deepEqual(personnelPagination(rows, 6, 10).buttons, [1, '…', 5, 6, 7, '…', 13])
  assert.equal(personnelPagination(rows, 1, 50).items.length, 50)
  assert.deepEqual(personnelPagination(rows.slice(0, 1), 6, 10), { page: 1, pages: 1, items: [1], buttons: [1] })
  assert.deepEqual(personnelPagination([], 5, 20), { page: 1, pages: 1, items: [], buttons: [1] })
})

test('组织路径与下级范围包含自身，不包含同级和兄弟分支', () => {
  assert.deepEqual(organizationPath(demoOrganizations, 'flower-one').map((organization) => organization.id), ['company', 'flower', 'flower-operations', 'flower-one'])
  assert.deepEqual([...descendantIds(demoOrganizations, 'flower-operations')], ['flower-operations', 'flower-one', 'flower-two'])
  assert.equal(descendantIds(demoOrganizations, 'flower').size, 6)
  assert.equal(descendantIds(demoOrganizations, 'company').size, 13)
  assert.equal(descendantIds(demoOrganizations, 'missing').size, 0)
  assert.deepEqual(organizationPath(demoOrganizations, 'missing'), [])
})

test('人数按当前状态累计整个下级范围，直属人数不重复计算', () => {
  const active = organizationCounts(demoOrganizations, organizationPeople, 'active')
  assert.equal(active.get('company'), 20)
  assert.equal(active.get('flower'), 11)
  assert.equal(active.get('flower-operations'), 7)
  assert.equal(active.get('flower-one'), 3)
  assert.equal(active.get('fruit'), 5)
  assert.equal(active.get('support'), 3)
  const directTotal = demoOrganizations.reduce((total, organization) => total + organizationMembers(demoOrganizations, organizationPeople, organization.id, 'active', '', false).length, 0)
  assert.equal(directTotal, 20)
  assert.equal(organizationMembers(demoOrganizations, organizationPeople, 'flower', 'active', '', false).length, 1)
})

test('在职、待入职和已离职互斥，空组织保留零人数', () => {
  const pending = organizationCounts(demoOrganizations, organizationPeople, 'pending')
  const departed = organizationCounts(demoOrganizations, organizationPeople, 'departed')
  assert.equal(pending.get('company'), 1)
  assert.equal(pending.get('flower-one'), 1)
  assert.equal(pending.get('fruit'), 0)
  assert.equal(departed.get('flower-two'), 1)
  assert.equal(departed.get('flower-one'), 0)
  assert.deepEqual(organizationMembers(demoOrganizations, organizationPeople, 'flower', 'pending').map((person) => person.employeeNumber), ['DEMO021'])
  assert.deepEqual(organizationMembers(demoOrganizations, organizationPeople, 'flower', 'departed').map((person) => person.employeeNumber), ['DEMO022'])
})

test('人员搜索复用姓名、拼音、首字母、工号与账号匹配规则', () => {
  for (const query of ['陈景行', 'chen jing xing', 'CHENJINGXING', ' CJX ', 'demo002', 'chen.jing.xing']) {
    assert.deepEqual(organizationMembers(demoOrganizations, organizationPeople, 'flower', 'active', query).map((person) => person.employeeNumber), ['DEMO002'], query)
  }
  assert.deepEqual(organizationMembers(demoOrganizations, organizationPeople, 'company', 'active', 'syn').map((person) => person.employeeNumber), ['DEMO020'])
  assert.deepEqual(organizationMembers(demoOrganizations, organizationPeople, 'flower', 'departed', 'OYYN').map((person) => person.employeeNumber), ['DEMO022'])
})

test('组织、任职状态、搜索和包含下级开关取交集，不泄露其他范围结果', () => {
  assert.equal(organizationMembers(demoOrganizations, organizationPeople, 'fruit', 'active', 'cjx').length, 0)
  assert.equal(organizationMembers(demoOrganizations, organizationPeople, 'flower', 'pending', 'cjx').length, 0)
  assert.equal(organizationMembers(demoOrganizations, organizationPeople, 'flower', 'active', 'sqh', false).length, 0)
  assert.equal(organizationMembers(demoOrganizations, organizationPeople, 'flower', 'active', 'sqh', true).length, 1)
  assert.equal(organizationMembers(demoOrganizations, organizationPeople, 'flower', 'active', '没有这个人').length, 0)
})

test('收起与层级限制只改变可见节点，不改变组织人数', () => {
  assert.equal(visibleOrganizationIds(demoOrganizations, 'flower', new Set()).size, 6)
  const collapsed = new Set(['flower-operations'])
  assert.deepEqual([...visibleOrganizationIds(demoOrganizations, 'flower', collapsed)], ['flower', 'flower-operations', 'flower-growth', 'flower-onboarding'])
  assert.deepEqual([...visibleOrganizationIds(demoOrganizations, 'flower', new Set(['flower']))], ['flower'])
  assert.deepEqual([...visibleOrganizationIds(demoOrganizations, 'flower', new Set(), 1)], ['flower', 'flower-operations', 'flower-growth'])
  assert.equal(organizationCounts(demoOrganizations, organizationPeople, 'active').get('flower'), 11)
  assert.deepEqual([...collapsed], ['flower-operations'])
})

test('纵横关联线从父节点边缘连接子节点，直线和转角都保留准确端点', () => {
  assert.equal(organizationConnector({ x: 50, y: 100 }, { x: 50, y: 160 }, 'vertical'), 'M 50 100 V 160')
  assert.equal(organizationConnector({ x: 100, y: 50 }, { x: 160, y: 50 }, 'horizontal'), 'M 100 50 H 160')
  const downRight = organizationConnector({ x: 100, y: 100 }, { x: 200, y: 200 }, 'vertical')
  assert.ok(downRight.startsWith('M 100 100 V 143 Q 100 150 107 150'))
  assert.ok(downRight.endsWith('Q 200 150 200 157 V 200'))
  const acrossUp = organizationConnector({ x: 100, y: 200 }, { x: 200, y: 100 }, 'horizontal')
  assert.ok(acrossUp.startsWith('M 100 200 H 143 Q 150 200 150 193'))
  assert.ok(acrossUp.endsWith('Q 150 100 157 100 H 200'))
})
