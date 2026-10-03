import { useState } from 'react'
import { PrerequisiteAction } from '../components/ui/prerequisite-action'

export function PrerequisiteActionExample() {
  const [scope, setScope] = useState('')
  const [format, setFormat] = useState('')
  const [reviewed, setReviewed] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [result, setResult] = useState('')
  const conditions = [
    { id: 'scope', satisfied: scope !== '', content: <label>处理范围 <select value={scope} onChange={event => setScope(event.target.value)}><option value="">请选择</option><option value="current">当前集合</option><option value="all">全部集合</option></select></label> },
    { id: 'format', satisfied: format !== '', content: <label>输出格式 <select value={format} onChange={event => setFormat(event.target.value)}><option value="">请选择</option><option value="csv">CSV</option><option value="json">JSON</option></select></label> },
    { id: 'reviewed', satisfied: reviewed, content: <label><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} />已核对处理范围</label> },
    { id: 'confirmed', satisfied: confirmed, content: <label><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />已确认输出要求</label> },
  ]
  return <div>
    <PrerequisiteAction conditions={conditions} connectEach hint="完成未满足的条件后可继续" label="生成预览" onAction={() => setResult(`已请求预览：${scope} / ${format}`)} />
    <p role="status">{result || '仅演示前置条件，不执行真实任务。'}</p>
  </div>
}
