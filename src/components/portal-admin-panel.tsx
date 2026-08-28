import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Check, Link2, Plus, Save, Settings2, Trash2, X } from 'lucide-react'
import { PortalContentError } from '../lib/portal-content'
import { getPortalPermissionCatalog, type PortalPermissionResource } from '../lib/portal-auth'
import { normalizePortalVisibility, portalVisibilityRules } from '../lib/portal-visibility'
import type {
  PortalCardConfig,
  PortalConfig,
  PortalMegaMenuConfig,
  PortalNavigationConfig,
} from '../lib/portal-content-contract'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'
import { Input } from './ui/input'
import { PortalMenuContentEditor } from './portal-menu-content-editor'
import { PortalVisibilityEditor } from './portal-visibility-editor'

type PortalAdminPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: PortalConfig
  initialTab?: AdminTab
  onSave: (config: PortalConfig) => Promise<void>
}

type AdminTab = 'navigation' | 'menus' | 'cards'

function cloneConfig(config: PortalConfig): PortalConfig {
  return {
    version: 1,
    navigation: config.navigation.map((item) => ({ ...item })),
    megaMenus: (config.megaMenus ?? []).map((menu) => ({
      ...menu,
      categories: menu.categories.map((category) => ({
        ...category,
        sections: category.sections.map((section) => ({
          ...section,
          items: section.items.map((item) => ({ ...item })),
        })),
      })),
    })),
    cards: config.cards.map((item) => ({ ...item })),
  }
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function validLink(value: string, allowBlank: boolean) {
  const link = value.trim()
  if (!link) return allowBlank
  if (link.length > 2000) return false
  if (link.startsWith('#') || (link.startsWith('/') && !link.startsWith('//'))) return true
  try {
    const url = new URL(link)
    return (url.protocol === 'http:' || url.protocol === 'https:') && !url.username && !url.password
  } catch {
    return false
  }
}

function createMegaMenu(id: string): PortalMegaMenuConfig {
  const categoryId = `${id}-category-1`
  const sectionId = `${categoryId}-section-1`
  return {
    id,
    categories: [{
      id: categoryId,
      label: '新分类',
      eyebrow: '',
      title: '新菜单标题',
      description: '补充这个分类的使用说明。',
      enabled: true,
      order: 10,
      sections: [{
        id: sectionId,
        title: '入口分组',
        enabled: true,
        order: 10,
        items: [{
          id: `${sectionId}-item-1`,
          title: '新入口',
          description: '补充入口说明。',
          visibility: { mode: 'admin' },
          href: '#systems',
          iconKey: 'grid',
          tone: 'blue',
          enabled: true,
          order: 10,
        }],
      }],
    }],
  }
}

function validateConfig(config: PortalConfig) {
  try {
    portalVisibilityRules(config).forEach(normalizePortalVisibility)
  } catch (error) {
    return error instanceof Error ? error.message : '请检查显示权限配置。'
  }
  if (config.navigation.length > 30 || config.cards.length > 50) return '入口数量超出上限。'
  if (config.navigation.some((item) => !item.name.trim() || !validLink(item.href, Boolean(item.megaMenuId)))) {
    return '请检查顶部导航名称和链接地址；展开菜单可以留空地址。'
  }
  if (config.cards.length === 0 || config.cards.some((item) => !item.name.trim() || !validLink(item.href, false))) {
    return '请至少保留一个卡片，并为每张卡片填写有效的链接地址。'
  }
  const menus = config.megaMenus ?? []
  if (menus.length > 30) return '展开菜单数量超出上限。'
  const menuIds = new Set(menus.map((menu) => menu.id))
  if (config.navigation.some((item) => item.megaMenuId && !menuIds.has(item.megaMenuId))) {
    return '存在找不到内容配置的顶部导航，请重新配置展开内容。'
  }
  for (const menu of menus) {
    if (!menu.categories.length || menu.categories.length > 20) return '每个展开菜单需要保留 1 至 20 个分类。'
    for (const category of menu.categories) {
      if (!category.label.trim() || !category.title.trim() || !category.sections.length || category.sections.length > 20) {
        return '请补充菜单分类名称、标题，并至少保留一个入口分组。'
      }
      for (const section of category.sections) {
        if (!section.title.trim() || !section.items.length || section.items.length > 50) return '请补充入口分组名称，并至少保留一个菜单项。'
        if (section.items.some((item) => !item.title.trim() || !item.description.trim() || !validLink(item.href ?? '', true) || (!item.href?.trim() && !item.systemId))) {
          return '请检查菜单项名称、说明和链接地址；关联系统的菜单项可以留空地址。'
        }
      }
    }
  }
  return null
}

function moveItem<T>(items: T[], index: number, offset: -1 | 1) {
  const nextIndex = index + offset
  if (nextIndex < 0 || nextIndex >= items.length) return items
  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(nextIndex, 0, item)
  return next
}

function navigationLabel(item: PortalNavigationConfig) {
  return item.megaMenuId ? '展开菜单' : '链接入口'
}

export function PortalAdminPanel({ open, onOpenChange, config, onSave, initialTab = 'navigation' }: PortalAdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>(initialTab)
  const [draft, setDraft] = useState<PortalConfig>(() => cloneConfig(config))
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [resources, setResources] = useState<PortalPermissionResource[]>([])
  const [catalogError, setCatalogError] = useState('')
  const [catalogLoading, setCatalogLoading] = useState(false)
  const [catalogRetry, setCatalogRetry] = useState(0)

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    setCatalogLoading(true)
    setCatalogError('')
    getPortalPermissionCatalog(controller.signal)
      .then((catalog) => { if (!controller.signal.aborted) setResources(catalog) })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setResources([])
          setCatalogError(error instanceof Error ? error.message : '功能权限目录读取失败')
        }
      })
      .finally(() => { if (!controller.signal.aborted) setCatalogLoading(false) })
    return () => controller.abort()
  }, [open, catalogRetry])

  useEffect(() => {
    if (!open) return
    setDraft(cloneConfig(config))
    setTab(initialTab)
    setSelectedMenuId(config.megaMenus?.[0]?.id ?? null)
    setError('')
  }, [open, config, initialTab])

  const updateNavigation = (id: string, patch: Partial<PortalNavigationConfig>) => {
    setDraft((current) => ({
      ...current,
      navigation: current.navigation.map((item) => item.id === id ? { ...item, ...patch } : item),
    }))
  }

  const updateCard = (id: string, patch: Partial<PortalCardConfig>) => {
    setDraft((current) => ({
      ...current,
      cards: current.cards.map((item) => item.id === id ? { ...item, ...patch } : item),
    }))
  }

  const addNavigation = () => {
    const menuId = newId('menu')
    const navigationId = newId('nav')
    setDraft((current) => ({
      ...current,
      navigation: [...current.navigation, {
        id: navigationId,
        name: '新导航',
        href: '',
        enabled: true,
        order: current.navigation.length * 10 + 10,
        megaMenuId: menuId,
      }],
      megaMenus: [...(current.megaMenus ?? []), createMegaMenu(menuId)],
    }))
    setSelectedMenuId(menuId)
    setTab('menus')
  }

  const addCard = () => {
    setDraft((current) => ({
      ...current,
      cards: [...current.cards, {
        id: newId('card'),
        name: '新中台入口',
        href: 'https://',
        label: '自定义入口',
        visibility: { mode: 'admin' },
        enabled: true,
        order: current.cards.length * 10 + 10,
      }],
    }))
    setTab('cards')
  }

  const removeNavigation = (id: string) => {
    setDraft((current) => {
      const navigation = current.navigation.find((item) => item.id === id)
      const megaMenuId = navigation?.megaMenuId
      const stillUsed = megaMenuId && current.navigation.some((item) => item.id !== id && item.megaMenuId === megaMenuId)
      return {
        ...current,
        navigation: current.navigation.filter((item) => item.id !== id),
        megaMenus: stillUsed ? current.megaMenus : (current.megaMenus ?? []).filter((menu) => menu.id !== megaMenuId),
      }
    })
    if (selectedMenuId && config.navigation.find((item) => item.id === id)?.megaMenuId === selectedMenuId) setSelectedMenuId(null)
  }

  const openMenuEditor = (item: PortalNavigationConfig) => {
    if (item.megaMenuId) {
      setSelectedMenuId(item.megaMenuId)
      setTab('menus')
      return
    }
    const menuId = newId('menu')
    setDraft((current) => ({
      ...current,
      navigation: current.navigation.map((navigation) => navigation.id === item.id ? { ...navigation, href: '', megaMenuId: menuId } : navigation),
      megaMenus: [...(current.megaMenus ?? []), createMegaMenu(menuId)],
    }))
    setSelectedMenuId(menuId)
    setTab('menus')
  }

  const removeCard = (id: string) => {
    setDraft((current) => ({ ...current, cards: current.cards.filter((item) => item.id !== id) }))
  }

  const submit = async () => {
    const validationError = validateConfig(draft)
    if (validationError) {
      setError(validationError)
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({
        ...draft,
        navigation: draft.navigation.map((item, index) => ({ ...item, order: (index + 1) * 10 })),
        megaMenus: (draft.megaMenus ?? []).map((menu) => ({
          ...menu,
          categories: menu.categories.map((category, categoryIndex) => ({
            ...category,
            order: (categoryIndex + 1) * 10,
            sections: category.sections.map((section, sectionIndex) => ({
              ...section,
              order: (sectionIndex + 1) * 10,
              items: section.items.map((item, itemIndex) => ({ ...item, order: (itemIndex + 1) * 10 })),
            })),
          })),
        })),
        cards: draft.cards.map((item, index) => ({ ...item, order: (index + 1) * 10 })),
      })
      onOpenChange(false)
    } catch (saveError) {
      setError(saveError instanceof PortalContentError ? saveError.message : '保存失败，请稍后重试。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      className="portal-admin-dialog"
      labelledBy="portal-admin-title"
      describedBy="portal-admin-description"
    >
      <div className="portal-admin-heading">
        <span className="portal-admin-mark" aria-hidden="true"><Settings2 size={22} strokeWidth={1.65} /></span>
        <div>
          <h2 id="portal-admin-title">管理门户入口</h2>
        </div>
        <Button variant="icon" className="portal-login-close" aria-label="关闭门户管理" onClick={() => onOpenChange(false)}>
          <X size={18} />
        </Button>
      </div>

      <p id="portal-admin-description" className="portal-admin-description">
        管理导航、展开内容、系统卡片及显示权限。普通账号按功能授权展示，admin 查看全部已启用内容；这里不改变数据权限。
      </p>

      <div className="portal-admin-permission-status" role="status">
        {catalogLoading ? '正在读取人员中台功能权限…' : catalogError ? (
          <><span>{catalogError}</span><Button variant="outline" onClick={() => setCatalogRetry((current) => current + 1)}>重试权限目录</Button></>
        ) : <span>已读取 {resources.length} 项查看权限；人员授权仍在人员中台管理。</span>}
      </div>
      <div className="portal-admin-tabs" role="tablist" aria-label="门户配置类型">
        <button type="button" role="tab" aria-selected={tab === 'navigation'} className={tab === 'navigation' ? 'portal-admin-tab-active' : ''} onClick={() => setTab('navigation')}>
          顶部导航 <span>{draft.navigation.length}</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === 'menus'} className={tab === 'menus' ? 'portal-admin-tab-active' : ''} onClick={() => setTab('menus')}>
          展开内容 <span>{(draft.megaMenus ?? []).length}</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === 'cards'} className={tab === 'cards' ? 'portal-admin-tab-active' : ''} onClick={() => setTab('cards')}>
          系统卡片 <span>{draft.cards.length}</span>
        </button>
      </div>

      <div className="portal-admin-list">
        {tab === 'navigation' ? draft.navigation.map((item, index) => (
          <div className="portal-admin-row" key={item.id}>
            <div className="portal-admin-row-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="portal-admin-row-main">
              <div className="portal-admin-row-title">
                <Badge>{navigationLabel(item)}</Badge>
                <span className={item.enabled ? 'portal-admin-enabled' : 'portal-admin-disabled'}>{item.enabled ? '已启用' : '已停用'}</span>
              </div>
              <div className="portal-admin-fields">
                <label>
                  <span>名称</span>
                  <Input value={item.name} onChange={(event) => updateNavigation(item.id, { name: event.target.value })} placeholder="导航名称" />
                </label>
                <label>
                  <span>链接地址</span>
                  <span className="portal-admin-input-with-icon">
                    <Link2 size={15} />
                    <Input value={item.href} onChange={(event) => updateNavigation(item.id, { href: event.target.value })} placeholder={item.megaMenuId ? '留空保留展开菜单' : 'https:// 或 /path'} />
                  </span>
                </label>
              </div>
              <small>{item.megaMenuId ? '留空时保留鼠标展开菜单；展开后的分类和菜单项在“展开内容”中配置。' : '访问者点击后直接打开此链接。'}</small>
              <PortalVisibilityEditor label={item.name} value={item.visibility} resources={resources}
                inheritDescription={item.megaMenuId && !item.href ? '随下方可见菜单显示，没有可见内容时自动隐藏整个导航。' : undefined}
                onChange={(visibility) => updateNavigation(item.id, { visibility })} />
              <Button variant="outline" className="portal-admin-content-button" onClick={() => openMenuEditor(item)}>
                {item.megaMenuId ? '编辑展开内容' : '配置展开内容'}
              </Button>
            </div>
            <div className="portal-admin-row-actions">
              <Button variant="icon" aria-label="上移导航" disabled={index === 0} onClick={() => setDraft((current) => ({ ...current, navigation: moveItem(current.navigation, index, -1) }))}><ArrowUp size={15} /></Button>
              <Button variant="icon" aria-label="下移导航" disabled={index === draft.navigation.length - 1} onClick={() => setDraft((current) => ({ ...current, navigation: moveItem(current.navigation, index, 1) }))}><ArrowDown size={15} /></Button>
              <Button variant="icon" aria-label={item.enabled ? '停用导航' : '启用导航'} onClick={() => updateNavigation(item.id, { enabled: !item.enabled })}>{item.enabled ? <Check size={15} /> : <span className="portal-admin-off-dot" />}</Button>
              <Button variant="icon" aria-label="删除导航" onClick={() => removeNavigation(item.id)}><Trash2 size={15} /></Button>
            </div>
          </div>
        )) : tab === 'menus' ? (
          <PortalMenuContentEditor
            config={draft}
            selectedMenuId={selectedMenuId}
            onSelectedMenuIdChange={setSelectedMenuId}
            onChange={setDraft}
            resources={resources}
          />
        ) : draft.cards.map((item, index) => (
          <div className="portal-admin-row" key={item.id}>
            <div className="portal-admin-row-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="portal-admin-row-main">
              <div className="portal-admin-row-title">
                <span className={item.enabled ? 'portal-admin-enabled' : 'portal-admin-disabled'}>{item.enabled ? '已启用' : '已停用'}</span>
              </div>
              <div className="portal-admin-fields portal-admin-card-fields">
                <label>
                  <span>卡片名称</span>
                  <Input value={item.name} onChange={(event) => updateCard(item.id, { name: event.target.value })} placeholder="中台名称" />
                </label>
                <label>
                  <span>链接地址</span>
                  <span className="portal-admin-input-with-icon">
                    <Link2 size={15} />
                    <Input value={item.href} onChange={(event) => updateCard(item.id, { href: event.target.value })} placeholder="https:// 或 /path" />
                  </span>
                </label>
                <label>
                  <span>标签（可选）</span>
                  <Input value={item.label ?? ''} onChange={(event) => updateCard(item.id, { label: event.target.value })} placeholder="例如：业务协同" />
                </label>
              </div>
              <small>卡片按名称展示，并使用配置的链接；默认内置入口保留单点登录，修改链接后按新地址打开。</small>
              <PortalVisibilityEditor label={item.name} value={item.visibility} resources={resources}
                onChange={(visibility) => updateCard(item.id, { visibility })} />
            </div>
            <div className="portal-admin-row-actions">
              <Button variant="icon" aria-label="上移卡片" disabled={index === 0} onClick={() => setDraft((current) => ({ ...current, cards: moveItem(current.cards, index, -1) }))}><ArrowUp size={15} /></Button>
              <Button variant="icon" aria-label="下移卡片" disabled={index === draft.cards.length - 1} onClick={() => setDraft((current) => ({ ...current, cards: moveItem(current.cards, index, 1) }))}><ArrowDown size={15} /></Button>
              <Button variant="icon" aria-label={item.enabled ? '停用卡片' : '启用卡片'} onClick={() => updateCard(item.id, { enabled: !item.enabled })}>{item.enabled ? <Check size={15} /> : <span className="portal-admin-off-dot" />}</Button>
              <Button variant="icon" aria-label="删除卡片" onClick={() => removeCard(item.id)}><Trash2 size={15} /></Button>
            </div>
          </div>
        ))}
      </div>

      {tab !== 'menus' && (
        <div className="portal-admin-add-row">
          <Button variant="outline" onClick={tab === 'navigation' ? addNavigation : addCard}>
            <Plus size={15} /> 添加{tab === 'navigation' ? '顶部导航（含展开内容）' : '系统卡片'}
          </Button>
          <span>支持网页链接、站内路径或页面锚点</span>
        </div>
      )}

      {error && <div className="portal-login-error portal-admin-error" role="alert">{error}</div>}

      <div className="portal-admin-footer">
        <span><Settings2 size={14} /> 由人员中台管理权限控制</span>
        <div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={submit} disabled={saving}><Save size={15} /> {saving ? '保存中…' : '保存配置'}</Button>
        </div>
      </div>
    </Dialog>
  )
}
