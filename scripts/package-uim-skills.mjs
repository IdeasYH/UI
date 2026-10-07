import { build } from 'vite'
import { mkdirSync, readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { componentCatalog, componentCategories } from '../src/data/template-catalog.ts'
import { interactionKeywords } from '../src/data/component-references.ts'

// Explicit snapshot packaging only. Never run from the normal build or on startup.
const root = resolve(import.meta.dirname, '..')
const output = resolve(root, 'artifacts/uim-skills')
if (existsSync(output)) throw new Error('artifacts/uim-skills already exists; archive it before creating a new snapshot.')
mkdirSync(output, { recursive: true })
for (const name of ['uim-browse', 'uim-auto', 'uim-id']) cpSync(resolve(root, 'skills', name), resolve(output, name), { recursive: true })
const assets = resolve(output, 'uim-browse/assets')
const site = resolve(assets, 'site')
await build({ root, build: { outDir: site, emptyOutDir: false }, plugins: [{
  name: 'uim-share-license-boundary', enforce: 'pre',
  load(id) {
    if (id.replaceAll('\\', '/').endsWith('/src/pages/luminary-card-page.tsx')) {
      return `export function LuminaryCardPage() { return <main style={{padding:40}}><h1>全息卡片 · 个人收藏</h1><p>此页面未纳入分享包。代码与素材授权待核对，请在原 UIModel 本机项目中查看。</p><a href="/components">返回组件库</a></main> }`
    }
  },
}] })
const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'))
const components = componentCatalog.map(entry => {
  const path = resolve(site, 'references', `${entry.id}.json`)
  const reference = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null
  return { ...entry, keywords: interactionKeywords[entry.id] ?? [],
    previewUrl: `/components?q=${encodeURIComponent(entry.id)}`,
    package: reference ? `site/references/${entry.id}.json` : null,
    fingerprint: reference?.fingerprint ?? null,
    fileHashes: reference ? Object.fromEntries(reference.files.map(file => [file.path, createHash('sha256').update(file.content).digest('hex')])) : {},
    dependencies: reference ? Object.fromEntries(reference.environment.dependencies.map(name => [name, lock.packages?.[`node_modules/${name}`]?.version ?? null])) : {},
    variants: entry.id === 'uiverse-team-action-card' ? ['dark', 'light'] : [],
  }
})
const snapshot = createHash('sha256').update(JSON.stringify(components)).digest('hex')
const catalog = { schemaVersion: 1, snapshot, createdAt: new Date().toISOString(), sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding:'utf8'}).trim(), categories: componentCategories, components }
writeFileSync(resolve(assets, 'catalog.json'), JSON.stringify(catalog, null, 2))
cpSync(resolve(root, 'docs/UI-REUSE.md'), resolve(assets, 'UI-REUSE.md'))
cpSync(resolve(root, 'docs/components/uiverse-license.md'), resolve(assets, 'UIVERSE-LICENSE.md'))
writeFileSync(resolve(assets, 'site/uim-snapshot.json'), JSON.stringify({ snapshot }))
cpSync(resolve(root, 'scripts/install-uim-skills.py'), resolve(output, 'install.py'))
writeFileSync(resolve(output, '安装.cmd'), '@echo off\r\npython "%~dp0install.py"\r\npause\r\n')
writeFileSync(resolve(output, '启动组件库.cmd'), '@echo off\r\npython "%~dp0uim-browse\\scripts\\uim.py" browse\r\nif errorlevel 1 pause\r\n')
cpSync(resolve(root, 'docs/UIM-SKILLS.md'), resolve(output, '使用说明.md'))
console.log(JSON.stringify({ output, snapshot, catalogEntries: components.length, sourcePackages: components.filter(item => item.package).length }))
