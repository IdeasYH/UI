import { lazy, Suspense, useState, type ReactNode } from 'react'
import searchDocument from '../../docs/components/search-select.md?raw'
import dateDocument from '../../docs/components/date-range.md?raw'
import prerequisiteDocument from '../../docs/components/prerequisite-action.md?raw'
import segmentedDocument from '../../docs/components/segmented-control.md?raw'
import collapseDocument from '../../docs/components/collapse-panel.md?raw'
import timelineDocument from '../../docs/components/timeline.md?raw'
import flexCarouselDocument from '../../docs/components/flex-carousel.md?raw'
import peekRatingDocument from '../../docs/components/peek-rating.md?raw'
import swatchColorPickerDocument from '../../docs/components/swatch-color-picker.md?raw'
import { getComponentReference } from '../data/component-references'
import { SearchSelectExample } from '../examples/search-select-example'
import { DateRangeExample } from '../examples/date-range-example'
import { PrerequisiteActionExample } from '../examples/prerequisite-action-example'
import { SegmentedControlExample } from '../examples/segmented-control-example'
import { CollapsePanelExample } from '../examples/collapse-panel-example'
import { TimelineExample } from '../examples/timeline-example'
import { SwatchColorPickerExample } from '../examples/swatch-color-picker-example'
import { ReferenceDocument } from './reference-document'
import { FavoritePreview } from './favorite-preview'
import { UiverseMessageComposerExample } from '../examples/uiverse-message-composer-example'
import { UiverseExpandingBookmarkSaveExample } from '../examples/uiverse-expanding-bookmark-save-example'
import { UiverseExpandingLogoutExample } from '../examples/uiverse-expanding-logout-example'
import { UiverseFloatingGlowSwitchExample } from '../examples/uiverse-floating-glow-switch-example'
import { UiverseExpandingDeleteExample } from '../examples/uiverse-expanding-delete-example'
import { UiverseSocialTooltipExample } from '../examples/uiverse-social-tooltip-example'
import './component-reference.css'

const FlexCarouselExample = lazy(() => import('../examples/flex-carousel-example').then(module => ({ default: module.FlexCarouselExample })))
const PeekRatingExample = lazy(() => import('../examples/peek-rating-example').then(module => ({ default: module.PeekRatingExample })))

type SourceFile = { path: string; content: string }
type ReferencePackage = { fingerprint: string; files: SourceFile[] }
const favoriteDocuments = import.meta.glob('../../docs/components/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const documents: Record<string, string> = {
  'search-select': searchDocument, 'date-range': dateDocument, 'prerequisite-action': prerequisiteDocument,
  'segmented-control': segmentedDocument, 'collapse-panel': collapseDocument, timeline: timelineDocument,
  'flex-carousel': flexCarouselDocument, 'peek-rating': peekRatingDocument,
  'swatch-color-picker': swatchColorPickerDocument,
}
const examples: Record<string, ReactNode> = {
  'uiverse-social-tooltip': <UiverseSocialTooltipExample />,
  'uiverse-message-composer': <UiverseMessageComposerExample />,
  'uiverse-expanding-bookmark-save': <UiverseExpandingBookmarkSaveExample />,
  'uiverse-expanding-logout': <UiverseExpandingLogoutExample />,
  'uiverse-floating-glow-switch': <UiverseFloatingGlowSwitchExample />,
  'uiverse-expanding-delete': <UiverseExpandingDeleteExample />,
  'search-select': <SearchSelectExample />,
  'date-range': <DateRangeExample />,
  'prerequisite-action': <PrerequisiteActionExample />,
  'segmented-control': <SegmentedControlExample />,
  'collapse-panel': <CollapsePanelExample />,
  timeline: <TimelineExample />,
  'flex-carousel': <Suspense fallback={<p role="status">正在加载画廊…</p>}><FlexCarouselExample /></Suspense>,
  'peek-rating': <Suspense fallback={<p role="status">正在加载评分…</p>}><PeekRatingExample /></Suspense>,
  'swatch-color-picker': <SwatchColorPickerExample />,
}

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
  const [exampleOpen, setExampleOpen] = useState(false)
  const reference = getComponentReference(id)
  if (!reference) return <div className="reuse-unverified"><strong>交互 / 页面参考</strong><span>尚未提供独立复制包。可参考状态与样式，接入前核对实际依赖。</span><a href="/guide#reuse-method">从新需求寻找相似模式 →</a></div>
  return <div className="reuse-panel">
    <div className="reuse-panel-heading"><strong>复用样板 · {reference.title}</strong><a href="/guide#reuse-method">通用选型与迁移方法 →</a></div>
    <p>示例业务不是适用范围清单。先匹配交互结构，再按契约替换数据、文案和业务回调。</p>
    <details><summary>使用契约 · 设计理由、变化边界与验收</summary><ReferenceDocument source={documents[id] ?? favoriteDocuments[`../../docs/components/${id}.md`] ?? ''} /></details>
    <details onToggle={event => setExampleOpen(event.currentTarget.open)}><summary>运行最小用例 · 与可复制代码同源</summary>{exampleOpen && <div className="reuse-example">
      {examples[id] ?? <FavoritePreview id={id} />}
    </div>}</details>
    <SourcePackage id={id} example={reference.example} />
  </div>
}
