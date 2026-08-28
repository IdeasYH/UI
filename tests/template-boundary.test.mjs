import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const config = JSON.parse(readFileSync(new URL('../src/data/portal-config.json', import.meta.url), 'utf8'))

test('复制的门户配置保留原有五个系统和菜单，并提供人员组件入口', () => {
  assert.equal(config.cards.length, 5)
  assert.ok(config.megaMenus.length >= 4)
  assert.ok(config.navigation.some((item) => item.href === '/components/person-picker'))
})

test('默认入口均在模板内部，不跳转原业务服务', () => {
  const hrefs = []
  function visit(value) {
    if (!value || typeof value !== 'object') return
    for (const [key, child] of Object.entries(value)) {
      if (key === 'href' && typeof child === 'string' && child) hrefs.push(child)
      else visit(child)
    }
  }
  visit(config)
  assert.ok(hrefs.length > 0)
  for (const href of hrefs) assert.ok(href.startsWith('#') || (href.startsWith('/') && !href.startsWith('//')), href)
})
