import assert from 'node:assert/strict'
import test from 'node:test'
import { buttonState, setButtonState, toggleCollapsed, visibilityCode, evaluatePermission, initialPermissions, parsePermissions, setGrant } from '../src/components/permissions/permission-model.ts'

test('本系统功能权限按角色并集，页面和动作均需授权，来源可解释', () => {
  const state = initialPermissions()
  state.subject = { type: 'person', id: 'test-person' }
  state.roles = [{ id: 'page', name: '页面角色', grants: ['page:organization-figma'] }, { id: 'action', name: '新增角色', grants: ['org.create'] }]
  state.bindings['test-person'] = ['page', 'action']
  assert.deepEqual(evaluatePermission(state, 'org.create'), { allowed: true, reason: '来自角色：新增角色', sources: ['新增角色'] })
  state.bindings['test-person'] = ['action']
  assert.equal(evaluatePermission(state, 'org.create').allowed, false)
  state.bindings['test-person'] = ['page']
  assert.equal(evaluatePermission(state, 'org.create').allowed, false)
  assert.equal(evaluatePermission(state, 'unknown').allowed, false)
})

test('HRM准入关闭优先于本系统角色，未分配人员不自动得到页面权限', () => {
  const state = initialPermissions()
  state.subject = { type: 'person', id: 'person-zhou-lin' }
  assert.equal(evaluatePermission(state, 'org.delete').allowed, true)
  state.entry[state.subject.id] = false
  assert.equal(evaluatePermission(state, 'page:organization-figma').allowed, false)
  state.subject = { type: 'person', id: 'unassigned' }
  assert.equal(evaluatePermission(state, 'page:organization-figma').allowed, false)
})

test('功能权限草稿不影响已保存测试结果，关闭页面不删除按钮授权', () => {
  const state = initialPermissions()
  state.subject = { type: 'role', id: 'viewer' }
  state.draft = { roleId: 'viewer', grants: setGrant(state.roles[1].grants, 'org.create', true) }
  assert.equal(evaluatePermission(state, 'org.create').allowed, false)
  state.roles[1].grants = state.draft.grants
  assert.equal(evaluatePermission(state, 'org.create').allowed, true)
  state.roles[1].grants = setGrant(state.roles[1].grants, 'page:organization-figma', false)
  assert.ok(state.roles[1].grants.includes('org.create'))
  assert.equal(evaluatePermission(state, 'org.create').allowed, false)
})

test('权限缓存校验系统和版本，不接受跨系统或未登记权限，正常草稿可往返', () => {
  const state = initialPermissions()
  assert.deepEqual(parsePermissions(JSON.stringify(state)), state)
  assert.equal(parsePermissions(JSON.stringify({ ...state, applicationId: 'other-system' })), null)
  assert.equal(parsePermissions(JSON.stringify({ ...state, version: 2 })), null)
  assert.equal(parsePermissions('{bad json'), null)
  state.roles[0].grants.push('other:admin')
  assert.equal(parsePermissions(JSON.stringify(state)), null)
})
import { demoDepartmentData } from '../src/data/figma-organization.ts'
import { applyFigmaAction, canvasScale, crossLevelResponsiblePersonIds, filterFigmaGroups, findFigmaMember, fitFigmaCanvas, kpiTone, nextDemoCode, responsibleAssignmentCounts, type FigmaDepartment } from '../src/components/figma-organization/figma-organization-model.ts'
import { componentCatalog, examplePages, resolveTemplatePage } from '../src/data/template-catalog.ts'

const fixture = (): FigmaDepartment => structuredClone(demoDepartmentData)
const draft = { name: '示例新员工', code: 'E000350', position: '运营专员', level: 'P6-1' }

