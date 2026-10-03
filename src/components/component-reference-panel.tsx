import { useState } from 'react'
import searchDocument from '../../docs/components/search-select.md?raw'
import dateDocument from '../../docs/components/date-range.md?raw'
import prerequisiteDocument from '../../docs/components/prerequisite-action.md?raw'
import { getComponentReference } from '../data/component-references'
import { SearchSelectExample } from '../examples/search-select-example'
import { DateRangeExample } from '../examples/date-range-example'
import { PrerequisiteActionExample } from '../examples/prerequisite-action-example'
import { ReferenceDocument } from './reference-document'
import './component-reference.css'

type SourceFile = { path: string; content: string }
type ReferencePackage = { fingerprint: string; files: SourceFile[] }
const documents: Record<string, string> = { 'search-select': searchDocument, 'date-range': dateDocument, 'prerequisite-action': prerequisiteDocument }

function SourcePackage({ id, example }: { id: string; example: string }) {
  const [bundle, setBundle] = useState<ReferencePackage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  async function load() {
    if (bundle || loading) return
    setLoading(true); setError('')
    try {
      const response = await fetch(`/references/${id}.json`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setBundle(await response.json())
    } catch (cause) { setError(`源码加载失败：${cause instanceof Error ? cause.message : String(cause)}`) }
    finally { setLoading(false) }
  }
  async function copy(file: SourceFile) {
    try { await navigator.clipboard.writeText(file.content); setNotice(`已复制 ${file.path}`) }
    catch { setNotice('浏览器未允许复制，请在下方代码中手动选择并复制。') }
  }
  return <details className="reuse-source" onToggle={event => { if (event.currentTarget.open) void load() }}>
    <summary>完整用例与源码 · 展开查看 / 复制</summary>
    <p>按文件路径保存到目标项目。TSX 已包含状态与回调；JSON 同时包含通用方法、组件契约与全部源码，适合仅通过网站读取的 agent。</p>
    <a href={`/references/${id}.json`} download={`${id}.json`}>下载完整复用包 JSON</a>{' · '}
    <a href={`/references/${id}.json`} target="_blank" rel="noreferrer">读取原始 JSON</a>
    {loading && <p role="status">正在读取源码…</p>}
    {error && <p role="alert">{error} <button type="button" onClick={() => void load()}>重试</button></p>}
    <p role="status" className="reuse-copy-status">{notice}</p>
    {bundle && <>
      <p className="reuse-fingerprint">内容指纹：<code>{bundle.fingerprint}</code> · 可用于确认下载内容与验收版本一致。</p>
      {[...bundle.files].sort((a, b) => Number(b.path === example) - Number(a.path === example)).map(file => <details key={file.path} open={file.path === example}>
        <summary>{file.path === example ? '最小可运行示例 · ' : ''}{file.path}</summary>
        <button type="button" className="reuse-copy-button" onClick={() => void copy(file)}>复制此文件</button>
        <pre tabIndex={0} aria-label={file.path}><code>{file.content}</code></pre>
      </details>)}
    </>}
  </details>
}

export function ComponentReferencePanel({ id }: { id: string }) {
  const reference = getComponentReference(id)
  if (!reference) return <div className="reuse-unverified"><strong>交互 / 页面参考</strong><span>尚未提供独立复制包。可参考状态与样式，接入前核对实际依赖。</span><a href="/guide#reuse-method">从新需求寻找相似模式 →</a></div>
  return <div className="reuse-panel">
    <div className="reuse-panel-heading"><strong>复用样板 · {reference.title}</strong><a href="/guide#reuse-method">通用选型与迁移方法 →</a></div>
    <p>示例业务不是适用范围清单。先匹配交互结构，再按契约替换数据、文案和业务回调。</p>
    <details><summary>使用契约 · 设计理由、变化边界与验收</summary><ReferenceDocument source={documents[id]} /></details>
    <details><summary>运行最小用例 · 与可复制代码同源</summary><div className="reuse-example">
      {id === 'search-select' ? <SearchSelectExample /> : id === 'date-range' ? <DateRangeExample /> : <PrerequisiteActionExample />}
    </div></details>
    <SourcePackage id={id} example={reference.example} />
  </div>
}
