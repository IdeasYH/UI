import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog } from '../ui/dialog'
import type { FigmaDepartment } from './figma-organization-model'
import { matchesOrganization } from './organization-search'
import { FunctionRoleButton } from '../permissions/permission-provider'

const scopes = { self: '看本人', team: '看本人及下级', all: '看本系统全部' }
type Scope = keyof typeof scopes
type Policy = { scope: Scope; organizations: string[] }
type Person = { id: string; name: string; node: string; leader: boolean }
type Tag = { code: string; name: string }
const AccessContext = createContext<((person: Person) => ReactNode) | null>(null)
const TagManagerContext = createContext<(() => void) | undefined>(undefined)

export function TagManagerButton() {
  const open = useContext(TagManagerContext)
  return <Button permission="tags.manage" variant="ghost" className="fg-outline-button" onClick={open}>标签管理</Button>
}

export function PersonAccess({ person }: { person: Person }) {
  return useContext(AccessContext)?.(person)
}

// Data scopes belong to appointments; labels belong to the stable person identity.
export function PersonAccessProvider({ department, children }: { department: FigmaDepartment; children: ReactNode }) {
  const [policies, setPolicies] = useState<Record<string, Policy>>({})
  const [tags, setTags] = useState<Tag[]>([{ code: 'KA', name: 'KA' }, { code: 'QUALITY', name: '质检' }])
  const [bindings, setBindings] = useState<Record<string, string[]>>({})
  const [editor, setEditor] = useState<{ person: Person; mode: 'scope' | 'tags' } | null>(null)
  const [manage, setManage] = useState(false)
  useEffect(() => {
    const validIds = new Set(['department', ...department.groups.map((group) => group.id)])
    // Removing an empty demo node also drops stale explicit viewing grants.
    setPolicies((old) => {
      let changed = false
      const entries = Object.entries(old).flatMap(([appointment, value]) => {
        const [node] = JSON.parse(appointment) as [string, boolean, string]
        if (!validIds.has(node)) { changed = true; return [] }
        const organizations = value.organizations.filter((id) => validIds.has(id))
        changed ||= organizations.length !== value.organizations.length
        return [[appointment, { ...value, organizations }] as const]
      })
      return changed ? Object.fromEntries(entries) : old
    })
  }, [department.groups])
  const key = (p: Person) => JSON.stringify([p.node, p.leader, p.id])
  const policy = (p: Person): Policy => policies[key(p)] ?? { scope: p.leader ? 'team' : 'self', organizations: [] }
  return <AccessContext.Provider value={(person) => <div className="fg-person-access">
    <Button permission="scope.configure" variant="outline" aria-label={`权限 ${person.name} ${person.node}`} onClick={() => setEditor({ person, mode: 'scope' })}>数据范围 · {scopes[policy(person).scope]}{policy(person).scope !== 'all' && policy(person).organizations.length ? ` +${policy(person).organizations.length}组织` : ''}</Button>
    <FunctionRoleButton person={person} />
    <Button permission="tags.configure" variant="outline" aria-label={`标签 ${person.name}`} onClick={() => setEditor({ person, mode: 'tags' })}>标签{(bindings[person.id] ?? []).length ? ` · ${(bindings[person.id] ?? []).map((code) => tags.find((t) => t.code === code)?.name ?? code).join('、')}` : ''}</Button>
  </div>}>
    <TagManagerContext.Provider value={() => setManage(true)}>{children}</TagManagerContext.Provider>
    {manage && <TagManager tags={tags} onSave={setTags} onClose={() => setManage(false)} />}
    {editor && <AccessEditor key={`${key(editor.person)}-${editor.mode}`} person={editor.person} mode={editor.mode} department={department} policy={policy(editor.person)} tags={tags} selectedTags={bindings[editor.person.id] ?? []} onClose={() => setEditor(null)} onSave={(nextPolicy, nextTags) => {
      if (editor.mode === 'scope') setPolicies((old) => ({ ...old, [key(editor.person)]: nextPolicy }))
      else setBindings((old) => ({ ...old, [editor.person.id]: nextTags }))
      setEditor(null)
    }} />}
  </AccessContext.Provider>
}

