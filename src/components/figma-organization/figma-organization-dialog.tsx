import { useId, useRef, useState, type FormEvent } from 'react'
import { ArrowRightLeft, Check, ChevronDown, Plus, SquarePen, UserMinus, UserPlus, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { findFigmaMember, nextDemoCode, type FigmaAction, type FigmaDepartment, type FigmaDialogAction } from './figma-organization-model'

type Props = {
  department: FigmaDepartment
  action: FigmaDialogAction | null
  onClose: () => void
  onConfirm: (action: FigmaAction) => string | null
}

export function FigmaOrganizationDialog(props: Props) {
  if (!props.action) return null
  const action = props.action
  const key = `${action.type}-${'groupId' in action ? action.groupId : 'memberId' in action ? action.memberId : 'new'}`
  return <ActionForm key={key} {...props} action={action} />
}

function ActionForm({ department, action, onClose, onConfirm }: Props & { action: FigmaDialogAction }) {
  const id = useId()
  const current = 'memberId' in action ? findFigmaMember(department, action.memberId) : null
  const group = 'groupId' in action ? department.groups.find((item) => item.id === action.groupId) : current?.group
  const [name, setName] = useState(action.type === 'rename-group' ? group?.groupName ?? '' : current?.member.name ?? '')
  const [code, setCode] = useState(current?.member.code ?? nextDemoCode(department))
  const [position, setPosition] = useState(current?.member.position ?? '运营专员')
  const [level, setLevel] = useState(current?.member.level ?? 'P6-1')
  const [targetId, setTargetId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const targetRef = useRef<HTMLButtonElement>(null)
  const target = department.groups.find((item) => item.id === targetId)
  const isMemberForm = action.type === 'add-member' || action.type === 'edit-member'
  const icons = { 'add-group': Plus, 'rename-group': SquarePen, 'add-member': UserPlus, 'edit-member': SquarePen, 'transfer-member': ArrowRightLeft, departure: UserMinus }
  const Icon = icons[action.type]
  const titles = {
    'add-group': `在【${department.deptName}】下新增业务组`,
    'rename-group': `重命名业务组【${group?.groupName ?? ''}】`,
    'add-member': '录入在职人员',
    'edit-member': '编辑员工资料',
    'transfer-member': '为员工办理组织调动',
    departure: '办理离职',
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    let result: FigmaAction
    switch (action.type) {
      case 'add-group': result = { type: action.type, id: `demo-group-${crypto.randomUUID()}`, name }; break
      case 'rename-group': result = { ...action, name }; break
      case 'add-member': result = { ...action, id: `demo-member-${crypto.randomUUID()}`, draft: { name, code, position, level } }; break
      case 'edit-member': result = { ...action, draft: { name, position, level } }; break
      case 'transfer-member': result = { ...action, groupId: targetId }; break
      case 'departure': result = action; break
    }
    setError(onConfirm(result))
  }

  return <Dialog open onOpenChange={(open) => { if (!open && !menuOpen) onClose() }} className={`fg-dialog${isMemberForm ? ' fg-member-dialog' : ''}`} labelledBy={`${id}-title`} describedBy={`${id}-scope`}>
    <header className="fg-dialog-header"><span className="fg-dialog-icon"><Icon size={16} /></span><h2 id={`${id}-title`}>{titles[action.type]}</h2><Button variant="ghost" className="fg-dialog-close" title="关闭弹窗" aria-label="关闭弹窗" onClick={onClose}><X size={16} /></Button></header>
    <form onSubmit={submit} className="fg-dialog-form">
      {current && <div className="fg-current-member"><strong>{current.member.name}</strong><code>{current.member.code}</code><span>{current.group.groupName}</span></div>}
      {(action.type === 'add-group' || action.type === 'rename-group') && <div className="fg-field"><label htmlFor={`${id}-name`}>{action.type === 'add-group' ? '新子部门 / 业务组名称' : '修改业务组名称'}</label><Input id={`${id}-name`} data-autofocus required maxLength={40} value={name} onChange={(event) => setName(event.target.value)} placeholder="如：运营七组、短视频运营组" /></div>}
      {isMemberForm && <div className="fg-form-grid">
        <div className="fg-field"><label htmlFor={`${id}-name`}>员工姓名 <span>*</span></label><Input id={`${id}-name`} data-autofocus required maxLength={20} value={name} onChange={(event) => setName(event.target.value)} placeholder="请输入姓名" /></div>
        {action.type === 'add-member' && <div className="fg-field"><label htmlFor={`${id}-code`}>员工编号 <span>*</span></label><Input id={`${id}-code`} required maxLength={30} value={code} onChange={(event) => setCode(event.target.value)} placeholder="E000350" /></div>}
        {action.type === 'add-member' && <div className="fg-field fg-field-wide"><label htmlFor={`${id}-organization`}>归属组织</label><Input id={`${id}-organization`} readOnly value={`${department.deptName} / ${group?.groupName ?? ''}`} /></div>}
        <div className="fg-field"><label htmlFor={`${id}-position`}>岗位名称 <span>*</span></label><Input id={`${id}-position`} required maxLength={40} value={position} onChange={(event) => setPosition(event.target.value)} /></div>
        <div className="fg-field"><label htmlFor={`${id}-level`}>职级 <span>*</span></label><Input id={`${id}-level`} required maxLength={30} value={level} onChange={(event) => setLevel(event.target.value)} /></div>
      </div>}
      {action.type === 'transfer-member' && <div className="fg-field"><label id={`${id}-target-label`}>拟调往的目标组织</label><DropdownMenu onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger ref={targetRef} variant="outline" className="fg-target-trigger" aria-labelledby={`${id}-target-label`}><span>{target?.groupName ?? '请选择调往目标组织'}</span><ChevronDown size={14} /></DropdownMenuTrigger>
        <DropdownMenuContent className="fg-group-menu" aria-labelledby={`${id}-target-label`} onKeyDown={(event) => { if (event.key === 'Tab') { event.preventDefault(); event.stopPropagation(); targetRef.current?.focus() } }}>
          {department.groups.filter((item) => item.id !== current?.group.id).map((item) => <DropdownMenuItem key={item.id} onSelect={() => setTargetId(item.id)}>{item.groupName}{targetId === item.id && <Check size={14} />}</DropdownMenuItem>)}
        </DropdownMenuContent>
      </DropdownMenu></div>}
      {action.type === 'departure' && <p className="fg-departure-confirmation">确认将 <strong>{current?.member.name}</strong> 移出当前示例名录？</p>}
      <p id={`${id}-scope`} className="fg-demo-scope">仅修改本页示例数据，刷新后恢复；不影响 HRM 人员或账号。</p>
      {error && <p role="alert" className="fg-form-error">{error}</p>}
      <footer className="fg-dialog-actions"><Button variant="outline" onClick={onClose}>取消</Button><Button type="submit" className={action.type === 'departure' ? 'fg-confirm-departure' : ''}>{action.type === 'edit-member' ? '保存资料' : action.type === 'add-member' ? '确认提交' : action.type === 'departure' ? '确认离职' : '确认操作'}</Button></footer>
    </form>
  </Dialog>
}
