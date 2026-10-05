import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { componentReferences } from '../src/data/component-references.ts'
import { componentCatalog } from '../src/data/template-catalog.ts'
import { uiverseFavorites } from '../src/data/uiverse-favorites.ts'
import { uiverseNewFavorites } from '../src/data/uiverse-new-favorites.ts'

// 2026-10-05 favorites: 23 catalog entries; witty-squid-83 is the existing swatch-color-picker.
const sourceSlugs = [
  'good-donkey-28', 'heavy-badger-29', 'thin-duck-22',
  'slimy-penguin-36', 'smart-emu-83', 'honest-bobcat-61',
  'stupid-panther-7', 'serious-turkey-52', 'strong-squid-82', 'chilly-eagle-55',
  'slimy-quail-55', 'ugly-bulldog-75', 'horrible-zebra-60', 'quiet-goat-67',
  'terrible-gecko-91', 'ordinary-lizard-16', 'yellow-puma-19', 'cowardly-quail-47',
  'silent-cougar-84', 'horrible-quail-18', 'plastic-panther-15', 'wicked-liger-39', 'jolly-liger-24',
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

test('each newly favorited original has runnable isolated markup and the exact source files in its copy package', () => {
  assert.equal(uiverseNewFavorites.length, 17)
  for (const item of uiverseNewFavorites) {
    const prefix = `public/uiverse-originals/${item.rawSlug}`
    const raw = readFileSync(`${prefix}.source.html`, 'utf8')
    const preview = readFileSync(`${prefix}.preview.html`, 'utf8')
    assert.ok(raw.includes('<'), `${item.id} needs original markup`)
    // Preview documents use the host newline convention; source snapshots retain upstream bytes.
    assert.ok(preview.replace(/\r\n/g, '\n').includes(raw.replace(/\r\n/g, '\n').trim()), `${item.id} preview must contain original markup`)
    assert.ok(preview.includes(`${item.rawSlug}.css`), `${item.id} preview must load original CSS`)
    for (const path of [`${prefix}.source.html`, `${prefix}.preview.html`, `${prefix}.css`]) {
      assert.ok(componentReferences[item.id].files.includes(path), `${item.id} copy package missing ${path}`)
    }
  }
})

test('original HTML, CSS and generated Tailwind styles match the captured source snapshot', () => {
  const snapshot = JSON.parse(readFileSync('docs/UIVERSE-SOURCE-SNAPSHOT.json', 'utf8'))
  assert.equal(snapshot.entries.length, 17)
  for (const entry of snapshot.entries) {
    for (const file of entry.files) {
      assert.equal(createHash('sha256').update(readFileSync(file.path)).digest('hex'), file.sha256, `${file.path} differs from ${entry.sourceUrl}`)
    }
  }
})
