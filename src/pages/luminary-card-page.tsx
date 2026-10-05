import { lazy, Suspense, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { ReferenceDocument } from '../components/reference-document'
import notes from '../../docs/components/luminary-card.md?raw'
import './luminary-card-page.css'

const Customizer = lazy(() => import('../components/luminary-card/luminary-card').then(module => ({ default: module.LuminaryCardCustomizer })))

export function LuminaryCardPage() {
  const notesPanel = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    // 同页锚点跳转不会重新挂载 React；直接进入来源说明时也要展开正文。
    const openNotes = () => { if (window.location.hash === '#luminary-card-notes' && notesPanel.current) notesPanel.current.open = true }
    openNotes()
    window.addEventListener('hashchange', openNotes)
    return () => window.removeEventListener('hashchange', openNotes)
  }, [])

  return <div className="luminary-page">
    <header className="luminary-page-heading">
      <div><span className="reference-eyebrow"><Sparkles size={13} />个人收藏 / Luminary Card</span><h1>全息卡片定制器</h1><p>移动鼠标感受光泽与视差，调整右侧参数即时预览。</p></div>
      <nav aria-label="全息卡片参考导航"><Button variant="ghost" href="/components?category=display#luminary-card"><ArrowLeft size={14} />返回目录</Button><Button variant="outline" href="https://github.com/Johnlzx/luminary-card" target="_blank" rel="noopener noreferrer">原仓库<ArrowUpRight size={14} /></Button></nav>
    </header>
    <section className="luminary-workspace" id="luminary-card-preview" aria-label="全息卡片实时预览与设置">
      <Suspense fallback={<p className="luminary-loading" role="status">正在加载卡片定制器…</p>}><Customizer /></Suspense>
    </section>
    <details ref={notesPanel} className="luminary-notes" id="luminary-card-notes"><summary>使用、来源与收藏说明</summary><ReferenceDocument source={notes} /></details>
  </div>
}
