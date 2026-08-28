import { ArrowDown, ArrowUp, Check, ChevronRight, Link2, Plus, Trash2 } from 'lucide-react'
import type {
  PortalConfig,
  PortalMegaMenuConfig,
  PortalMenuCategoryConfig,
  PortalMenuItemConfig,
  PortalMenuSectionConfig,
  PortalNavigationConfig,
} from '../lib/portal-content-contract'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { PortalVisibilityEditor } from './portal-visibility-editor'
import type { PortalPermissionResource } from '../lib/portal-auth'

type PortalMenuContentEditorProps = {
  config: PortalConfig
  selectedMenuId: string | null
  onSelectedMenuIdChange: (id: string) => void
  onChange: (config: PortalConfig) => void
  resources: PortalPermissionResource[]
}

function moveItem<T>(items: T[], index: number, offset: -1 | 1) {
  const nextIndex = index + offset
  if (nextIndex < 0 || nextIndex >= items.length) return items
  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(nextIndex, 0, item)
  return next
}

function updateMenu(
  config: PortalConfig,
  menuId: string,
  updater: (menu: PortalMegaMenuConfig) => PortalMegaMenuConfig,
) {
  return {
    ...config,
    megaMenus: (config.megaMenus ?? []).map((menu) => menu.id === menuId ? updater(menu) : menu),
  }
}

function updateCategory(
  config: PortalConfig,
  menuId: string,
  categoryId: string,
  updater: (category: PortalMenuCategoryConfig) => PortalMenuCategoryConfig,
) {
  return updateMenu(config, menuId, (menu) => ({
    ...menu,
    categories: menu.categories.map((category) => category.id === categoryId ? updater(category) : category),
  }))
}

function updateSection(
  config: PortalConfig,
  menuId: string,
  categoryId: string,
  sectionId: string,
  updater: (section: PortalMenuSectionConfig) => PortalMenuSectionConfig,
) {
  return updateCategory(config, menuId, categoryId, (category) => ({
    ...category,
    sections: category.sections.map((section) => section.id === sectionId ? updater(section) : section),
  }))
}

function menuNavigationItems(config: PortalConfig) {
  const menuIds = new Set((config.megaMenus ?? []).map((menu) => menu.id))
  return config.navigation.filter((item) => item.megaMenuId && menuIds.has(item.megaMenuId))
}

function navigationForMenu(config: PortalConfig, menuId: string) {
  return config.navigation.find((item) => item.megaMenuId === menuId)
}

function fieldLabel(label: string, input: React.ReactNode) {
  return (
    <label className="portal-admin-menu-field">
      <span>{label}</span>
      {input}
    </label>
  )
}

