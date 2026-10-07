import test from 'node:test'
import assert from 'node:assert/strict'
import { insertField, moveField, setFieldVisible, type ConfigurableField } from '../src/components/ui/field-config-model.ts'
const fields: ConfigurableField[] = [{ id: 'id', label: '编号', type: 'text', visible: true, locked: true }, { id: 'a', label: '甲', type: 'text', visible: true }, { id: 'b', label: '乙', type: 'number', visible: true }, { id: 'c', label: '丙', type: 'date', visible: false, group: '信息' }]
test('固定字段不能隐藏，隐藏普通字段不丢失定义', () => {
  assert.equal(setFieldVisible(fields, 'id', false)[0].visible, true)
  assert.deepEqual(setFieldVisible(fields, 'a', false)[1], { ...fields[1], visible: false })
})
test('组内排序保留全部字段，不跨组或移动固定字段', () => {
  assert.deepEqual(moveField(fields, 'a', 'b').map(field => field.id), ['id', 'b', 'a', 'c'])
  assert.deepEqual(moveField(fields, 'id', 'b'), fields)
  assert.deepEqual(moveField(fields, 'a', 'c'), fields)
  assert.deepEqual(moveField(fields, 'missing', 'a'), fields)
})

test('拖动按插入线上下精确落位，同位置不变', () => {
  assert.deepEqual(insertField(fields, 'a', 'b', 'before'), fields)
  assert.deepEqual(insertField(fields, 'a', 'b', 'after').map(field => field.id), ['id', 'b', 'a', 'c'])
  assert.deepEqual(insertField(fields, 'b', 'a', 'before').map(field => field.id), ['id', 'b', 'a', 'c'])
  assert.deepEqual(insertField(fields, 'b', 'id', 'before'), fields)
})
