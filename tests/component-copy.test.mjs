import assert from 'node:assert/strict'
import { existsSync, readFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import test from 'node:test'
import ts from 'typescript'
import { componentReferences } from '../src/data/component-references.ts'

test('每份复制清单包含示例和全部相对源码/CSS依赖，并能隔离编译', () => {
  const root = path.resolve(import.meta.dirname, '..')
  // 放在 node_modules/.tmp 以复用已安装依赖，不加载 UIModel 入口或全站样式。
  const base = path.join(root, 'node_modules/.tmp')
  mkdirSync(base, { recursive: true })
  for (const [id, entry] of Object.entries(componentReferences)) {
    const files = new Set([...entry.files, entry.example])
    for (const source of files) {
      assert.ok(existsSync(path.join(root, source)), `${id} 缺少 ${source}`)
      const text = readFileSync(path.join(root, source), 'utf8')
      const imports = source.endsWith('.css')
        ? [...text.matchAll(/@import\s+['"]([^'"]+)['"]/g)].map(match => match[1])
        : ts.preProcessFile(text).importedFiles.map(item => item.fileName)
      for (const specifier of imports) {
        if (!specifier.startsWith('.')) {
          assert.ok(['react', 'react-dom', 'lucide-react'].includes(specifier), `${id} 未声明外部依赖 ${specifier}`)
          continue
        }
        const relative = path.posix.normalize(path.posix.join(path.posix.dirname(source), specifier))
        const candidates = [relative, `${relative}.ts`, `${relative}.tsx`, `${relative}/index.ts`, `${relative}/index.tsx`]
        assert.ok(candidates.some(candidate => files.has(candidate)), `${id}: ${source} 缺少 ${specifier}`)
      }
    }
    const isolated = mkdtempSync(path.join(base, `reuse-${id}-`))
    for (const file of files) {
      const destination = path.join(isolated, file)
      mkdirSync(path.dirname(destination), { recursive: true })
      writeFileSync(destination, readFileSync(path.join(root, file)))
    }
    writeFileSync(path.join(isolated, 'style.d.ts'), "declare module '*.css' {}\n")
    writeFileSync(path.join(isolated, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, noEmit: true, types: ['react', 'react-dom'] }, include: ['src', 'style.d.ts'] }))
    execFileSync(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'), '-p', path.join(isolated, 'tsconfig.json')], { stdio: 'pipe' })
  }
})
