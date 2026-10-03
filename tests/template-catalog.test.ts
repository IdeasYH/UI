import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'
import { componentCatalog, componentCategories, componentPreviewHref, examplePages, filterComponentCatalog, normalizeComponentCategory, organizationVariants, resolveTemplatePage, templatePages } from '../src/data/template-catalog.ts'

test('界面有独立导航，新增组织版本可直达且尾斜线不改变当前界面', () => {
  assert.equal(new Set(templatePages.map((page) => page.href)).size, templatePages.length)
  for (const page of templatePages) {
    assert.equal(resolveTemplatePage(page.href), page.id)
    assert.equal(resolveTemplatePage(`${page.href}/`), page.id)
  }
  assert.equal(resolveTemplatePage('/components/person-picker'), 'people')
  assert.equal(resolveTemplatePage('/components'), 'components')
  assert.equal(resolveTemplatePage('/organization/personnel'), 'organization-personnel')
  for (const variant of organizationVariants) {
    assert.equal(resolveTemplatePage(variant.href), variant.id)
    assert.ok(examplePages.some((page) => page.id === variant.id), variant.id)
  }
})

test('每个目录项都有独立锚点、有效分类、真实源码和界面位置', () => {
  assert.equal(new Set(componentCatalog.map((component) => component.id)).size, componentCatalog.length)
  const categories = new Set<string>(componentCategories.map((category) => category.id))
  for (const component of componentCatalog) {
    assert.ok(categories.has(component.category), component.name)
    assert.ok(component.sources.length && component.locations.length, component.name)
    for (const source of component.sources) {
      assert.ok(source.startsWith('src/') && !source.includes('..'), source)
      assert.ok(existsSync(new URL(`../${source}`, import.meta.url)), source)
    }
    for (const location of component.locations) {
      const url = new URL(location.href, 'http://127.0.0.1:5177')
      assert.equal(url.origin, 'http://127.0.0.1:5177')
      assert.equal(resolveTemplatePage(url.pathname), location.page)
    }
    const preview = new URL(componentPreviewHref(component), 'http://127.0.0.1:5177')
    assert.equal(resolveTemplatePage(preview.pathname), 'components')
    assert.equal(preview.searchParams.get('category'), component.category)
    assert.equal(preview.hash, `#${component.id}`)
  }
})

test('组件搜索匹配中文、组件标识和用途，多个关键词同时满足', () => {
  assert.deepEqual(filterComponentCatalog('人员 拼音').map((entry) => entry.id), ['person-picker'])
  // 完整依赖清单也可被检索，例如日期样板使用独立的 portable-button。
  assert.ok(filterComponentCatalog('  button  ').some((entry) => entry.id === 'button'))
  assert.deepEqual(filterComponentCatalog('  button  '), filterComponentCatalog('BUTTON'))
  assert.ok(filterComponentCatalog('门户配置').some((entry) => entry.id === 'portal-menu-editor'))
  assert.deepEqual(filterComponentCatalog('不会存在的组件'), [])
})

test('分类和搜索取交集，未知分类回到全部且不改变目录顺序', () => {
  const idsBefore = componentCatalog.map((entry) => entry.id)
  assert.equal(normalizeComponentCategory('unknown'), 'all')
  assert.equal(normalizeComponentCategory(null), 'all')
  assert.equal(filterComponentCatalog('', 'unknown').length, componentCatalog.length)
  assert.deepEqual(filterComponentCatalog('拼音', 'display'), [])
  assert.deepEqual(filterComponentCatalog('拼音', 'business').map((entry) => entry.id), ['person-picker'])
  for (const category of componentCategories) {
    assert.ok(filterComponentCatalog('', category.id).length > 0)
    assert.ok(filterComponentCatalog('', category.id).every((entry) => entry.category === category.id))
  }
  assert.deepEqual(componentCatalog.map((entry) => entry.id), idsBefore)
})

test('界面地图的预览图存在，区域入口仍留在模板内部', () => {
  for (const page of examplePages) {
    assert.ok(existsSync(new URL(`../public${page.image}`, import.meta.url)), page.image)
    assert.equal(resolveTemplatePage(page.href), page.id)
    for (const section of page.sections) {
      const url = new URL(section.href, 'http://127.0.0.1:5177')
      assert.equal(url.origin, 'http://127.0.0.1:5177')
      // 区域入口允许进入对应说明书；显式检查已登记路径，避免未知路径回退首页掩盖错误。
      const target = templatePages.find((entry) => entry.href === url.pathname)
      assert.ok(target && (target.id === page.id || target.id === 'guide'), section.href)
    }
  }
})
