/// <reference types="vite/client" />

import { Fragment, type ReactNode } from 'react'
import guideMarkdown from '../../../docs/ORGANIZATION-PERMISSIONS-BDD.md?raw'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

type Block =
  | { kind: 'heading'; level: number; text: string; id: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'code'; text: string }
  | { kind: 'table'; rows: string[][] }

// The repository Markdown is the only content source. This intentionally small
// renderer treats HTML and links as text; it never executes document markup.
function parseGuide(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let headingIndex = 0
  let index = 0
  const isBlockStart = (line: string) => /^(#{1,3} |```|\| |(?:- |\d+\. ))/.test(line)

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) { index++; continue }
    if (line.startsWith('```')) {
      const content: string[] = []
      index++
      while (index < lines.length && !lines[index].startsWith('```')) content.push(lines[index++])
      if (index < lines.length) index++
      blocks.push({ kind: 'code', text: content.join('\n') })
      continue
    }
    const heading = /^(#{1,3}) (.+)$/.exec(line)
    if (heading) {
      blocks.push({ kind: 'heading', level: heading[1].length, text: heading[2], id: `fg-bdd-section-${headingIndex++}` })
      index++
      continue
    }
    if (line.startsWith('| ')) {
      const rows: string[][] = []
      while (index < lines.length && lines[index].startsWith('| ')) {
        const cells = lines[index++].trim().slice(1, -1).split('|').map((cell) => cell.trim())
        if (!cells.every((cell) => /^:?-{3,}:?$/.test(cell))) rows.push(cells)
      }
      blocks.push({ kind: 'table', rows })
      continue
    }
    const list = /^(- |\d+\. )(.+)$/.exec(line)
    if (list) {
      const ordered = list[1] !== '- '
      const matcher = ordered ? /^\d+\. (.+)$/ : /^- (.+)$/
      const items: string[] = []
      while (index < lines.length) {
        const item = matcher.exec(lines[index])
        if (!item) break
        items.push(item[1]); index++
      }
      blocks.push({ kind: 'list', ordered, items })
      continue
    }
    const content = [line]
    index++
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) content.push(lines[index++])
    blocks.push({ kind: 'paragraph', text: content.join(' ') })
  }
  return blocks
}

const blocks = parseGuide(guideMarkdown)

function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('`') && part.endsWith('`')
    ? <code key={index}>{part.slice(1, -1)}</code>
    : part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part)
}

/** Shared human/Agent specification, displayed without a second copy of its text. */
export function OrganizationBddGuide() {
  return <article className="fg-bdd-guide" aria-label="组织权限与数据汇总 BDD 说明书">
    <nav className="fg-bdd-toc" aria-label="BDD 说明书目录">
      <strong>阅读目录</strong>
      {blocks.flatMap((block) => block.kind === 'heading' && block.level === 2 ? [<a key={block.id} href={`#${block.id}`}>{block.text}</a>] : [])}
    </nav>
    {blocks.map((block, index) => {
      if (block.kind === 'heading') {
        if (block.level === 1) return <h2 id={block.id} key={index}>{inline(block.text)}</h2>
        if (block.level === 2) return <h3 id={block.id} key={index}>{inline(block.text)}</h3>
        return <h4 id={block.id} key={index}>{inline(block.text)}</h4>
      }
      if (block.kind === 'paragraph') return <p key={index}>{inline(block.text)}</p>
      if (block.kind === 'code') return <pre className="fg-bdd-code" key={index}><code>{block.text}</code></pre>
      if (block.kind === 'table') return <Table key={index} containerClassName="fg-bdd-table">
        <TableHeader><TableRow>{block.rows[0]?.map((cell, column) => <TableHead key={column}>{inline(cell)}</TableHead>)}</TableRow></TableHeader>
        <TableBody>{block.rows.slice(1).map((row, rowIndex) => <TableRow key={rowIndex}>{row.map((cell, column) => <TableCell key={column}>{inline(cell)}</TableCell>)}</TableRow>)}</TableBody>
      </Table>
      const items = block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)
      return <Fragment key={index}>{block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>}</Fragment>
    })}
  </article>
}