test('组织搜索支持中文和拼音缩写，新增及改名后按当前名称匹配', () => {
  const department = fixture()
  assert.deepEqual(filterFigmaGroups(department, ' KFZ ').map((g) => g.groupName), ['客服组'])
  assert.deepEqual(filterFigmaGroups(department, 'xsdcz').map((g) => g.groupName), ['新商督查组'])
  assert.equal(filterFigmaGroups(department, 'xhmtyyb').length, 5)
  const renamed = applyFigmaAction(department, { type: 'rename-group', groupId: department.groups[0].id, name: '内容运营组' }).department
  assert.deepEqual(filterFigmaGroups(renamed, 'nryyz').map((g) => g.groupName), ['内容运营组'])
  assert.equal(filterFigmaGroups(renamed, 'kfz').length, 0)
  assert.equal(filterFigmaGroups(department, 'zzzz').length, 0)
})

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
  const codes = [original.managers[0].code, original.groups[0].leaders[0].code, original.groups[2].members[0].code]
  for (const code of codes) {
    const result = applyFigmaAction(original, { type: 'add-member', groupId: original.groups[0].id, id: 'new-member', draft: { ...draft, code: ` ${code.toLowerCase()} ` } })
    assert.match(result.error!, /工号已存在/)
    assert.equal(result.department, original)
  }
  original.managers[0].code = 'e000350'
  original.groups[0].leaders[0].code = 'E000351'
  original.groups[0].members[0].code = 'E000352'
  assert.equal(nextDemoCode(original), 'E000353')
})

