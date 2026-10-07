import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff, GripVertical, LockKeyhole, MoreHorizontal, Search, Settings2, ChevronDown, Plus, Type, Hash, CalendarDays, CircleCheck, Folder } from 'lucide-react'
import { matchesFilterSearch } from './condition-filter-model'
import { insertField, moveField, setFieldVisible, type ConfigurableField } from './field-config-model'
import './field-config.css'

const icons = { text: Type, number: Hash, date: CalendarDays, select: CircleCheck }
export function FieldConfig({ fields, onChange }: { fields: readonly ConfigurableField[]; onChange: (fields: ConfigurableField[]) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<string[]>([])
  const [menu, setMenu] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [kind, setKind] = useState<ConfigurableField['type']>('text')
  const [error, setError] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const dragging = useRef<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{ id: string; edge: 'before' | 'after' } | null>(null)
  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) { setOpen(false); setMenu(null); setEditing(null) } }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])
  function edit(id: string) { setMenu(null); setEditing(id); setName(fields.find(field => field.id === id)?.label ?? ''); setKind('text'); setError('') }
  function save() {
    const label = name.trim()
    if (!label) { setError('请输入字段名称'); return }
    if (fields.some(field => field.id !== editing && field.label === label)) { setError('字段名称已存在'); return }
    if (editing === '__new') {
      // Keep ungrouped fields together so the configuration list and table agree.
      const firstGroup = fields.findIndex(field => field.group)
      const index = firstGroup < 0 ? fields.length : firstGroup
      onChange([...fields.slice(0, index), { id: `field-${crypto.randomUUID()}`, label, type: kind, visible: true }, ...fields.slice(index)])
    }
    else onChange(fields.map(field => field.id === editing ? { ...field, label, pinyin: undefined, initials: undefined } : field))
    setEditing(null)
  }
  const groups = [...new Set(fields.map(field => field.group ?? ''))]
  return <div className="fc-root" ref={root} onKeyDown={event => { if (event.key === 'Escape') { if (editing) setEditing(null); else if (menu) setMenu(null); else { setOpen(false); trigger.current?.focus() } } }}>
    <button ref={trigger} type="button" className={`fc-trigger ${open ? 'fc-active' : ''}`} aria-expanded={open} onClick={() => { setOpen(!open); setMenu(null); setEditing(null); setQuery('') }}><Settings2 size={15} />字段配置</button>
    {open && <section className="fc-panel" aria-label="字段配置面板"><label className="fc-search"><Search size={15} /><input autoFocus aria-label="搜索字段" placeholder="搜索字段 / 拼音 / 首字母" value={query} onChange={event => { setQuery(event.target.value); setMenu(null) }} /></label>
      <div className="fc-list">{groups.map(group => {
        const members = fields.filter(field => (field.group ?? '') === group)
        const found = members.filter(field => matchesFilterSearch(field, query))
        if (!found.length) return null
        const hidden = collapsed.includes(group) && !query
        return <div key={group}>{group && <div className="fc-group"><button type="button" aria-expanded={!hidden} onClick={() => setCollapsed(old => old.includes(group) ? old.filter(item => item !== group) : [...old, group])}><Folder size={14} /><span>{group}</span><ChevronDown size={12} style={{ transform: hidden ? 'rotate(-90deg)' : undefined }} /></button><button type="button" aria-label={`${members.some(field => field.visible) ? '隐藏' : '显示'}${group}全部字段`} onClick={() => onChange(fields.map(field => field.group === group && !field.locked ? { ...field, visible: !members.some(item => item.visible) } : field))}>{members.some(field => field.visible) ? <Eye size={14} /> : <EyeOff size={14} />}</button></div>}
          {!hidden && found.map(field => {
            const Icon = icons[field.type]
            const peers = members.filter(item => !item.locked)
            const position = peers.findIndex(item => item.id === field.id)
            return <div className={`fc-row ${!field.visible ? 'fc-hidden' : ''} ${group ? 'fc-nested' : ''} ${dropTarget?.id === field.id ? `fc-drop-${dropTarget.edge}` : ''}`} key={field.id} draggable={!field.locked}
              onDragStart={event => {
                if ((event.target as HTMLElement).closest('button, input, select')) { event.preventDefault(); return }
                dragging.current = field.id
                event.dataTransfer.effectAllowed = 'move'
                event.dataTransfer.setData('text/plain', field.id)
              }}
              onDragEnd={() => { dragging.current = null; setDropTarget(null) }}
              onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTarget(current => current?.id === field.id ? null : current) }}
              onDragOver={event => {
                const source = fields.find(item => item.id === dragging.current)
                if (!source || field.locked || source.id === field.id || source.group !== field.group) { setDropTarget(null); return }
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
                const rect = event.currentTarget.getBoundingClientRect()
                setDropTarget({ id: field.id, edge: event.clientY < rect.top + rect.height / 2 ? 'before' : 'after' })
              }}
              onDrop={event => {
                event.preventDefault()
                if (dragging.current && dropTarget?.id === field.id) onChange(insertField(fields, dragging.current, field.id, dropTarget.edge))
                dragging.current = null; setDropTarget(null)
              }}>
              <span className="fc-grip" title={field.locked ? '固定字段' : '按住字段行拖动排序'}><GripVertical size={12} /></span><Icon size={14} /><span className="fc-name" title={field.label}>{field.label}</span>
              {field.locked ? <LockKeyhole size={12} aria-label="固定字段不可隐藏或移动" /> : <button type="button" draggable={false} onPointerDown={event => event.stopPropagation()} aria-label={`${field.visible ? '隐藏' : '显示'}字段 ${field.label}`} aria-pressed={field.visible} onClick={() => onChange(setFieldVisible(fields, field.id, !field.visible))}>{field.visible ? <Eye size={14} /> : <EyeOff size={14} />}</button>}
              <button type="button" aria-label={`${field.label}更多操作`} aria-expanded={menu === field.id} onClick={() => setMenu(menu === field.id ? null : field.id)}><MoreHorizontal size={16} /></button>
              {menu === field.id && <div className="fc-menu"><button type="button" onClick={() => edit(field.id)}>重命名</button><button type="button" disabled={field.locked || position <= 0} onClick={() => { onChange(moveField(fields, field.id, peers[position - 1].id)); setMenu(null) }}>上移</button><button type="button" disabled={field.locked || position >= peers.length - 1} onClick={() => { onChange(moveField(fields, field.id, peers[position + 1].id)); setMenu(null) }}>下移</button></div>}
            </div>
          })}</div>
      })}{!fields.some(field => matchesFilterSearch(field, query)) && <p className="fc-empty">没有匹配字段</p>}</div>
      {editing && <form className="fc-editor" onSubmit={event => { event.preventDefault(); save() }}><strong>{editing === '__new' ? '新增字段' : '重命名字段'}</strong><input autoFocus aria-label="字段名称" maxLength={60} placeholder="字段名称" value={name} onChange={event => setName(event.target.value)} />{editing === '__new' && <select aria-label="字段类型" value={kind} onChange={event => setKind(event.target.value as ConfigurableField['type'])}><option value="text">文本</option><option value="number">数字</option><option value="date">日期</option></select>}{error && <p role="alert">{error}</p>}<div><button type="button" onClick={() => setEditing(null)}>取消</button><button type="submit">确定</button></div></form>}
      <footer><button type="button" onClick={() => edit('__new')}><Plus size={15} />新增字段</button></footer>
    </section>}
  </div>
}