export function PortalMenuContentEditor({
  config,
  selectedMenuId,
  onSelectedMenuIdChange,
  onChange,
  resources,
}: PortalMenuContentEditorProps) {
  const menus = config.megaMenus ?? []
  const navigationItems = menuNavigationItems(config)
  const selectedMenu = menus.find((menu) => menu.id === selectedMenuId) ?? menus[0]
  const selectedNavigation = selectedMenu ? navigationForMenu(config, selectedMenu.id) : undefined

  const update = (nextConfig: PortalConfig) => onChange(nextConfig)

  const addCategory = () => {
    if (!selectedMenu) return
    const categoryId = `${selectedMenu.id}-category-${Date.now()}`
    update(updateMenu(config, selectedMenu.id, (menu) => ({
      ...menu,
      categories: [...menu.categories, {
        id: categoryId,
        label: '新分类',
        eyebrow: '',
        title: '新菜单标题',
        description: '补充这个分类的使用说明。',
        enabled: true,
        order: (menu.categories.length + 1) * 10,
        sections: [{
          id: `${categoryId}-section-1`,
          title: '入口分组',
          enabled: true,
          order: 10,
          items: [{
            id: `${categoryId}-section-1-item-1`,
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
    })))
  }

  const removeCategory = (categoryId: string) => {
    if (!selectedMenu) return
    update(updateMenu(config, selectedMenu.id, (menu) => ({
      ...menu,
      categories: menu.categories.filter((category) => category.id !== categoryId),
    })))
  }

  const moveCategory = (index: number, offset: -1 | 1) => {
    if (!selectedMenu) return
    update(updateMenu(config, selectedMenu.id, (menu) => ({
      ...menu,
      categories: moveItem(menu.categories, index, offset),
    })))
  }

  const addSection = (category: PortalMenuCategoryConfig) => {
    if (!selectedMenu) return
    const sectionId = `${category.id}-section-${Date.now()}`
    update(updateCategory(config, selectedMenu.id, category.id, (current) => ({
      ...current,
      sections: [...current.sections, {
        id: sectionId,
        title: '新入口分组',
        enabled: true,
        order: (current.sections.length + 1) * 10,
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
    })))
  }

  const removeSection = (categoryId: string, sectionId: string) => {
    if (!selectedMenu) return
    update(updateCategory(config, selectedMenu.id, categoryId, (category) => ({
      ...category,
      sections: category.sections.filter((section) => section.id !== sectionId),
    })))
  }

  const moveSection = (categoryId: string, index: number, offset: -1 | 1) => {
    if (!selectedMenu) return
    update(updateCategory(config, selectedMenu.id, categoryId, (category) => ({
      ...category,
      sections: moveItem(category.sections, index, offset),
    })))
  }

  const addItem = (category: PortalMenuCategoryConfig, section: PortalMenuSectionConfig) => {
    if (!selectedMenu) return
    update(updateSection(config, selectedMenu.id, category.id, section.id, (current) => ({
      ...current,
      items: [...current.items, {
        id: `${section.id}-item-${Date.now()}`,
        title: '新菜单项',
        description: '补充菜单项说明。',
        visibility: { mode: 'admin' },
        href: '#systems',
        iconKey: 'grid',
        tone: 'blue',
        enabled: true,
        order: (current.items.length + 1) * 10,
      }],
    })))
  }

  const removeItem = (categoryId: string, sectionId: string, itemId: string) => {
    if (!selectedMenu) return
    update(updateSection(config, selectedMenu.id, categoryId, sectionId, (section) => ({
      ...section,
      items: section.items.filter((item) => item.id !== itemId),
    })))
  }

  const moveItemInSection = (categoryId: string, sectionId: string, index: number, offset: -1 | 1) => {
    if (!selectedMenu) return
    update(updateSection(config, selectedMenu.id, categoryId, sectionId, (section) => ({
      ...section,
      items: moveItem(section.items, index, offset),
    })))
  }

  const patchItem = (categoryId: string, sectionId: string, itemId: string, patch: Partial<PortalMenuItemConfig>) => {
    if (!selectedMenu) return
    update(updateSection(config, selectedMenu.id, categoryId, sectionId, (section) => ({
      ...section,
      items: section.items.map((item) => item.id === itemId ? { ...item, ...patch } : item),
    })))
  }

  return (
    <div className="portal-admin-menu-editor">
      <aside className="portal-admin-menu-picker" aria-label="选择要编辑的展开菜单">
        <div className="portal-admin-menu-picker-heading">
          <span>顶部导航</span>
          <small>{navigationItems.length} 个展开菜单</small>
        </div>
        {navigationItems.map((navigation: PortalNavigationConfig) => (
          <button
            type="button"
            key={navigation.id}
            className={navigation.megaMenuId === selectedMenu?.id ? 'portal-admin-menu-picker-item portal-admin-menu-picker-item-active' : 'portal-admin-menu-picker-item'}
            onClick={() => onSelectedMenuIdChange(navigation.megaMenuId ?? '')}
          >
            <span>
              <strong>{navigation.name}</strong>
              <small>{navigation.enabled ? '鼠标悬停展开' : '导航已停用'}</small>
            </span>
            <ChevronRight size={15} />
          </button>
        ))}
        {navigationItems.length === 0 && <p className="portal-admin-menu-empty">先在“顶部导航”中新增一个展开菜单。</p>}
      </aside>

      {selectedMenu ? (
        <div className="portal-admin-menu-workspace">
          <div className="portal-admin-menu-workspace-heading">
            <div>
              <h3>{selectedNavigation?.name ?? '展开菜单'}</h3>
            </div>
            <small>修改后会同步到顶部导航的悬停内容。</small>
          </div>

          <div className="portal-admin-menu-category-list">
            {selectedMenu.categories.map((category, categoryIndex) => (
              <section className="portal-admin-menu-category" key={category.id}>
                <div className="portal-admin-menu-block-heading">
                  <div>
                    <span className="portal-admin-row-index">{String(categoryIndex + 1).padStart(2, '0')}</span>
                    <strong>菜单分类</strong>
                    <span className={category.enabled ? 'portal-admin-enabled' : 'portal-admin-disabled'}>{category.enabled ? '已启用' : '已停用'}</span>
                  </div>
                  <div className="portal-admin-row-actions">
                    <Button variant="icon" aria-label="上移菜单分类" disabled={categoryIndex === 0} onClick={() => moveCategory(categoryIndex, -1)}><ArrowUp size={14} /></Button>
                    <Button variant="icon" aria-label="下移菜单分类" disabled={categoryIndex === selectedMenu.categories.length - 1} onClick={() => moveCategory(categoryIndex, 1)}><ArrowDown size={14} /></Button>
                    <Button variant="icon" aria-label={category.enabled ? '停用菜单分类' : '启用菜单分类'} onClick={() => update(updateCategory(config, selectedMenu.id, category.id, (current) => ({ ...current, enabled: !current.enabled })))}>{category.enabled ? <Check size={14} /> : <span className="portal-admin-off-dot" />}</Button>
                    <Button variant="icon" aria-label="删除菜单分类" onClick={() => removeCategory(category.id)}><Trash2 size={14} /></Button>
                  </div>
                </div>
                <div className="portal-admin-menu-category-fields">
                  {fieldLabel('侧栏名称', <Input value={category.label} onChange={(event) => update(updateCategory(config, selectedMenu.id, category.id, (current) => ({ ...current, label: event.target.value })))} />)}
                  {fieldLabel('小标题（可选）', <Input value={category.eyebrow} onChange={(event) => update(updateCategory(config, selectedMenu.id, category.id, (current) => ({ ...current, eyebrow: event.target.value })))} placeholder="留空不显示" />)}
                  {fieldLabel('内容标题', <Input value={category.title} onChange={(event) => update(updateCategory(config, selectedMenu.id, category.id, (current) => ({ ...current, title: event.target.value })))} />)}
                  {fieldLabel('内容说明', <Input value={category.description} onChange={(event) => update(updateCategory(config, selectedMenu.id, category.id, (current) => ({ ...current, description: event.target.value })))} />)}
                </div>

                <PortalVisibilityEditor label={category.label} value={category.visibility} resources={resources}
                  inheritDescription="随可见入口显示；没有可见入口时，分类和对应标题一起隐藏。"
                  onChange={(visibility) => update(updateCategory(config, selectedMenu.id, category.id, (current) => ({ ...current, visibility })))} />
                <div className="portal-admin-menu-section-list">
                  {category.sections.map((section, sectionIndex) => (
                    <div className="portal-admin-menu-section" key={section.id}>
                      <div className="portal-admin-menu-block-heading portal-admin-menu-section-heading">
                        <div><strong>{section.title || '未命名分组'}</strong><span className={section.enabled ? 'portal-admin-enabled' : 'portal-admin-disabled'}>{section.enabled ? '已启用' : '已停用'}</span></div>
                        <div className="portal-admin-row-actions">
                          <Button variant="icon" aria-label="上移入口分组" disabled={sectionIndex === 0} onClick={() => moveSection(category.id, sectionIndex, -1)}><ArrowUp size={13} /></Button>
                          <Button variant="icon" aria-label="下移入口分组" disabled={sectionIndex === category.sections.length - 1} onClick={() => moveSection(category.id, sectionIndex, 1)}><ArrowDown size={13} /></Button>
                          <Button variant="icon" aria-label={section.enabled ? '停用入口分组' : '启用入口分组'} onClick={() => update(updateSection(config, selectedMenu.id, category.id, section.id, (current) => ({ ...current, enabled: !current.enabled })))}>{section.enabled ? <Check size={13} /> : <span className="portal-admin-off-dot" />}</Button>
                          <Button variant="icon" aria-label="删除入口分组" onClick={() => removeSection(category.id, section.id)}><Trash2 size={13} /></Button>
                        </div>
                      </div>
                      <Input value={section.title} onChange={(event) => update(updateSection(config, selectedMenu.id, category.id, section.id, (current) => ({ ...current, title: event.target.value })))} placeholder="入口分组名称" />
                      <PortalVisibilityEditor label={section.title} value={section.visibility} resources={resources}
                        inheritDescription="随可见菜单项显示；没有可见菜单项时自动隐藏分组。"
                        onChange={(visibility) => update(updateSection(config, selectedMenu.id, category.id, section.id, (current) => ({ ...current, visibility })))} />
                      <div className="portal-admin-menu-item-list">
                        {section.items.map((item, itemIndex) => (
                          <div className="portal-admin-menu-item-row" key={item.id}>
                            <div className="portal-admin-menu-item-number">{String(itemIndex + 1).padStart(2, '0')}</div>
                            <div className="portal-admin-menu-item-fields">
                              {fieldLabel('名称', <Input value={item.title} onChange={(event) => patchItem(category.id, section.id, item.id, { title: event.target.value })} />)}
                              {fieldLabel('说明', <Input value={item.description} onChange={(event) => patchItem(category.id, section.id, item.id, { description: event.target.value })} />)}
                              {fieldLabel('徽标（可选）', <Input value={item.badge ?? ''} onChange={(event) => patchItem(category.id, section.id, item.id, { badge: event.target.value })} placeholder="例如：核心" />)}
                              {fieldLabel('链接地址', <span className="portal-admin-input-with-icon"><Link2 size={14} /><Input value={item.href ?? ''} onChange={(event) => patchItem(category.id, section.id, item.id, { href: event.target.value })} placeholder={item.systemId ? '留空使用系统单点入口' : '#systems 或 https://'} /></span>)}
                            </div>
                            <div className="portal-admin-row-actions portal-admin-menu-item-actions">
                              <Button variant="icon" aria-label="上移菜单项" disabled={itemIndex === 0} onClick={() => moveItemInSection(category.id, section.id, itemIndex, -1)}><ArrowUp size={13} /></Button>
                              <Button variant="icon" aria-label="下移菜单项" disabled={itemIndex === section.items.length - 1} onClick={() => moveItemInSection(category.id, section.id, itemIndex, 1)}><ArrowDown size={13} /></Button>
                              <Button variant="icon" aria-label={item.enabled ? '停用菜单项' : '启用菜单项'} onClick={() => patchItem(category.id, section.id, item.id, { enabled: !item.enabled })}>{item.enabled ? <Check size={13} /> : <span className="portal-admin-off-dot" />}</Button>
                              <Button variant="icon" aria-label="删除菜单项" onClick={() => removeItem(category.id, section.id, item.id)}><Trash2 size={13} /></Button>
                            </div>
                            {item.systemId && <small className="portal-admin-menu-item-note">关联系统：{config.cards.find((card) => card.id === item.systemId)?.name ?? '未配置的系统'}；留空地址时沿用系统入口。</small>}
                            <div className="portal-admin-menu-item-visibility">
                              <PortalVisibilityEditor label={item.title} value={item.visibility} resources={resources}
                                inheritDescription={item.systemId ? '沿用关联系统卡片的显示权限；需要更细的控制时选择具体功能权限。' : undefined}
                                onChange={(visibility) => patchItem(category.id, section.id, item.id, { visibility })} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="portal-admin-menu-add-button" onClick={() => addItem(category, section)}><Plus size={14} /> 添加菜单项</Button>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="portal-admin-menu-add-button" onClick={() => addSection(category)}><Plus size={14} /> 添加入口分组</Button>
              </section>
            ))}
          </div>
          <Button variant="outline" onClick={addCategory}><Plus size={14} /> 添加菜单分类</Button>
        </div>
      ) : (
        <div className="portal-admin-menu-empty portal-admin-menu-empty-workspace">选择一个顶部导航开始配置展开内容。</div>
      )}
    </div>
  )
}
