import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { PortableButton } from './portable-button'
import './prerequisite-action.css'

export type PrerequisiteCondition = { id: string; satisfied: boolean; content: ReactNode }
export type PrerequisiteActionProps = {
  conditions: readonly PrerequisiteCondition[]
  hint: string
  onAction: () => void
  label?: string
  connectEach?: boolean
}

export function PrerequisiteAction({ conditions, hint, onAction, label = '提交', connectEach = false }: PrerequisiteActionProps) {
  const hintId = useId()
  const container = useRef<HTMLDivElement>(null)
  const submit = useRef<HTMLDivElement>(null)
  const anchors = useRef(new Map<string, HTMLDivElement>())
  const [lines, setLines] = useState<{ id: string; path: string }[]>([])
  // 空列表表示没有前置限制；业务规则与异步操作状态由调用方提供。
  const ready = conditions.every(condition => condition.satisfied)

  useEffect(() => {
    if (!connectEach || !container.current) return
    const root = container.current
    function measure() {
      const box = root.getBoundingClientRect()
      const button = submit.current?.getBoundingClientRect()
      if (!button) return
      const startX = button.left + button.width / 2 - box.left
      const startY = button.bottom - box.top + 4
      const bottom = box.height - 12
      // 锚点属于组件自身，content 可使用任意结构，不依赖调用方的 class 或 label。
      setLines(conditions.filter(condition => !condition.satisfied).flatMap(condition => {
        const target = anchors.current.get(condition.id)?.getBoundingClientRect()
        if (!target) return []
        const y = target.top + target.height / 2 - box.top
        return [{ id: condition.id, path: `M ${startX} ${startY} V ${bottom} H 10 V ${y} H ${target.left - box.left - 5}` }]
      }))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    anchors.current.forEach(element => observer.observe(element))
    measure()
    return () => observer.disconnect()
  }, [connectEach, conditions])

  return <div ref={container} className="prerequisite-action" data-ready={ready} data-connect-each={connectEach}>
    <div className="prerequisite-control"><div className="prerequisite-condition-list">
      {conditions.map(condition => <div key={condition.id} ref={element => { if (element) anchors.current.set(condition.id, element); else anchors.current.delete(condition.id) }} data-satisfied={condition.satisfied}>{condition.content}</div>)}
    </div></div>
    <div ref={submit} className="prerequisite-submit"><PortableButton disabled={!ready} aria-describedby={hintId} onClick={() => { if (ready) onAction() }}>{label}</PortableButton><span id={hintId}>{ready ? `条件已满足，可以${label}` : hint}</span></div>
    {connectEach ? <svg className="prerequisite-lines" aria-hidden="true">{lines.map(line => <path key={line.id} d={line.path} />)}</svg> : <div className="prerequisite-connector" aria-hidden="true"><span /></div>}
  </div>
}
