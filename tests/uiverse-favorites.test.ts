import assert from 'node:assert/strict'
import test from 'node:test'
import { componentReferences } from '../src/data/component-references.ts'
import { componentCatalog } from '../src/data/template-catalog.ts'
import { uiverseFavorites } from '../src/data/uiverse-favorites.ts'

// Five favorites checked on 2026-10-04 plus the explicitly requested Tsiangana source on 2026-10-05.
const sourceSlugs = [
  'good-donkey-28', 'heavy-badger-29', 'thin-duck-22',
  'slimy-penguin-36', 'smart-emu-83', 'honest-bobcat-61',
]

test('all Uiverse entries have semantic IDs, live examples, and copy packages', () => {
  assert.deepEqual(uiverseFavorites.map(item => new URL(item.sourceUrl).pathname.split('/').at(-1)).sort(), sourceSlugs.sort())
  assert.equal(new Set(componentCatalog.map(item => item.id)).size, componentCatalog.length, 'component IDs must be unique for copy and anchors')

  for (const item of uiverseFavorites) {
    assert.match(item.id, /^uiverse-[a-z]+(?:-[a-z]+)+$/)
    assert.ok(item.id.includes(item.symbol.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().split('-')[0]))
    const entry = componentCatalog.find(component => component.id === item.id)
    assert.equal(entry?.preview, 'live', `${item.id} needs a live example`)
    const reference = componentReferences[item.id]
    assert.ok(reference, `${item.id} needs a copy package`)
    assert.ok(reference.files.some(file => file.endsWith('.tsx')))
    assert.ok(reference.files.some(file => file.endsWith('.css')))
    assert.ok(reference.files.includes('docs/components/uiverse-license.md'))
  }
})
