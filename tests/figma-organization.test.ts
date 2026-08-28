import assert from 'node:assert/strict'
import test from 'node:test'
import { demoDepartmentData } from '../src/data/figma-organization.ts'
import { applyFigmaAction, canvasScale, filterFigmaGroups, findFigmaMember, fitFigmaCanvas, kpiTone, nextDemoCode, type FigmaDepartment } from '../src/components/figma-organization/figma-organization-model.ts'
import { componentCatalog, examplePages, resolveTemplatePage } from '../src/data/template-catalog.ts'

const fixture = (): FigmaDepartment => structuredClone(demoDepartmentData)
const draft = { name: '示例新员工', code: 'E000350', position: '运营专员', level: 'P6-1' }

test('Figma 复刻有独立路由、预览与三个可检索组件入口', () => {
  assert.equal(resolveTemplatePage('/organization/figma/'), 'organization-figma')
  assert.ok(examplePages.some((page) => page.id === 'organization-figma'))
  assert.equal(componentCatalog.filter((item) => item.id.startsWith('figma-')).length, 3)
})

test('源稿汇总人数与节选名录保持独立，新增时只增加一人且绩效待统计', () => {
  const original = fixture()
  const before = structuredClone(original)
  const group = original.groups[0]
  assert.equal(original.totalCount, 36)
  assert.equal(original.groups.flatMap((item) => item.members).length, 15)
  const result = applyFigmaAction(original, { type: 'add-member', groupId: group.id, id: 'new-member', draft })
  assert.equal(result.error, null)
  assert.equal(result.department.totalCount, 37)
  assert.equal(result.department.groups[0].memberCount, group.memberCount + 1)
  assert.equal(result.department.groups[0].members.length, group.members.length + 1)
  assert.equal(findFigmaMember(result.department, 'new-member')?.member.kpiRate, null)
  assert.equal(findFigmaMember(result.department, 'new-member')?.member.accountStatus, 'unopened')
  assert.deepEqual(original, before)
})

test('工号在成员、组长和经理之间均不可重复，自动编号跳过已用值', () => {
  const original = fixture()
  const codes = [original.manager.code, original.groups[0].leader!.code, original.groups[2].members[0].code]
  for (const code of codes) {
    const result = applyFigmaAction(original, { type: 'add-member', groupId: original.groups[0].id, id: 'new-member', draft: { ...draft, code: ` ${code.toLowerCase()} ` } })
    assert.match(result.error!, /工号已存在/)
    assert.equal(result.department, original)
  }
  original.manager.code = 'e000350'
  original.groups[0].leader!.code = 'E000351'
  original.groups[0].members[0].code = 'E000352'
  assert.equal(nextDemoCode(original), 'E000353')
})

test('业务组新增为空组织；重命名不改变人员，拒绝空白、重名和不存在的组', () => {
  const original = fixture()
  const added = applyFigmaAction(original, { type: 'add-group', id: 'new-group', name: ' 运营七组 ' })
  assert.equal(added.error, null)
  const group = added.department.groups.at(-1)!
  assert.equal(group.groupName, '运营七组')
  assert.equal(group.leader, null)
  assert.equal(group.memberCount, 0)
  assert.deepEqual(group.members, [])
  assert.equal(added.department.totalCount, original.totalCount)
  const renamed = applyFigmaAction(added.department, { type: 'rename-group', groupId: 'new-group', name: '内容运营组' })
  assert.equal(renamed.department.groups.at(-1)?.groupName, '内容运营组')
  for (const name of ['', '   ', original.groups[0].groupName, '长'.repeat(41)]) {
    assert.ok(applyFigmaAction(original, { type: 'add-group', id: 'new-group', name }).error)
  }
  assert.ok(applyFigmaAction(original, { type: 'rename-group', groupId: 'missing', name: '内容运营组' }).error)
})

test('编辑仅更新指定人员资料，保留工号和绩效', () => {
  const original = fixture()
  const member = original.groups[0].members[0]
  const result = applyFigmaAction(original, { type: 'edit-member', memberId: member.id, draft: { name: ' 新姓名 ', position: '新岗位', level: 'P7-1' } })
  const edited = findFigmaMember(result.department, member.id)!.member
  assert.equal(result.error, null)
  assert.equal(edited.name, '新姓名')
  assert.equal(edited.code, member.code)
  assert.equal(edited.kpiRate, member.kpiRate)
  assert.equal(result.department.totalCount, original.totalCount)
  assert.equal(original.groups[0].members[0].name, member.name)
  assert.ok(applyFigmaAction(original, { type: 'edit-member', memberId: 'missing', draft }).error)
  assert.ok(applyFigmaAction(original, { type: 'edit-member', memberId: member.id, draft: { ...draft, name: ' ' } }).error)
})

