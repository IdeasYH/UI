import { useEffect, useRef } from 'react'
import { mountLuminaryCard } from './src/app.js'
import workspace from './workspace.html?raw'
import styles from './src/styles.css?inline'

/** 保留收藏原作的 DOM 与光学图层；Shadow DOM 隔离通用类名、ID 和控件样式。 */
export function LuminaryCardCustomizer() {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = host.current!
    const root = element.shadowRoot ?? element.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = styles
    const template = document.createElement('template')
    // 仅解析仓库内固定 HTML；文件、配置和用户文案不会进入此 HTML 入口。
    template.innerHTML = workspace
    root.replaceChildren(style, template.content.cloneNode(true))
    const dispose = mountLuminaryCard(root)
    return () => { dispose(); root.replaceChildren() }
  }, [])

  return <div ref={host} className="luminary-preview" role="region" aria-label="Luminary 全息卡片定制器" />
}
