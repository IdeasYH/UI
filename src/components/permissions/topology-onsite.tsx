import { useState, type ReactNode } from 'react'
import { PermissionContext } from './permission-context'
import { initialPermissions, permissionActions } from './permission-model'
import { actionState, catalog, emptyPage, initialTopology, parseTopology, type Role, type ButtonState } from './topology-model'

const DRAFT_KEY = 'uimodel:topology-onsite-draft:v2'
export function readOnsiteDraft(): Role | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const role = JSON.parse(raw)
    return parseTopology(JSON.stringify({ ...initialTopology(), roles:[role] }))?.roles[0] ?? null
  } catch { return null }
}
export function writeOnsiteDraft(role: Role | null) {
  if (role) sessionStorage.setItem(DRAFT_KEY,JSON.stringify(role))
  else sessionStorage.removeItem(DRAFT_KEY)
}

// Other template pages keep their old demo unless the user explicitly carries a v2 role draft here.
export function TopologyOnsiteBridge({ children, pageId }: { children: ReactNode; pageId:string }) {
  const [role, setRole] = useState(readOnsiteDraft)
  const [action, setAction] = useState<string | null>(null)
  const [error, setError] = useState('')
  if (!role) return children
  const page = catalog.find(p => p.id === pageId)!
  const pg = role.pages[pageId] ?? emptyPage()
  const change = (next:Role) => {
    try { writeOnsiteDraft(next); setRole(next); setError('') }
    catch { setError('无法保存跨页面草稿，请保留当前页面并重试。') }
  }
  const inspect = (code:string) => {
    const target = permissionActions.find(a => a.code === code)
    if (target && target.page !== `page:${pageId}`) { setError('这个旧模板按钮尚未接入当前页面权限树。'); return }
    setAction(target?.code ?? null)
  }
  return <PermissionContext.Provider value={{state:{...initialPermissions(),mode:'patrol'},can:()=>true,reason:()=>'',inspect,launch:()=>{window.location.href='/organization/figma'},assign:()=>{}}}>
    <section className="topology-cross-editor" aria-label="跨页面角色配置">
      <strong>页面点选授权 · {role.name} · {page.name}</strong>
      <p>草稿随本标签页保留；虚线按钮只配置权限。返回权限树统一保存或取消。</p>
      <nav>{catalog.filter(p=>p.href).map(p=><a key={p.id} href={p.href} aria-current={p.id===pageId ? 'page' : undefined}>{p.name}</a>)}</nav>
      <button onClick={()=>setAction(null)}>配置当前页面访问</button>
      {action ? <label>{page.actions.find(a=>a.id===action)?.name}<select aria-label="点选按钮权限" value={actionState(role,pageId,action)} onChange={e=>change({...role,pages:{...role.pages,[pageId]:{...pg,buttons:{...pg.buttons,[action]:e.target.value as ButtonState}}}})}><option value="hidden">隐藏</option><option value="disabled">可见不可用</option><option value="enabled">可见可用</option></select></label> : <><label><input type="checkbox" checked={pg.access} onChange={e=>change({...role,pages:{...role.pages,[pageId]:{...pg,access:e.target.checked}}})}/>允许进入页面</label><label><input type="checkbox" checked={pg.full} onChange={e=>change({...role,pages:{...role.pages,[pageId]:{...pg,access:e.target.checked || pg.access,full:e.target.checked,buttons:!e.target.checked && pg.full ? Object.fromEntries(page.actions.map(a=>[a.id,actionState(role,pageId,a.id)])) : pg.buttons}}})}/>全页授权（含未来按钮）</label></>}
      {!page.actions.length && <p>此页目前仅登记页面访问，内部按钮尚未接入。</p>}
      <a href="/organization/figma">返回权限树 / 保存角色</a>{error && <p role="alert">{error}</p>}
    </section>{children}
  </PermissionContext.Provider>
}
