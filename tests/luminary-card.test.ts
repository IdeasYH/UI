import assert from 'node:assert/strict'
import test from 'node:test'
import { componentCatalog, examplePages, filterComponentCatalog, resolveTemplatePage } from '../src/data/template-catalog.ts'

test('个人收藏的全息卡片可从目录检索并直达完整定制器', () => {
  assert.equal(resolveTemplatePage('/examples/luminary-card'), 'luminary-card')
  const entry = componentCatalog.find(component => component.id === 'luminary-card')
  assert.ok(entry)
  assert.equal(entry.preview, 'page')
  assert.ok(filterComponentCatalog('全息', 'display').some(component => component.id === entry.id))
  assert.equal(entry.locations[0].href, '/examples/luminary-card')
  assert.ok(examplePages.some(page => page.id === 'luminary-card' && page.href === '/examples/luminary-card'))
})
