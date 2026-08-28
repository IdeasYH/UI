import assert from 'node:assert/strict'
import test from 'node:test'
import { filterPeople, normalizePersonSearch } from '../src/components/person-picker/person-search.ts'
import type { PersonOption } from '../src/components/person-picker/types.ts'

const people: PersonOption[] = [
  { personId: 'lin', displayName: '林知夏', employeeNumber: 'DEMO001', organizationName: '运营一组', accountLoginName: 'lin.zx', namePinyin: 'lin zhi xia', nameInitials: 'lzx' },
  { personId: 'shan', displayName: '单予宁', employeeNumber: 'DEMO020', organizationName: '运营二组', accountLoginName: 'shan_yn', namePinyin: 'shan yu ning', nameInitials: 'syn' },
  { personId: 'unknown', displayName: '示例人员', employeeNumber: null, organizationName: null, accountLoginName: null, namePinyin: null, nameInitials: null },
  { personId: 'lin-2', displayName: '林知夏', employeeNumber: 'DEMO099', organizationName: '运营三组', accountLoginName: 'lin.second', namePinyin: 'lin zhi xia', nameInitials: 'lzx' },
]

test('中文姓名和部分姓名搜索保留同名人员及原始顺序', () => {
  assert.deepEqual(filterPeople(people, '知夏').map((person) => person.personId), ['lin', 'lin-2'])
  assert.deepEqual(filterPeople(people, '林知夏').map((person) => person.personId), ['lin', 'lin-2'])
})

test('全拼、首字母忽略大小写和空格等分隔符', () => {
  for (const query of ['linzhixia', ' LIN ZHI XIA ', 'LIN_ZHI-XIA', 'lzx', 'L.Z.X']) {
    assert.deepEqual(filterPeople(people, query).map((person) => person.personId), ['lin', 'lin-2'], query)
  }
})

test('工号和账号可以精确或部分匹配', () => {
  for (const query of ['demo020', '020', ' SHAN_YN ', 'shan-yn']) {
    assert.deepEqual(filterPeople(people, query).map((person) => person.personId), ['shan'], query)
  }
})

test('多音姓氏使用名册提供的读音，不自行猜测', () => {
  assert.equal(filterPeople(people, 'shanyuning')[0]?.personId, 'shan')
  assert.equal(filterPeople(people, 'syn')[0]?.personId, 'shan')
  assert.equal(filterPeople(people, 'danyuning').length, 0)
})

test('空查询保留全部人员，空名册和无匹配查询返回空结果', () => {
  assert.deepEqual(filterPeople(people, '   '), people)
  assert.deepEqual(filterPeople([], '林'), [])
  assert.deepEqual(filterPeople(people, '不存在的人员'), [])
})

test('可选字段缺失时姓名搜索仍有效，不加入未约定的组织搜索', () => {
  assert.equal(filterPeople(people, '示例人员')[0]?.personId, 'unknown')
  assert.equal(filterPeople(people, '运营一组').length, 0)
  assert.equal(normalizePersonSearch(null), '')
  assert.equal(normalizePersonSearch(undefined), '')
})

test('搜索不修改调用方的名册、对象或拼音字段', () => {
  const before = structuredClone(people)
  filterPeople(people, 'lzx')
  assert.deepEqual(people, before)
})
