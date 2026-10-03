import assert from 'node:assert/strict'
import test from 'node:test'
import { filterComponentCatalog } from '../src/data/template-catalog.ts'

test('按交互结构发现组件，不要求需求使用演示业务名称', () => {
  for (const [query, id] of [['单值', 'search-select'], ['连续区间', 'date-range'], ['前置条件', 'prerequisite-action'], ['层级路径', 'cascader'], ['多选', 'tree-select']]) {
    assert.ok(filterComponentCatalog(query).some(entry => entry.id === id), `${query} 应找到 ${id}`)
  }
})
