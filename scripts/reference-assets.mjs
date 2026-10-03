import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { componentReferences } from '../src/data/component-references.ts'

/** 仅生成注册过的公开组件包；请求不能指定磁盘路径。构建产物与开发服务内容相同。 */
export function referenceAssets() {
  let root = ''
  const body = (id) => {
    const entry = componentReferences[id]
    const paths = ['docs/UI-REUSE.md', entry.document, entry.example, ...entry.files]
    const files = paths.map(path => ({ path, content: readFileSync(resolve(root, path), 'utf8') }))
    const fingerprint = createHash('sha256').update(JSON.stringify(files)).digest('hex')
    return JSON.stringify({ id, title: entry.title, fingerprint, environment: { framework: 'React', jsx: 'automatic runtime: TypeScript jsx=react-jsx; Vite use its React plugin or esbuild.jsx=automatic', dependencies: id === 'prerequisite-action' ? ['react', 'react-dom'] : ['react', 'react-dom', 'lucide-react'], note: '宿主提供 HTML 挂载点、React DOM 入口和 CSS 加载。按原相对路径保存 files；示例数据仅为演示。临时目录若在 node_modules 内，可显式配置 Vite optimizeDeps.include。' }, example: entry.example, exportName: entry.exportName, files }, null, 2)
  }
  return {
    name: 'uimodel-reference-assets',
    configResolved(config) { root = config.root },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        const id = Object.keys(componentReferences).find(key => path === `/references/${key}.json`)
        if (!id) { next(); return }
        try {
          const json = body(id)
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(json)
        } catch (error) { next(error) }
      })
    },
    generateBundle() {
      for (const id of Object.keys(componentReferences)) {
        this.emitFile({ type: 'asset', fileName: `references/${id}.json`, source: body(id) })
      }
    },
  }
}
