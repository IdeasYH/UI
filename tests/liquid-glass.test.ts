import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveTemplatePage, filterComponentCatalog } from '../src/data/template-catalog.ts'
import { componentReferences } from '../src/data/component-references.ts'

test('液态玻璃可以从独立页面、语义 ID 和源码包找到', () => {
  assert.equal(resolveTemplatePage('/examples/liquid-glass'), 'liquid-glass')
  assert.ok(filterComponentCatalog('liquid-glass').some(item => item.id === 'liquid-glass'))
  assert.ok(componentReferences['liquid-glass'].files.includes('src/components/liquid-glass/liquid-glass.css'))
})
