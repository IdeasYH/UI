import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Building2, Compass, RotateCcw, Search, Sparkles, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { FigmaOrganizationDialog } from '../components/figma-organization/figma-organization-dialog'
import { FigmaOrganizationGraph } from '../components/figma-organization/figma-organization-graph'
import { applyFigmaAction, filterFigmaGroups, type FigmaAction, type FigmaDepartment, type FigmaDialogAction } from '../components/figma-organization/figma-organization-model'
import { demoDepartmentData } from '../data/figma-organization'

export function FigmaOrganizationPage() {
  const [department, setDepartment] = useState<FigmaDepartment>(() => structuredClone(demoDepartmentData))
  const [query, setQuery] = useState('')
  const [action, setAction] = useState<FigmaDialogAction | null>(null)
  const [notice, setNotice] = useState('')
  const groups = useMemo(() => filterFigmaGroups(department, query), [department, query])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const confirm = (next: FigmaAction) => {
    const result = applyFigmaAction(department, next)
    if (result.error) return result.error
    setDepartment(result.department)
    setAction(null)
    setQuery('')
    const messages = { 'add-group': '已新增业务组', 'rename-group': '业务组名称已更新', 'add-member': '已录入示例人员', 'edit-member': '员工资料已更新', 'transfer-member': '人员已调入目标业务组', departure: '人员已移出示例名录' }
    setNotice(messages[next.type])
    return null
  }

  return <div className="figma-replica">
    <header className="fg-top-header" id="figma-header">
      <div className="fg-brand-bar"><div className="fg-brand"><span className="fg-brand-mark"><Building2 size={16} /></span><strong>尚毅</strong><span className="fg-brand-label">人员与组织中台</span></div><span className="fg-brand-caption">组织架构 · 鲜花事业部</span><div className="fg-header-tools"><div className="fg-search"><Search size={14} aria-hidden /><Input aria-label="搜索组织、姓名或工号" placeholder="搜索员工姓名、工号或组名..." value={query} onChange={(event) => setQuery(event.target.value)} />{query && <Button variant="ghost" title="清除搜索" aria-label="清除组织搜索" onClick={() => setQuery('')}><X size={12} /></Button>}</div><div className="fg-account"><span>管</span><strong>系统管理员</strong><span className="fg-account-demo">示例</span></div></div></div>
      <div className="fg-context-bar"><div><span className="fg-context-icon"><Compass size={16} /></span><strong>拓扑结构 · 组织与人员</strong><span className="fg-context-badge">部门 / 业务组 / 成员</span></div><span className="fg-context-caption"><Sparkles size={14} />组织 · 人员 · 绩效</span></div>
    </header>
    <main className="fg-main"><FigmaOrganizationGraph department={department} groups={groups} query={query.trim()} onClearSearch={() => setQuery('')} onAction={setAction} />
      <footer className="fg-page-footer"><span>Figma Make · 组织人员管理 UI</span><div><Button variant="ghost" href="/guide#figma-replica"><BookOpen size={13} />组件说明</Button><Button variant="ghost" title="恢复默认示例数据" aria-label="恢复默认示例数据" onClick={() => { setDepartment(structuredClone(demoDepartmentData)); setQuery(''); setNotice('已恢复默认示例数据') }}><RotateCcw size={13} /></Button></div></footer>
    </main>
    <FigmaOrganizationDialog department={department} action={action} onClose={() => setAction(null)} onConfirm={confirm} />
    {notice && <div className="fg-toast" role="status">{notice}</div>}
  </div>
}