function TagManager({ tags, onSave, onClose }: { tags: Tag[]; onSave: (tags: Tag[]) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(tags)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  return <Dialog open onOpenChange={onClose} labelledBy="tag-title" className="fg-access-dialog">
    <header><h2 id="tag-title">人员标签管理</h2><Button variant="ghost" onClick={onClose} aria-label="关闭标签管理"><X size={18} /></Button></header>
    <p>名称可以修改；稳定编码供其他程序识别。标签不授予数据或按钮权限。</p>
    <div className="fg-tag-catalog">{draft.map((tag) => <label key={tag.code}><code>{tag.code}</code><Input aria-label={`${tag.code}标签名称`} maxLength={30} value={tag.name} onChange={(e) => setDraft(draft.map((t) => t.code === tag.code ? { ...t, name: e.target.value } : t))} /></label>)}</div>
    <form onSubmit={(e) => { e.preventDefault(); const normalized = code.trim().toUpperCase(); if (!name.trim() || !/^[A-Z][A-Z0-9_]{0,29}$/.test(normalized)) { setError('填写名称；编码为字母开头的英文、数字或下划线，最多30位。'); return } if (draft.some((t) => t.code === normalized)) { setError('编码已存在。'); return } setDraft([...draft, { code: normalized, name: name.trim() }]); setName(''); setCode(''); setError('') }} className="fg-tag-create">
      <Input aria-label="新标签名称" placeholder="标签名称，例如 KA" maxLength={30} value={name} onChange={(e) => setName(e.target.value)} /><Input aria-label="新标签编码" placeholder="稳定编码，例如 KA" maxLength={30} value={code} onChange={(e) => setCode(e.target.value)} /><Button type="submit" variant="outline">添加标签</Button>
    </form>
    {error && <p role="alert">{error}</p>}
    <footer><span>仅本页演示，刷新恢复</span><Button variant="outline" onClick={onClose}>取消</Button><Button disabled={draft.some((t) => !t.name.trim())} onClick={() => { onSave(draft.map((t) => ({ ...t, name: t.name.trim() }))); onClose() }}>保存标签库</Button></footer>
  </Dialog>
}

function AccessEditor({ person, mode, department, policy, tags, selectedTags, onClose, onSave }: { person: Person; mode: 'scope' | 'tags'; department: FigmaDepartment; policy: Policy; tags: Tag[]; selectedTags: string[]; onClose: () => void; onSave: (p: Policy, t: string[]) => void }) {
  const [scope, setScope] = useState(policy.scope)
  const [selected, setSelected] = useState(policy.organizations)
  const [labels, setLabels] = useState(selectedTags)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(true)
  const root = 'department'
  const groups = department.groups
  const allChildren = selected.includes(root)
  const checked = (id: string) => allChildren || selected.includes(id)
  const toggleChild = (id: string) => {
    const next = allChildren ? groups.filter((g) => g.id !== id).map((g) => g.id) : selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]
    // Explicit child grants must not silently become a dynamic parent grant:
    // that would also authorize future groups and the parent's own records.
    setSelected(next)
  }
  const matchesRoot = matchesOrganization(department.deptName, query)
  const visible = groups.filter((g) => matchesRoot || matchesOrganization(g.groupName, query))
  const orgName = (id: string) => id === root ? department.deptName : groups.find((g) => g.id === id)?.groupName ?? id
  return <Dialog open onOpenChange={onClose} labelledBy="access-title" className="fg-access-dialog">
    <header><div><h2 id="access-title">{person.name} · {mode === 'scope' ? '数据查看权限' : '特殊标签'}</h2><p>{person.node === root ? department.deptName : orgName(person.node)} · {person.leader ? '负责人任职' : '组员任职'}</p></div><Button variant="ghost" onClick={onClose} aria-label="关闭人员配置"><X size={18} /></Button></header>
    {mode === 'tags' ? <><p>按人员身份保存，同一人跨层任职时同步显示；其他程序读取稳定编码。</p><div className="fg-tag-options">{tags.map((t) => <Button variant="outline" key={t.code} aria-pressed={labels.includes(t.code)} onClick={() => setLabels(labels.includes(t.code) ? labels.filter((v) => v !== t.code) : [...labels, t.code])}>{t.name}<code>{t.code}</code>{labels.includes(t.code) && ' ✓'}</Button>)}</div></> : <>
      <div className="fg-scope-options" role="group" aria-label="基础数据范围">{(Object.keys(scopes) as Scope[]).map((value) => <Button key={value} variant="outline" aria-pressed={scope === value} onClick={() => setScope(value)}>{scopes[value]}</Button>)}</div>
      <p>{scope === 'all' ? '覆盖当前业务系统全部数据。额外组织无需配置，原选择暂存。' : scope === 'team' ? person.leader ? '本人及当前任职节点的下辖范围；其他任职单独配置，最终取并集。' : '当前组员没有下级，“本人及下级”仍只覆盖本人。' : '仅本人归属数据；可以额外授权下方组织范围。'}</p>
      {scope !== 'all' && <><h3>额外指定组织</h3><p>勾选部门覆盖全部下级及未来新增子组。搜索只帮助定位，不改变选取范围。</p>
        <div className="fg-org-picker"><div><Input aria-label="搜索额外组织" placeholder="组织名称 / 拼音缩写，保留上级路径…" value={query} onChange={(e) => setQuery(e.target.value)} />
          {visible.length || matchesRoot ? <div className="fg-org-tree"><div className="fg-org-row"><Button variant="ghost" aria-label={expanded ? '折叠部门选择树' : '展开部门选择树'} aria-expanded={expanded || !!query} onClick={() => setExpanded(!expanded)}>{expanded || query ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</Button><Button variant="outline" role="checkbox" aria-checked={allChildren ? true : selected.length ? 'mixed' : false} aria-label={`选择${department.deptName}及全部下级`} onClick={() => setSelected(allChildren ? [] : [root])}>{allChildren ? '✓' : selected.length ? '−' : ' '}</Button><strong>{department.deptName}</strong></div>
            {(expanded || !!query) && visible.map((g) => <div className="fg-org-row fg-org-child" key={g.id}><Button variant="outline" role="checkbox" aria-checked={checked(g.id)} aria-label={`选择${g.groupName}`} onClick={() => toggleChild(g.id)}>{checked(g.id) ? '✓' : ' '}</Button><span>{g.groupName}</span></div>)}</div> : <p>没有匹配的组织</p>}
        </div><aside><header><strong>已选范围 · {selected.length}</strong><Button variant="ghost" onClick={() => setSelected([])}>清空</Button></header>{selected.length ? selected.map((id) => <div className="fg-selected-org" key={id}><div><strong>{orgName(id)}</strong><small>{id === root ? '含全部下级及未来新增子组' : department.deptName}</small></div><Button variant="ghost" aria-label={`移除${orgName(id)}`} onClick={() => setSelected(selected.filter((v) => v !== id))}><X size={14} /></Button></div>) : <p>从左侧勾选组织</p>}</aside></div>
      </>}
      <p className="fg-access-note">只补充查看范围，不改变人员归属或业绩汇总。HRM 只管系统准入；页面和按钮权限由本系统功能角色管理。</p>
    </>}
    <footer><span>本页内存演示 · 刷新恢复</span><Button variant="outline" onClick={onClose}>取消</Button><Button onClick={() => onSave({ scope, organizations: selected }, labels)}>保存配置</Button></footer>
  </Dialog>
}