test('业务组新增为空组织；重命名不改变人员，拒绝空白、重名和不存在的组', () => {
  const original = fixture()
  const added = applyFigmaAction(original, { type: 'add-group', id: 'new-group', name: ' 运营七组 ' })
  assert.equal(added.error, null)
  const group = added.department.groups.at(-1)!
  assert.equal(group.groupName, '运营七组')
  assert.equal(group.kpiRate, null)
  assert.deepEqual(group.leaders, [])
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

test('编辑部门名称保留组织身份、任职及汇总；拒绝空白和超长名称', () => {
  const original = fixture()
  const before = structuredClone(original)
  const result = applyFigmaAction(original, { type: 'rename-department', name: ' 鲜花运营中心 ' })
  assert.equal(result.error, null)
  assert.equal(result.department.deptName, '鲜花运营中心')
  assert.equal(result.department.groups, original.groups)
  assert.equal(result.department.managers, original.managers)
  assert.equal(result.department.totalCount, original.totalCount)
  assert.equal(result.department.kpiRate, original.kpiRate)
  assert.deepEqual(original, before)
  for (const name of ['', '   ', '长'.repeat(41)]) {
    const rejected = applyFigmaAction(original, { type: 'rename-department', name })
    assert.match(rejected.error!, /部门名称/)
    assert.equal(rejected.department, original)
  }
})

test('只有空业务组可以删除，人数汇总及原始数据不变，重复删除被拒绝', () => {
  const original = applyFigmaAction(fixture(), { type: 'add-group', id: 'empty-group', name: '临时空组' }).department
  const before = structuredClone(original)
  const result = applyFigmaAction(original, { type: 'delete-group', groupId: 'empty-group' })
  assert.equal(result.error, null)
  assert.equal(result.department.groups.length, original.groups.length - 1)
  assert.ok(!result.department.groups.some((group) => group.id === 'empty-group'))
  assert.equal(result.department.totalCount, original.totalCount)
  assert.deepEqual(original, before)
  const again = applyFigmaAction(result.department, { type: 'delete-group', groupId: 'empty-group' })
  assert.match(again.error!, /已不存在/)
  assert.equal(again.department, result.department)
})

test('负责人、非零汇总人数、节选名录任一存在均阻止删除，不级联移除人员', () => {
  const source = fixture().groups[0]
  const blockers = [
    { leaders: source.leaders, memberCount: 0, members: [] },
    { leaders: [], memberCount: 1, members: [] },
    { leaders: [], memberCount: 0, members: source.members },
  ]
  for (const blocker of blockers) {
    const original = fixture()
    original.groups[0] = { ...source, ...blocker }
    const before = structuredClone(original)
    const result = applyFigmaAction(original, { type: 'delete-group', groupId: source.id })
    assert.match(result.error!, /先迁移人员并解除负责人任职/)
    assert.equal(result.department, original)
    assert.deepEqual(original, before)
  }
})

test('根部门不支持删除：非空提示迁移解除，清空后也不会伪装为删除成功', () => {
  const populated = fixture()
  const blocked = applyFigmaAction(populated, { type: 'delete-department' })
  assert.match(blocked.error!, /先迁移人员与子组并解除负责人任职/)
  assert.equal(blocked.department, populated)
  const empty = { ...fixture(), totalCount: 0, managers: [], groups: [] }
  const unsupported = applyFigmaAction(empty, { type: 'delete-department' })
  assert.match(unsupported.error!, /不支持删除根部门/)
  assert.equal(unsupported.department, empty)
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
  assert.equal(filterFigmaGroups(original, original.managers[0].name), original.groups)
  assert.deepEqual(filterFigmaGroups(original, group.groupName), [group])
  assert.deepEqual(filterFigmaGroups(original, group.leaders[0].name), [group])
  for (const query of [member.name, member.code.toLowerCase(), member.loginAccount]) {
    const found = filterFigmaGroups(original, query)
    assert.equal(found.length, 1)
    assert.equal(found[0].members[0].id, member.id)
    assert.equal(found[0].memberCount, group.memberCount)
  }
  assert.deepEqual(filterFigmaGroups(original, '未找到的名字'), [])
})

test('部和组支持多个平级负责人，同一稳定人员可跨层任职且不改变人数汇总', () => {
  const original = fixture()
  const operationGroup = original.groups.find((group) => group.id === 'grp-op4')!
  const zhouLin = original.managers.find((person) => person.name === '周林')!
  assert.equal(original.managers.length, 2)
  assert.equal(operationGroup.leaders.length, 2)
  assert.ok(operationGroup.leaders.some((person) => person.personId === zhouLin.personId))
  assert.equal(responsibleAssignmentCounts(original).get(zhouLin.personId), 2)
  assert.ok(crossLevelResponsiblePersonIds(original).has(zhouLin.personId))
  assert.equal(original.totalCount, 36)
  assert.equal(operationGroup.memberCount, 10)
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


test('按钮三态分别保存可见与可用，隐藏移除两种授权', () => {
  let grants = setButtonState([], 'portal.enter', 'enabled')
  assert.equal(buttonState(grants, 'portal.enter'), 'enabled')
  grants = setButtonState(grants, 'portal.enter', 'disabled')
  assert.equal(buttonState(grants, 'portal.enter'), 'disabled')
  assert.ok(!grants.includes('portal.enter'))
  grants = setButtonState(grants, 'portal.enter', 'hidden')
  assert.deepEqual(grants, [])
})

test('多角色合并可见与可用，门户入口仍受页面和HRM准入约束', () => {
  const state = initialPermissions()
  state.subject = { type: 'person', id: 'p' }
  state.bindings.p = ['view', 'use']
  state.roles = [{ id: 'view', name: '仅可见', grants: ['page:portal', visibilityCode('portal.enter')] }, { id: 'use', name: '可用', grants: ['portal.enter'] }]
  assert.equal(evaluatePermission(state, 'portal.enter').allowed, true)
  state.bindings.p = ['view']
  assert.equal(evaluatePermission(state, 'portal.enter').allowed, false)
  assert.equal(evaluatePermission(state, visibilityCode('portal.enter')).allowed, true)
  state.roles[0].grants = [visibilityCode('portal.enter')]
  assert.equal(evaluatePermission(state, visibilityCode('portal.enter')).allowed, false)
  state.entry.p = false
  assert.equal(evaluatePermission(state, 'portal.enter').allowed, false)
})

test('权限树连续切换折叠状态不丢失其他页面状态', () => {
  let collapsed = ['page:portal']
  for (let i = 0; i < 20; i++) {
    collapsed = toggleCollapsed(collapsed, 'page:organization-figma')
    assert.equal(collapsed.includes('page:organization-figma'), i % 2 === 0)
    assert.ok(collapsed.includes('page:portal'))
  }
})
