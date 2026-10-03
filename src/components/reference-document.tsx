import { Fragment, type ReactNode } from 'react'

function hrefFor(path: string): string | undefined {
  if (/^https?:\/\//.test(path) || path.startsWith('#')) return path
  if (/UI-REUSE\.md/.test(path)) return '/guide#reuse-method'
  for (const id of ['search-select', 'date-range', 'prerequisite-action']) {
    if (path.includes(`${id}.md`)) return `/components?category=interaction#${id}`
  }
  return undefined
}

function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (link) {
      const href = hrefFor(link[2])
      return href ? <a key={index} href={href}>{link[1]}</a> : <span key={index}>{link[1]} <code>{link[2]}</code></span>
    }
    return part
  })
}

/** 受控的仓库 Markdown 子集；HTML 始终作为文本，避免运行文档中的代码。 */
export function ReferenceDocument({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) { index++; continue }
    const key = index
    if (line.startsWith('```')) {
      const code: string[] = []
      index++
      while (index < lines.length && !lines[index].startsWith('```')) code.push(lines[index++])
      index++
      blocks.push(<pre key={key}><code>{code.join('\n')}</code></pre>)
      continue
    }
    const heading = /^(#{1,6}) (.+)/.exec(line)
    if (heading) {
      blocks.push(heading[1].length <= 2 ? <h3 key={key}>{inline(heading[2])}</h3> : <h4 key={key}>{inline(heading[2])}</h4>)
      index++; continue
    }
    if (line.startsWith('|')) {
      const rows: string[][] = []
      while (index < lines.length && lines[index].startsWith('|')) {
        const row = lines[index++].trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim())
        if (!row.every(cell => /^:?-{3,}:?$/.test(cell))) rows.push(row)
      }
      blocks.push(<div className="reuse-table-scroll" key={key}><table><thead><tr>{rows[0]?.map((cell, n) => <th key={n}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.slice(1).map((row, n) => <tr key={n}>{row.map((cell, c) => <td key={c}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>)
      continue
    }
    const list = /^(?:- |\d+\. )/.exec(line)
    if (list) {
      const items: ReactNode[] = []
      const ordered = !line.startsWith('- ')
      const pattern = ordered ? /^\d+\. (.+)/ : /^- (.+)/
      while (index < lines.length) {
        const item = pattern.exec(lines[index]); if (!item) break
        items.push(<li key={index}>{inline(item[1])}</li>); index++
      }
      blocks.push(ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>); continue
    }
    const paragraph = [line]
    index++
    while (index < lines.length && lines[index].trim() && !/^(#{1,6} |```|\||- |\d+\. )/.test(lines[index])) paragraph.push(lines[index++])
    blocks.push(<p key={key}>{inline(paragraph.join(' '))}</p>)
  }
  return <div className="reuse-document">{blocks.map((block, index) => <Fragment key={index}>{block}</Fragment>)}</div>
}
