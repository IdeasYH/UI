import { organizationPeople, type OrganizationPerson } from './demo-organization.ts'

export type PersonnelRecord = OrganizationPerson & {
  accountStatus: '已开通' | '未开通'
  documentStatus: '已归档' | '待补充' | '已提交' | '不适用'
}

// 固定示例月份，让截图和测试可复现；这不是实时 HRM 月报。
export const personnelDemoMonth = '2026-08'

// 仅为经典结构补充虚构状态，不复制参考 HTML 中的真实人员行，也不修改共用名册。
export const personnelRecords: readonly PersonnelRecord[] = organizationPeople.map((person, index) => ({
  ...person,
  accountStatus: person.status === 'pending' || index % 4 === 1 ? '未开通' : '已开通',
  documentStatus: person.status === 'pending' ? '已提交' : index % 7 === 0 ? '不适用' : index % 5 === 0 ? '待补充' : '已归档',
}))