test('调岗保留人员身份和部门总数，原组与目标组人数一减一增', () => {
  const original = fixture()
  const source = original.groups[0]
  const target = original.groups[1]
  const member = source.members[0]
  const result = applyFigmaAction(original, { type: 'transfer-member', memberId: member.id, groupId: target.id })
  assert.equal(result.error, null)
  assert.equal(result.department.totalCount, original.totalCount)
  assert.equal(result.department.groups[0].memberCount, source.memberCount - 1)
  assert.equal(result.department.groups[1].memberCount, target.memberCount + 1)
  assert.equal(findFigmaMember(result.department, member.id)?.group.id, target.id)
  assert.deepEqual(findFigmaMember(result.department, member.id)?.member, member)
  assert.equal(result.department.groups.flatMap((group) => group.members).filter((item) => item.id === member.id).length, 1)
  assert.ok(applyFigmaAction(original, { type: 'transfer-member', memberId: member.id, groupId: source.id }).error)
  assert.ok(applyFigmaAction(original, { type: 'transfer-member', memberId: member.id, groupId: 'missing' }).error)
})

test('离职只移除当前示例成员，重复提交不再扣减人数', () => {
  const original = fixture()
  const member = original.groups[0].members[0]
  const result = applyFigmaAction(original, { type: 'departure', memberId: member.id })
  assert.equal(result.error, null)
  assert.equal(result.department.totalCount, 35)
  assert.equal(result.department.groups[0].memberCount, original.groups[0].memberCount - 1)
  assert.equal(findFigmaMember(result.department, member.id), null)
  const again = applyFigmaAction(result.department, { type: 'departure', memberId: member.id })
  assert.ok(again.error)
  assert.equal(again.department, result.department)
  assert.ok(findFigmaMember(original, member.id))
})

test('搜索组织、经理、组长、姓名、工号与登录账号，空查询恢复完整目录', () => {
  const original = fixture()
  const group = original.groups[0]
  const member = group.members[0]
  assert.equal(filterFigmaGroups(original, '   '), original.groups)
  assert.equal(filterFigmaGroups(original, original.manager.name), original.groups)
  assert.deepEqual(filterFigmaGroups(original, group.groupName), [group])
  assert.deepEqual(filterFigmaGroups(original, group.leader!.name), [group])
  for (const query of [member.name, member.code.toLowerCase(), member.loginAccount]) {
    const found = filterFigmaGroups(original, query)
    assert.equal(found.length, 1)
    assert.equal(found[0].members[0].id, member.id)
    assert.equal(found[0].memberCount, group.memberCount)
  }
  assert.deepEqual(filterFigmaGroups(original, '未找到的名字'), [])
})

test('绩效阈值包含 0、75、90，空值与无效值不被伪装成零', () => {
  for (const value of [null, Number.NaN, -1, 101]) assert.equal(kpiTone(value), 'unknown')
  assert.equal(kpiTone(0), 'warning')
  assert.equal(kpiTone(74.9), 'warning')
  assert.equal(kpiTone(75), 'good')
  assert.equal(kpiTone(89.9), 'good')
  assert.equal(kpiTone(90), 'excellent')
  assert.equal(kpiTone(100), 'excellent')
})

test('缩放有边界，适应画布同时考虑宽高且保持内容居中', () => {
  assert.equal(canvasScale(0), 0.1)
  assert.equal(canvasScale(2), 1.4)
  assert.equal(canvasScale(0.699999999), 0.7)
  const viewport = { width: 1200, height: 686 }
  const content = { width: 1850, height: 744 }
  const fitted = fitFigmaCanvas(viewport, content)
  assert.ok(content.width * fitted.scale <= viewport.width)
  assert.ok(content.height * fitted.scale + fitted.y <= viewport.height)
  assert.equal(fitted.x, (viewport.width - content.width * fitted.scale) / 2)
})
