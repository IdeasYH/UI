import { useEffect, useMemo, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  Database,
  FileSpreadsheet,
  Handshake,
  KeyRound,
  LifeBuoy,
  ListChecks,
  LayoutGrid,
  LogIn,
  Menu,
  MessageCircle,
  MessageSquareText,
  Network,
  PhoneCall,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  UserRoundCog,
  Users,
  X,
} from 'lucide-react'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { PortalAdminPanel } from './components/portal-admin-panel'
import { PortalLoginDialog } from './components/portal-login-dialog'
import { PortalUserMenu } from './components/portal-user-menu'
import { getPortalConfig, savePortalConfig } from './lib/portal-content'
import {
  canManagePortal,
  defaultPortalConfig,
  type PortalCardConfig,
  type PortalConfig,
  type PortalMegaMenuConfig,
  type PortalMenuCategoryConfig,
  type PortalMenuItemConfig,
  type PortalMenuSectionConfig,
} from './lib/portal-content-contract'
import { getPortalSession, logoutPortal, type PortalSession } from './lib/portal-auth'
import { portalPermissionApplications, selectVisiblePortalConfig, withPortalVisibilityDefaults } from './lib/portal-visibility'
import { cn } from './lib/utils'
import { PORTAL_FAVORITES_KEY, readPortalFavorites } from './lib/portal-favorites'

type System = {
  id: string
  code: string
  name: string
  shortName: string
  label: string
  heroLead: string
  heroAccent: string
  description: string
  capabilities: string[]
  accountModes?: string[]
  href: string
  ssoHref?: string
  icon: LucideIcon
  tone: string
}

type MegaMenuItem = {
  id?: string
  title: string
  description: string
  icon: LucideIcon
  tone: string
  badge?: string
  href?: string
  systemId?: string
}

type MegaMenuCategory = {
  label: string
  eyebrow: string
  title: string
  description: string
  sections: Array<{
    title: string
    items: MegaMenuItem[]
  }>
}

type MegaMenuGroup = {
  id: string
  label: string
  categories: MegaMenuCategory[]
}

const defaultSystems: System[] = [
  {
    id: 'hrm',
    code: 'HRM',
    name: '人员与组织中台',
    shortName: '人员与组织',
    label: '组织数字化',
    heroLead: '让组织事实，',
    heroAccent: '清晰可用',
    description: '让人员、组织、岗位与权限，共用同一套可追溯的事实。',
    capabilities: ['人员生命周期', '组织与岗位', '招聘流程', '权限与数据范围'],
    href: '/components/person-picker',
    icon: Users,
    tone: 'tone-blue',
  },
  {
    id: 'invest',
    code: 'INVEST',
    name: '水果招商中台',
    shortName: '水果招商',
    label: '招商数字化',
    heroLead: '让商户协同，',
    heroAccent: '从线索走向签约',
    description: '招商账号在这里推进线索、跟进、签约与商户入驻，过程和结果保持连续。',
    capabilities: ['招商线索与分配', '客户跟进', '签约管理', '商户入驻'],
    accountModes: ['招商账号'],
    href: '/components/person-picker',
    icon: Store,
    tone: 'tone-orange',
  },
  {
    id: 'operator',
    code: 'OPERATOR',
    name: '水果运营中台',
    shortName: '水果运营',
    label: '经营数字化',
    heroLead: '让门店经营，',
    heroAccent: '每天清晰可见',
    description: '与水果招商中台共用同一平台，运营账号在这里处理门店主档、经营数据与日报。',
    capabilities: ['门店主档', '经营数据', '日报生成', '数据同步'],
    accountModes: ['运营账号'],
    href: '/components/person-picker',
    icon: BarChart3,
    tone: 'tone-mint',
  },
]

const publicPortal: System = {
  id: 'portal', code: '', name: '尚毅门户', shortName: '统一入口', label: '统一入口',
  heroLead: '你的工作，', heroAccent: '从这里开始',
  description: '门户介绍无需登录。登录后，查看你有权限使用的系统和功能入口。',
  capabilities: [], href: '', icon: LayoutGrid, tone: 'tone-blue',
}

function buildConfiguredSystems(cards: PortalCardConfig[]): System[] {
  return cards
    .filter((card) => card.enabled && card.name.trim() && card.href.trim())
    .slice()
    .sort((first, second) => first.order - second.order)
    .map((card) => {
      const base = defaultSystems.find((system) => system.id === card.id)
      if (base) {
        const name = card.name.trim()
        const href = card.href.trim()
        return {
          ...base,
          name,
          shortName: name.length <= 12 ? name : base.shortName,
          label: card.label?.trim() || base.label,
          href,
          // 默认入口保留 Invest 的单点登录；管理员改了 URL 后，按配置直接打开新地址。
          ssoHref: href === base.href ? base.ssoHref : undefined,
        }
      }

      const name = card.name.trim()
      return {
        id: card.id,
        code: 'LINK',
        name,
        shortName: name.length <= 12 ? name : '自定义入口',
        label: card.label?.trim() || '自定义入口',
        heroLead: '从门户进入，',
        heroAccent: name,
        description: `从尚毅门户进入${name}，具体权限由业务系统执行。`,
        capabilities: ['统一入口', '按系统权限访问'],
        href: card.href.trim(),
        icon: LayoutGrid,
        tone: 'tone-blue',
      }
    })
}

const defaultMenuGroups: MegaMenuGroup[] = [
  {
    id: 'system',
    label: '系统矩阵',
    categories: [
      {
        label: '全部系统',
        eyebrow: '',
        title: '尚毅核心业务系统',
        description: '从同一个入口，进入人员、招商与运营工作现场。',
        sections: [
          {
            title: '核心业务系统',
            items: [
              { title: '人员与组织中台', description: '人员、组织、招聘与权限', icon: Users, tone: 'blue', badge: '核心', href: defaultSystems[0].href, systemId: 'hrm' },
              { title: '水果招商中台', description: '线索、跟进、签约与入驻', icon: Store, tone: 'orange', badge: '招商账号', href: defaultSystems[1].href, systemId: 'invest' },
              { title: '水果运营中台', description: '门店、经营数据与日报', icon: BarChart3, tone: 'mint', badge: '运营账号', href: defaultSystems[2].href, systemId: 'operator' },
            ],
          },
          {
            title: '常用能力',
            items: [
              { title: '组织与权限', description: '统一人员和数据范围', icon: ShieldCheck, tone: 'cyan', systemId: 'hrm' },
              { title: '招商跟进', description: '推进线索与商户合作', icon: PhoneCall, tone: 'coral', systemId: 'invest' },
              { title: '经营日报', description: '运营账号生成并核对日报', icon: FileSpreadsheet, tone: 'green', systemId: 'operator' },
              { title: '数据同步', description: '更新门店业务快照', icon: RefreshCw, tone: 'purple', systemId: 'operator' },
            ],
          },
        ],
      },
      {
        label: '组织与权限',
        eyebrow: '',
        title: '人员与组织能力',
        description: '围绕人员生命周期、组织事实与访问边界开展工作。',
        sections: [
          {
            title: '人员与组织能力',
            items: [
              { title: '人员名册', description: '查询人员与任职状态', icon: Users, tone: 'blue', systemId: 'hrm' },
              { title: '组织架构', description: '维护组织、岗位与负责人', icon: Network, tone: 'cyan', systemId: 'hrm' },
              { title: '招聘管理', description: '候选人、面试与入职安排', icon: BriefcaseBusiness, tone: 'violet', systemId: 'hrm' },
              { title: '权限中心', description: '角色、功能与数据范围', icon: KeyRound, tone: 'orange', systemId: 'hrm' },
              { title: '人员变化', description: '入职、调岗与职级调整', icon: UserRoundCog, tone: 'green', systemId: 'hrm' },
              { title: '组织事实', description: '让下游系统统一引用', icon: Building2, tone: 'coral', systemId: 'hrm' },
            ],
          },
        ],
      },
      {
        label: '业务增长',
        eyebrow: '',
        title: '招商与商户协同',
        description: '让每条线索从进入到签约、入驻都能找到下一步。',
        sections: [
          {
            title: '招商能力',
            items: [
              { title: '线索分配', description: '公海、私海与分配队列', icon: Route, tone: 'blue', systemId: 'invest' },
              { title: '招商跟进', description: '记录联系与下一次行动', icon: PhoneCall, tone: 'cyan', systemId: 'invest' },
              { title: '签约管理', description: '沉淀有效签约事实', icon: Handshake, tone: 'orange', systemId: 'invest' },
              { title: '商户入驻', description: '提交资料并推进运营交接', icon: Store, tone: 'coral', systemId: 'invest' },
              { title: '招商工作台', description: '查看个人与团队进展', icon: Sparkles, tone: 'violet', systemId: 'invest' },
              { title: '共享公海', description: '统一查看待分配线索', icon: LayoutGrid, tone: 'green', systemId: 'invest' },
            ],
          },
        ],
      },
      {
        label: '运营管理',
        eyebrow: '',
        title: '门店经营与数据管理',
        description: '围绕门店主档、日报和经营指标，形成连续的运营视图。',
        sections: [
          {
            title: '经营数据',
            items: [
              { title: '门店主档', description: '运营账号查看门店信息', icon: Database, tone: 'blue', systemId: 'operator' },
              { title: '日报生成', description: '运营账号生成正确日报', icon: FileSpreadsheet, tone: 'green', systemId: 'operator' },
              { title: '经营数据', description: '运营账号查看关键指标', icon: BarChart3, tone: 'cyan', systemId: 'operator' },
              { title: '数据同步', description: '运营账号更新业务快照', icon: RefreshCw, tone: 'orange', systemId: 'operator' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'collaboration',
    label: '业务协同',
    categories: [
      {
        label: '全业务链路',
        eyebrow: '',
        title: '三个入口，一条工作路径',
        description: '招商与运营共用同一平台，通过账号权限进入各自工作现场。',
        sections: [
          {
            title: '端到端协同',
            items: [
              { title: '组织与身份', description: '从人员和权限开始', icon: Users, tone: 'blue', systemId: 'hrm' },
              { title: '线索与商户', description: '推进招商与有效签约', icon: Store, tone: 'orange', systemId: 'invest' },
              { title: '运营交接', description: '承接可经营门店与主档', icon: BarChart3, tone: 'mint', systemId: 'operator' },
              { title: '经营复盘', description: '用日报和指标核对结果', icon: RefreshCw, tone: 'violet', systemId: 'operator' },
            ],
          },
        ],
      },
      {
        label: '招商协同',
        eyebrow: '',
        title: '从线索到运营交接',
        description: '让线索分配、跟进、签约和入驻按顺序推进。',
        sections: [
          {
            title: '招商链路',
            items: [
              { title: '获取人员范围', description: '按人员中台权限进入业务', icon: ShieldCheck, tone: 'blue', systemId: 'hrm' },
              { title: '分配与跟进', description: '将线索推进到有意愿', icon: Route, tone: 'cyan', systemId: 'invest' },
              { title: '签约与入驻', description: '形成商户合作事实', icon: Handshake, tone: 'orange', systemId: 'invest' },
              { title: '运营交接', description: '在同一平台承接可经营门店', icon: Store, tone: 'green', systemId: 'operator' },
            ],
          },
        ],
      },
      {
        label: '经营复盘',
        eyebrow: '',
        title: '从门店经营到结果复盘',
        description: '门店主档、日报和经营指标在同一条运营链路中持续核对。',
        sections: [
          {
            title: '经营链路',
            items: [
              { title: '门店主档', description: '运营账号确认门店生命周期', icon: Database, tone: 'blue', systemId: 'operator' },
              { title: '经营数据', description: '运营账号汇总日报和指标', icon: BarChart3, tone: 'mint', systemId: 'operator' },
              { title: '异常核对', description: '定位缺失和异常数据', icon: ListChecks, tone: 'violet', systemId: 'operator' },
              { title: '结果复盘', description: '查看结果与改进方向', icon: RefreshCw, tone: 'orange', systemId: 'operator' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'operations',
    label: '数据与运营',
    categories: [
      {
        label: '经营数据',
        eyebrow: '',
        title: '把门店经营数据放在一起看',
        description: '围绕门店主档、日报和经营指标形成稳定视图。',
        sections: [
          {
            title: '数据能力',
            items: [
              { title: '门店主档', description: '运营账号查看门店业务信息', icon: Database, tone: 'blue', systemId: 'operator' },
              { title: '日报生成', description: '运营账号生成并验收日报', icon: FileSpreadsheet, tone: 'green', systemId: 'operator' },
              { title: '经营排行', description: '运营账号查看指标表现', icon: BarChart3, tone: 'cyan', systemId: 'operator' },
              { title: '版本同步', description: '运营账号更新数据快照', icon: RefreshCw, tone: 'orange', systemId: 'operator' },
            ],
          },
        ],
      },
      {
        label: '运营协同',
        eyebrow: '',
        title: '让门店事实和日常动作保持一致',
        description: '运营账号围绕门店、日报、同步和异常核对完成日常协作。',
        sections: [
          {
            title: '运营能力',
            items: [
              { title: '门店维护', description: '核对门店主档和状态', icon: Database, tone: 'violet', systemId: 'operator' },
              { title: '经营日报', description: '生成并检查每日数据', icon: FileSpreadsheet, tone: 'coral', systemId: 'operator' },
              { title: '异常清单', description: '集中处理待核对事项', icon: ListChecks, tone: 'green', systemId: 'operator' },
              { title: '经营概览', description: '查看结果和门店表现', icon: BarChart3, tone: 'blue', systemId: 'operator' },
            ],
          },
        ],
      },
      {
        label: '结果复盘',
        eyebrow: '',
        title: '从结果回到业务动作',
        description: '用经营数据解释门店表现，让问题回到可执行的运营动作。',
        sections: [
          {
            title: '复盘入口',
            items: [
              { title: '经营概览', description: '运营账号查看门店表现', icon: BarChart3, tone: 'mint', systemId: 'operator' },
              { title: '日报追溯', description: '回看每日生成结果', icon: FileSpreadsheet, tone: 'violet', systemId: 'operator' },
              { title: '来源核对', description: '确认结果引用的数据', icon: Database, tone: 'blue', systemId: 'operator' },
              { title: '重新同步', description: '回到数据来源检查更新', icon: RefreshCw, tone: 'orange', systemId: 'operator' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'support',
    label: '帮助与支持',
    categories: [
      {
        label: '开始使用',
        eyebrow: '',
        title: '快速找到正确的系统入口',
        description: '先确定工作内容，再进入对应系统继续处理。',
        sections: [
          {
            title: '入口说明',
            items: [
              { title: '系统目录', description: '查看全部核心系统', icon: LayoutGrid, tone: 'blue', href: '#systems' },
              { title: '业务链路', description: '了解系统之间的关系', icon: Route, tone: 'cyan', href: '#workflow' },
              { title: '登录说明', description: '可选登录并复用统一身份', icon: LogIn, tone: 'violet', href: '#support' },
              { title: '使用说明', description: '了解入口与权限边界', icon: BookOpen, tone: 'green', href: '#support' },
            ],
          },
        ],
      },
      {
        label: '登录与权限',
        eyebrow: '',
        title: '门户身份与系统权限各司其职',
        description: '门户复用人员中台身份，具体功能和数据范围仍由对应系统执行。',
        sections: [
          {
            title: '访问帮助',
            items: [
              { title: '账号登录', description: '使用人员中台账号登录门户', icon: LogIn, tone: 'blue', href: '#support' },
              { title: '权限范围', description: '按人员和组织范围访问', icon: ShieldCheck, tone: 'violet', systemId: 'hrm' },
              { title: '入口不可用', description: '确认目标服务是否启动', icon: LifeBuoy, tone: 'orange', href: '#support' },
              { title: '切换系统', description: '回到首页选择其他入口', icon: RefreshCw, tone: 'green', href: '#systems' },
            ],
          },
        ],
      },
      {
        label: '反馈支持',
        eyebrow: '',
        title: '问题要反馈到正确的位置',
        description: '入口问题在首页反馈，业务问题由对应系统负责人处理。',
        sections: [
          {
            title: '支持入口',
            items: [
              { title: '入口反馈', description: '反馈链接或导航问题', icon: MessageSquareText, tone: 'blue', href: '#support' },
              { title: '系统帮助', description: '进入系统查看具体说明', icon: CircleHelp, tone: 'cyan', href: '#systems' },
              { title: '运行状态', description: '确认本地服务是否可用', icon: LifeBuoy, tone: 'green', href: '#support' },
              { title: '返回首页', description: '重新选择工作入口', icon: LayoutGrid, tone: 'violet', href: '#top' },
            ],
          },
        ],
      },
    ],
  },
]

const menuIconRegistry: Record<string, LucideIcon> = {
  users: Users,
  store: Store,
  barChart: BarChart3,
  shield: ShieldCheck,
  phone: PhoneCall,
  spreadsheet: FileSpreadsheet,
  refresh: RefreshCw,
  network: Network,
  briefcase: BriefcaseBusiness,
  key: KeyRound,
  person: UserRoundCog,
  building: Building2,
  route: Route,
  handshake: Handshake,
  sparkles: Sparkles,
  grid: LayoutGrid,
  database: Database,
  list: ListChecks,
  login: LogIn,
  book: BookOpen,
  help: CircleHelp,
  lifeBuoy: LifeBuoy,
  message: MessageSquareText,
}

function iconKeyFor(icon: LucideIcon) {
  return Object.entries(menuIconRegistry).find(([, candidate]) => candidate === icon)?.[0] ?? 'grid'
}

function serializeMenuGroups(groups: MegaMenuGroup[]): PortalMegaMenuConfig[] {
  return groups.map((group) => ({
    id: group.id,
    categories: group.categories.map((category, categoryIndex) => {
      const categoryId = `${group.id}-category-${categoryIndex + 1}`
      return {
        id: categoryId,
        label: category.label,
        eyebrow: category.eyebrow,
        title: category.title,
        description: category.description,
        enabled: true,
        order: (categoryIndex + 1) * 10,
        sections: category.sections.map((section, sectionIndex) => {
          const sectionId = `${categoryId}-section-${sectionIndex + 1}`
          return {
            id: sectionId,
            title: section.title,
            enabled: true,
            order: (sectionIndex + 1) * 10,
            items: section.items.map((item, itemIndex) => ({
              id: `${sectionId}-item-${itemIndex + 1}`,
              title: item.title,
              description: item.description,
              ...(item.badge ? { badge: item.badge } : {}),
              ...(item.href ? { href: item.href } : {}),
              ...(item.systemId ? { systemId: item.systemId } : {}),
              iconKey: iconKeyFor(item.icon),
              tone: item.tone,
              enabled: true,
              order: (itemIndex + 1) * 10,
            })),
          }
        }),
      } satisfies PortalMenuCategoryConfig
    }),
  }))
}

const builtInPortalConfig: PortalConfig = withPortalVisibilityDefaults({
  ...defaultPortalConfig,
  megaMenus: serializeMenuGroups(defaultMenuGroups),
})

function buildMenuGroups(menuConfigs: PortalMegaMenuConfig[]): MegaMenuGroup[] {
  const fallbackMenus = serializeMenuGroups(defaultMenuGroups)
  return menuConfigs.map((menu) => {
    const fallbackMenu = fallbackMenus.find((candidate) => candidate.id === menu.id)
    return {
      id: menu.id,
      label: fallbackMenu?.id ?? menu.id,
      categories: menu.categories
        .filter((category) => category.enabled)
        .slice()
        .sort((first, second) => first.order - second.order)
        .map((category) => ({
          label: category.label,
          eyebrow: category.eyebrow,
          title: category.title,
          description: category.description,
          sections: category.sections
            .filter((section) => section.enabled)
            .slice()
            .sort((first, second) => first.order - second.order)
            .map((section) => ({
              title: section.title,
              items: section.items
                .filter((item) => item.enabled)
                .slice()
                .sort((first, second) => first.order - second.order)
                .map((item) => ({
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  icon: menuIconRegistry[item.iconKey ?? 'grid'] ?? LayoutGrid,
                  tone: item.tone || 'blue',
                  ...(item.badge ? { badge: item.badge } : {}),
                  ...(item.href ? { href: item.href } : {}),
                  ...(item.systemId ? { systemId: item.systemId } : {}),
                })),
            })),
        })),
    }
  })
}

const flowItems = [
  {
    number: '01',
    systemId: 'hrm',
    icon: Users,
    title: '组织与身份',
    copy: '人员中台提供人员、组织与权限事实。',
    tone: 'flow-blue',
  },
  {
    number: '02',
    systemId: 'invest',
    icon: Store,
    title: '线索与商户',
    copy: '招商中台承接线索，推进签约与入驻。',
    tone: 'flow-orange',
  },
  {
    number: '03',
    systemId: 'operator',
    icon: BarChart3,
    title: '门店经营',
    copy: '运营账号在同一招商中台汇总门店与日报。',
    tone: 'flow-mint',
  },
  {
    number: '04',
    systemId: 'operator',
    icon: RefreshCw,
    title: '结果复盘',
    copy: '运营账号回看日报、指标与异常处理结果。',
    tone: 'flow-violet',
  },
]

function MegaMenuEntry({
  item,
  resolvedHref,
  onActivate,
}: {
  item: MegaMenuItem
  resolvedHref?: string
  onActivate: (item: MegaMenuItem) => void
}) {
  const Icon = item.icon
  const href = resolvedHref ?? item.href
  const content = (
    <>
      <span className={cn('mega-item-logo', `mega-logo-${item.tone}`)} aria-hidden="true">
        <Icon size={21} strokeWidth={1.75} />
      </span>
      <span className="mega-item-copy">
        <span className="mega-item-title-row">
          <strong>{item.title}</strong>
          {item.badge && <span className="mega-item-badge">{item.badge}</span>}
        </span>
        <small>{item.description}</small>
      </span>
      <ArrowRight className="mega-item-arrow" size={15} strokeWidth={1.7} />
    </>
  )

  if (href) {
    const opensNewWindow = href.startsWith('http')
    return (
      <a
        className="mega-menu-item"
        href={href}
        role="menuitem"
        target={opensNewWindow ? '_blank' : undefined}
        rel={opensNewWindow ? 'noreferrer' : undefined}
        onClick={() => onActivate(item)}
      >
        {content}
      </a>
    )
  }

  return (
    <button className="mega-menu-item" type="button" role="menuitem" onClick={() => onActivate(item)}>
      {content}
    </button>
  )
}

function App() {
  const previewParams = new URLSearchParams(window.location.search)
  const previewPanel = previewParams.get('panel')
  const previewMenu = previewParams.get('menu')
  const initialMenu = ['system', 'collaboration', 'operations', 'support'].includes(previewMenu ?? '') ? previewMenu : null
  const initialAdminTab = previewPanel === 'menus' ? 'menus' : previewPanel === 'cards' ? 'cards' : 'navigation'
  const [activeIndex, setActiveIndex] = useState(0)
  const [openMenu, setOpenMenu] = useState<string | null>(initialMenu)
  const [activeMegaCategory, setActiveMegaCategory] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(Boolean(initialMenu))
  const [searchOpen, setSearchOpen] = useState(previewPanel === 'search')
  const [query, setQuery] = useState('')
  // Read before the first save effect, including React StrictMode's effect replay.
  const [favorites, setFavorites] = useState(() => readPortalFavorites())
  const [portalSession, setPortalSession] = useState<PortalSession | null>(null)
  const [authStatus, setAuthStatus] = useState<'checking' | 'anonymous' | 'authenticated' | 'unavailable'>('checking')
  const [loginOpen, setLoginOpen] = useState(previewPanel === 'login')
  const [portalConfig, setPortalConfig] = useState<PortalConfig>(builtInPortalConfig)
  const [configReady, setConfigReady] = useState(false)
  const [adminOpen, setAdminOpen] = useState(['admin', 'menus', 'cards'].includes(previewPanel ?? ''))
  const closeMenuTimerRef = useRef<number | null>(null)
  const sessionRequestRef = useRef(0)
  const sessionAbortRef = useRef<AbortController | null>(null)
  const refreshSessionRef = useRef<(() => void) | null>(null)
  const initialAnchorRef = useRef(window.location.hash.slice(1))
  const permissionApplications = useMemo(() => portalPermissionApplications(portalConfig), [portalConfig])
  const applicationsKey = permissionApplications.join(',')
  const visibleConfig = useMemo(
    () => selectVisiblePortalConfig(portalConfig, authStatus === 'authenticated' ? portalSession : null),
    [portalConfig, portalSession, authStatus],
  )
  const systems = useMemo(() => buildConfiguredSystems(visibleConfig.cards), [visibleConfig.cards])
  const visibleFlowItems = flowItems.filter((item) => systems.some((system) => system.id === item.systemId))
  const menuGroups = useMemo(
    () => buildMenuGroups(visibleConfig.megaMenus ?? []),
    [visibleConfig.megaMenus],
  )
  const navigationItems = useMemo(
    () => visibleConfig.navigation
      .filter((item) => item.enabled && item.name.trim())
      .slice()
      .sort((first, second) => first.order - second.order),
    [visibleConfig.navigation],
  )
  // 无可见系统时使用无业务链接的公开主视觉，禁止回退到第一张受限卡片。
  const activeSystem = systems[activeIndex] ?? systems[0] ?? publicPortal
  const ActiveIcon = activeSystem.icon
  const canManage = authStatus === 'authenticated' && portalSession?.permissionsAvailable
    ? canManagePortal(portalSession.permissions) : false
  const permissionUnavailable = authStatus === 'unavailable' || (portalSession && !portalSession.permissionsAvailable)

  const systemEntryHref = (system: System) => portalSession && system.ssoHref ? system.ssoHref : system.href
  const activeSystemHref = systems.length > 0 ? systemEntryHref(activeSystem) : undefined
  const systemEntryHrefById = (systemId: string) => {
    const system = systems.find((candidate) => candidate.id === systemId)
    return system ? systemEntryHref(system) : undefined
  }

  useEffect(() => {
    if (activeIndex >= systems.length) setActiveIndex(0)
  }, [activeIndex, systems.length])

  useEffect(() => {
    const refresh = (checking = false) => {
      const requestId = ++sessionRequestRef.current
      sessionAbortRef.current?.abort()
      const controller = new AbortController()
      sessionAbortRef.current = controller
      if (checking) setAuthStatus('checking')
      let timedOut = false
      const timeout = window.setTimeout(() => { timedOut = true; controller.abort() }, 12000)
      getPortalSession(controller.signal, applicationsKey.split(','))
        .then((session) => {
          if (controller.signal.aborted || sessionRequestRef.current !== requestId) return
          setPortalSession(session)
          setAuthStatus(session ? 'authenticated' : 'anonymous')
        })
        .catch(() => {
          if (sessionRequestRef.current !== requestId || (controller.signal.aborted && !timedOut)) return
          setPortalSession(null)
          setAuthStatus('unavailable')
        })
        .finally(() => window.clearTimeout(timeout))
    }
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') refresh() }
    refreshSessionRef.current = () => refresh(true)
    refresh(true)
    // 返回门户或 HRM 撤销权限后重新读取，不把权限存入 localStorage。
    window.addEventListener('focus', refreshWhenVisible)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    const interval = window.setInterval(refreshWhenVisible, 60000)
    return () => {
      ++sessionRequestRef.current
      sessionAbortRef.current?.abort()
      window.removeEventListener('focus', refreshWhenVisible)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      window.clearInterval(interval)
    }
  }, [applicationsKey])

  useEffect(() => {
    getPortalConfig()
      .then((config) => setPortalConfig(withPortalVisibilityDefaults({
        ...config,
        // 老配置没有 megaMenus 时，继续带出当前内置菜单，管理员保存后即可持久化修改。
        megaMenus: config.megaMenus ?? builtInPortalConfig.megaMenus,
      })))
      .catch(() => {
        // 配置服务暂不可用时继续使用内置入口，保证门户仍可浏览。
      })
      .finally(() => setConfigReady(true))
  }, [])

  useEffect(() => {
    if (!configReady || authStatus === 'checking' || !initialAnchorRef.current) return
    const anchor = initialAnchorRef.current
    if (window.location.hash.slice(1) !== anchor) {
      initialAnchorRef.current = ''
      return
    }
    // Permission-filtered sections may not exist during the shell's first render.
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' })
      initialAnchorRef.current = ''
    })
    return () => window.cancelAnimationFrame(frame)
  }, [authStatus, configReady])

  useEffect(() => {
    return () => {
      if (closeMenuTimerRef.current !== null) window.clearTimeout(closeMenuTimerRef.current)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(PORTAL_FAVORITES_KEY, JSON.stringify(favorites))
    } catch {
      // 收藏只增强导航体验，存储不可用时不影响入口使用。
    }
  }, [favorites])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || systems.length === 0) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % systems.length)
    }, 5200)
    return () => window.clearInterval(timer)
  }, [systems.length])

  const filteredSystems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return systems
    return systems.filter((system) => {
      const searchable = [
        system.name,
        system.code,
        system.shortName,
        system.label,
        system.description,
        ...system.capabilities,
        ...(system.accountModes ?? []),
      ]
        .join(' ')
        .toLowerCase()
      return searchable.includes(normalized)
    })
  }, [query, systems])

  const toggleFavorite = (id: string) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const scrollToSystems = () => {
    document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const selectSystem = (id: string) => {
    const nextIndex = systems.findIndex((system) => system.id === id)
    if (nextIndex >= 0) setActiveIndex(nextIndex)
  }

  const cancelNavigationMenuClose = () => {
    if (closeMenuTimerRef.current === null) return
    window.clearTimeout(closeMenuTimerRef.current)
    closeMenuTimerRef.current = null
  }

  const scheduleNavigationMenuClose = () => {
    cancelNavigationMenuClose()
    closeMenuTimerRef.current = window.setTimeout(() => {
      setOpenMenu(null)
      closeMenuTimerRef.current = null
    }, 180)
  }

  const openNavigationMenu = (label: string) => {
    cancelNavigationMenuClose()
    if (openMenu !== label) setActiveMegaCategory(0)
    setOpenMenu(label)
  }

  const activateMegaMenuItem = (item: MegaMenuItem) => {
    setOpenMenu(null)
    setMobileMenuOpen(false)
    if (item.systemId) {
      selectSystem(item.systemId)
      if (!item.href) scrollToSystems()
    }
  }

  const handleAuthenticated = (session: PortalSession) => {
    ++sessionRequestRef.current
    sessionAbortRef.current?.abort()
    setPortalSession(session)
    setAuthStatus('authenticated')
    setActiveIndex(0)
    setOpenMenu(null)
    setQuery('')
  }

  const handleLogout = async () => {
    ++sessionRequestRef.current
    sessionAbortRef.current?.abort()
    await logoutPortal()
    ++sessionRequestRef.current
    sessionAbortRef.current?.abort()
    setPortalSession(null)
    setAuthStatus('anonymous')
    setOpenMenu(null)
    setAdminOpen(false)
    setActiveIndex(0)
    setQuery('')
  }

  const handlePortalConfigSave = async (nextConfig: PortalConfig) => {
    const savedConfig = await savePortalConfig(nextConfig)
    setPortalConfig(withPortalVisibilityDefaults({
      ...savedConfig,
      megaMenus: savedConfig.megaMenus ?? builtInPortalConfig.megaMenus,
    }))
  }

  return (
    <div className="app-shell">
      <header className="site-header" id="portal-navigation" aria-label="门户导航栏">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="尚毅中台首页">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="brand-name">尚毅</span>
            <span className="brand-divider" aria-hidden="true" />
            <span className="brand-subtitle">中台入口</span>
          </a>

          <nav className={cn('desktop-nav', mobileMenuOpen && 'mobile-nav-visible')} aria-label="主导航">
            {navigationItems.map((navigation) => {
              const group = navigation.megaMenuId
                ? menuGroups.find((candidate) => candidate.id === navigation.megaMenuId)
                : undefined
              const navigationName = navigation.name.trim()
              const navigationHref = navigation.href.trim()

              if (!group || navigationHref) {
                const opensNewWindow = navigationHref.startsWith('http')
                return (
                  <Button
                    key={navigation.id}
                    variant="nav"
                    className="portal-nav-link"
                    href={navigationHref || '#'}
                    target={opensNewWindow ? '_blank' : undefined}
                    rel={opensNewWindow ? 'noreferrer' : undefined}
                  >
                    {navigationName}
                  </Button>
                )
              }

              const activeCategoryIndex = group.categories[activeMegaCategory] ? activeMegaCategory : 0
              const activeCategory = group.categories[activeCategoryIndex]
              if (!activeCategory) {
                return (
                  <div
                    key={navigation.id}
                    className="nav-group"
                    onMouseEnter={() => openNavigationMenu(navigation.id)}
                    onMouseLeave={scheduleNavigationMenuClose}
                  >
                    <Button
                      variant="nav"
                      aria-expanded={openMenu === navigation.id}
                      onFocus={() => openNavigationMenu(navigation.id)}
                      onClick={() => openNavigationMenu(navigation.id)}
                    >
                      {navigationName}
                      <ChevronDown size={14} strokeWidth={1.8} />
                    </Button>
                  </div>
                )
              }
              return (
                <div
                  key={navigation.id}
                  className="nav-group"
                  onMouseEnter={() => openNavigationMenu(navigation.id)}
                  onMouseLeave={scheduleNavigationMenuClose}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setOpenMenu(null)
                  }}
                >
                  <Button
                    variant="nav"
                    aria-expanded={openMenu === navigation.id}
                    aria-haspopup="menu"
                    onFocus={() => openNavigationMenu(navigation.id)}
                    onClick={() => openNavigationMenu(navigation.id)}
                  >
                    {navigationName}
                    <ChevronDown size={14} strokeWidth={1.8} />
                  </Button>
                  {openMenu === navigation.id && (
                    <div
                      className="nav-mega-menu"
                      role="menu"
                      aria-label={`${navigationName}菜单`}
                      onMouseEnter={cancelNavigationMenuClose}
                      onMouseLeave={scheduleNavigationMenuClose}
                    >
                      <div className="mega-menu-inner">
                        <aside className="mega-menu-sidebar" aria-label={`${navigationName}分类`}>
                          <div className="mega-sidebar-heading">{navigationName}</div>
                          <div className="mega-category-list" role="tablist" aria-label={`${navigationName}分类`}>
                            {group.categories.map((category, index) => (
                              <button
                                key={category.label}
                                type="button"
                                role="tab"
                                aria-selected={index === activeCategoryIndex}
                                className={cn('mega-category-button', index === activeCategoryIndex && 'mega-category-button-active')}
                                onMouseEnter={() => setActiveMegaCategory(index)}
                                onFocus={() => setActiveMegaCategory(index)}
                                onClick={() => setActiveMegaCategory(index)}
                              >
                                <span>{category.label}</span>
                                <ArrowRight size={14} strokeWidth={1.7} />
                              </button>
                            ))}
                          </div>
                        </aside>

                        <div className="mega-menu-content">
                          <div className="mega-content-header">
                            <div>
                              {activeCategory.eyebrow.trim() && <span className="mega-content-eyebrow">{activeCategory.eyebrow}</span>}
                              <h2>{activeCategory.title}</h2>
                              <p>{activeCategory.description}</p>
                            </div>
                            <Badge>尚毅中台</Badge>
                          </div>
                          <div className="mega-content-sections">
                            {activeCategory.sections.map((section) => {
                              const visibleItems = section.items.filter((item) => !item.systemId || systems.some((system) => system.id === item.systemId))
                              if (visibleItems.length === 0) return null
                              return (
                                <section className="mega-content-section" key={section.title}>
                                  <h3>{section.title}</h3>
                                  <div className="mega-item-grid">
                                    {visibleItems.map((item) => (
                                      <MegaMenuEntry
                                        key={`${section.title}-${item.title}`}
                                        item={item}
                                        resolvedHref={item.href && item.systemId ? systemEntryHrefById(item.systemId) : undefined}
                                        onActivate={activateMegaMenuItem}
                                      />
                                    ))}
                                  </div>
                                </section>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="header-actions">
            <Button variant="ghost" className="search-trigger" aria-label="搜索系统" onClick={() => setSearchOpen((current) => !current)}>
              <Search size={17} strokeWidth={1.8} />
              <span className="desktop-only">搜索</span>
            </Button>
            {authStatus === 'checking' ? (
              <div className="portal-auth-checking" aria-label="正在检查登录状态">
                <RefreshCw size={15} />
                <span>登录状态</span>
              </div>
            ) : portalSession ? (
              <PortalUserMenu
                session={portalSession}
                defaultOpen={previewPanel === 'account'}
                hrmHref={systemEntryHrefById('hrm')}
                canManage={canManage}
                onManage={() => setAdminOpen(true)}
                onLogout={handleLogout}
              />
            ) : (
              <Button
                variant="ghost"
                className="portal-login-trigger"
                title={authStatus === 'unavailable' ? '人员中台服务暂不可用，可继续浏览门户' : undefined}
                onClick={() => setLoginOpen(true)}
              >
                <LogIn size={16} />
                <span>登录</span>
              </Button>
            )}
            <Button variant="outline" className="header-download" href="#systems">
              查看系统
            </Button>
            {activeSystemHref && (
              <Button className="header-primary" href={activeSystemHref} target="_blank" rel="noreferrer">
                进入工作台
                <ArrowRight size={15} />
              </Button>
            )}
            <Button
              variant="icon"
              className="mobile-menu-trigger"
              aria-label={mobileMenuOpen ? '关闭导航' : '打开导航'}
              onClick={() => {
                setMobileMenuOpen((current) => !current)
                setOpenMenu(null)
              }}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </Button>
          </div>
        </div>
        {searchOpen && (
          <div className="search-drawer">
            <div className="search-drawer-inner">
              <Search size={20} />
              <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索人员、招商、运营……" aria-label="搜索系统和能力" />
              <Button variant="icon" aria-label="关闭搜索" onClick={() => setSearchOpen(false)}>
                <X size={18} />
              </Button>
            </div>
          </div>
        )}
      </header>

      <PortalLoginDialog open={loginOpen} onOpenChange={setLoginOpen} onAuthenticated={handleAuthenticated} applications={permissionApplications} />
      {canManage && (
        <PortalAdminPanel
          open={adminOpen}
          onOpenChange={setAdminOpen}
          config={portalConfig}
          initialTab={initialAdminTab}
          onSave={handlePortalConfigSave}
        />
      )}

      <main id="top">
        <section id="portal-hero" className={cn('hero-section', activeSystem.tone)} onMouseLeave={() => undefined}>
          <div className="hero-background-shape hero-shape-one" />
          <div className="hero-background-shape hero-shape-two" />
          <div className="hero-grid-lines" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow-row">
                <span>统一业务入口</span>
              </div>
              <p className="hero-overline">{activeSystem.name}</p>
              <h1>
                {activeSystem.heroLead}
                <span>{activeSystem.heroAccent}</span>
              </h1>
              <p className="hero-description">{systems.length ? activeSystem.description
                : permissionUnavailable ? '暂时无法读取入口权限。门户介绍仍可浏览，请稍后重新读取权限。'
                  : portalSession ? '当前账号暂无可见的工作入口，请联系管理员确认功能授权。'
                    : publicPortal.description}</p>
              <div className="hero-actions">
                {activeSystemHref ? (
                  <Button href={activeSystemHref} target="_blank" rel="noreferrer">
                    立即进入
                    <ArrowRight size={17} />
                  </Button>
                ) : !portalSession && authStatus !== 'checking' && (
                  <Button onClick={() => setLoginOpen(true)}><LogIn size={17} /> 登录查看入口</Button>
                )}
                <Button variant="outline" onClick={scrollToSystems}>
                  查看系统矩阵
                </Button>
              </div>
              <div className="hero-meta">
                <span className="hero-status-dot" />
                <span>{authStatus === 'checking' ? '正在读取入口权限' : systems.length ? '按功能权限展示' : '门户可公开浏览'}</span>
                <span className="hero-meta-divider" />
                <span>{portalSession ? '本地示例身份' : '登录后查看工作入口'}</span>
              </div>
            </div>

            <div className="hero-visual" aria-label={`${activeSystem.name}能力示意`}>
              <div className="visual-orbit orbit-large" />
              <div className="visual-orbit orbit-medium" />
              <div className="visual-orbit orbit-small" />
              <div className="visual-core">
                <ActiveIcon size={34} strokeWidth={1.5} />
                <span>{activeSystem.shortName}</span>
              </div>
              <div className="visual-tile tile-a">
                <span className="tile-icon tile-icon-blue"><ShieldCheck size={16} /></span>
                <span>入口显示</span>
                <strong>按功能授权</strong>
              </div>
              <div className="visual-tile tile-b">
                <span className="tile-icon tile-icon-orange"><Sparkles size={16} /></span>
                <span>业务动作</span>
                <strong>可追溯</strong>
              </div>
              <div className="visual-tile tile-c">
                <span className="tile-icon tile-icon-violet"><Check size={16} /></span>
                <span>结果沉淀</span>
                <strong>可复盘</strong>
              </div>
              <div className="visual-caption">
                <span>从同一入口，进入各自的工作现场</span>
              </div>
            </div>
          </div>

          {systems.length > 0 && <div className="hero-pagination" aria-label="系统轮播切换">
            <span className="pagination-label">当前展示</span>
            {systems.map((system, index) => (
              <button
                key={system.id}
                type="button"
                className={cn('pagination-dot', index === activeIndex && 'pagination-dot-active')}
                aria-label={`切换到${system.name}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>}

          {systems.length > 0 && <div className="quick-entry-wrap">
            <div className="quick-entry-feature">
              <div className="quick-entry-mark"><LayoutGrid size={20} strokeWidth={1.7} /></div>
              <div>
                <span>业务工作台</span>
                <strong>先选系统，再开始工作</strong>
              </div>
            </div>
            <div className="quick-entry-list">
              {systems.map((system, index) => {
                const Icon = system.icon
                return (
                  <button
                    key={system.id}
                    className={cn('quick-entry-item', index === activeIndex && 'quick-entry-item-active')}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                  >
                    <Icon size={21} strokeWidth={1.65} />
                    <span>{system.shortName}</span>
                    <small>{system.label}</small>
                  </button>
                )
              })}
            </div>
          </div>}
        </section>

        <section className="section section-systems" id="systems">
          <div className="section-heading centered-heading">
            <div className="section-switcher" role="tablist" aria-label="系统矩阵">
              <span className="switcher-active">系统矩阵</span>
              {visibleFlowItems.length > 0 && <Button variant="ghost" onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })}>业务链路</Button>}
              <button type="button" onClick={() => document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' })}>服务与支持</button>
            </div>
            <h2>所有系统，从一个入口开始</h2>
            <p>这里只展示你有权限的入口，具体业务仍在对应系统中完成。</p>
          </div>

          <div className="system-toolbar">
            <strong>{filteredSystems.length} 个核心入口</strong>
            <div className="toolbar-search">
              <Search size={17} />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索系统或能力" aria-label="搜索系统或能力" />
              {query && <Button variant="icon" aria-label="清除搜索" onClick={() => setQuery('')}><X size={15} /></Button>}
            </div>
          </div>

          <div className="system-feature-grid">
            {filteredSystems.length === 0 ? (
              <Card className="empty-card">
                <CardContent>
                  <ShieldCheck size={24} />
                  <h3>{authStatus === 'checking' ? '正在读取入口权限'
                    : systems.length ? '没有找到匹配的系统'
                      : permissionUnavailable ? '暂时无法读取入口权限'
                        : portalSession ? '当前账号暂无可见入口' : '登录后查看工作入口'}</h3>
                  <p>{systems.length ? '搜索范围仅包含你有权限的系统。'
                    : permissionUnavailable ? '受限入口暂不显示，请稍后重试。'
                      : portalSession ? '请联系管理员，在人员中台授予功能查看权限，并为门户入口绑定对应权限。'
                        : '门户介绍无需登录。使用人员中台账号登录后，展示你有权限的系统和功能。'}</p>
                  {authStatus !== 'checking' && (systems.length ? (
                    <Button variant="outline" onClick={() => setQuery('')}>清除搜索</Button>
                  ) : permissionUnavailable || portalSession ? (
                    <Button variant="outline" onClick={() => refreshSessionRef.current?.()}>重新读取权限</Button>
                  ) : <Button onClick={() => setLoginOpen(true)}>登录查看入口</Button>)}
                </CardContent>
              </Card>
            ) : (
              filteredSystems.map((system) => {
                const Icon = system.icon
                const isFavorite = favorites.includes(system.id)
                return (
                  <Card key={system.id} className={cn('system-card', system.tone, system.id === activeSystem.id && 'system-card-active')}>
                    <CardHeader>
                      <div className="system-card-topline">
                        <div className="system-icon-wrap"><Icon size={27} strokeWidth={1.55} /></div>
                        <Button
                          variant="icon"
                          className={cn('favorite-button', isFavorite && 'favorite-button-active')}
                          aria-label={isFavorite ? `取消收藏${system.name}` : `收藏${system.name}`}
                          aria-pressed={isFavorite}
                          onClick={() => toggleFavorite(system.id)}
                        >
                          <Star size={17} fill={isFavorite ? 'currentColor' : 'none'} />
                        </Button>
                      </div>
                      <CardTitle>{system.name}</CardTitle>
                      {system.accountModes && (
                        <div className="system-account-row" aria-label={`${system.name}账号类型`}>
                          {system.accountModes.map((mode) => <span key={mode}>{mode}</span>)}
                        </div>
                      )}
                      <p>{system.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="capability-list">
                        {system.capabilities.map((capability) => (
                          <span key={capability}><Check size={13} />{capability}</span>
                        ))}
                      </div>
                      <div className="system-card-footer">
                        <Button href={systemEntryHref(system)} target="_blank" rel="noreferrer">
                          进入系统
                          <ArrowRight size={16} />
                        </Button>
                        <Button variant="ghost" onClick={() => { selectSystem(system.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                          查看主视觉
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </section>

        {visibleFlowItems.length > 0 && <section className="section section-workflow" id="workflow">
          <div className="section-heading centered-heading">
            <div className="section-switcher">
              <span className="switcher-active">业务链路</span>
              <span>按你的功能权限展示</span>
            </div>
            <h2>从人员到结果，业务自然向前走</h2>
            <p>人员中台负责身份与权限；招商和运营共用同一平台，按账号职责进入各自工作现场。</p>
          </div>

          <div className="workflow-rail">
            {visibleFlowItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div className="flow-step" key={item.number}>
                  <div className={cn('flow-node', item.tone)}>
                    <Icon size={24} strokeWidth={1.55} />
                  </div>
                  <span className="flow-number">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  {index < visibleFlowItems.length - 1 && <ArrowRight className="flow-arrow" size={24} strokeWidth={1.35} />}
                </div>
              )
            })}
          </div>
        </section>}

        <section className="section support-section" id="support">
          <div className="support-panel">
            <div className="support-copy">
              <h2>先登录一次，再进入工作。</h2>
              <p>门户介绍无需登录也能浏览。登录后，菜单和系统入口按人员中台的功能查看权限显示；这里不改变业务系统的数据权限。进入已接入单点登录的系统时会复用统一身份。</p>
              <div className="support-actions">
                <Button href="#systems">查看可用系统 <ArrowRight size={16} /></Button>
                <Button variant="outline" onClick={() => window.alert('请在对应系统内联系系统负责人反馈入口问题。')}>反馈入口问题</Button>
              </div>
            </div>
            <div className="support-visual" aria-hidden="true">
              <div className="support-ring ring-one" />
              <div className="support-ring ring-two" />
              <div className="support-ring ring-three" />
              <div className="support-center"><ShieldCheck size={30} strokeWidth={1.4} /><span>权限清晰</span></div>
              <div className="support-chip chip-left"><Users size={15} />人员</div>
              <div className="support-chip chip-right"><LayoutGrid size={15} />系统</div>
            </div>
          </div>
        </section>
      </main>

      <aside className="floating-tools" aria-label="快捷工具">
        <button type="button" aria-label="搜索系统" onClick={() => setSearchOpen(true)}><Search size={18} /></button>
        <button type="button" aria-label="反馈问题" onClick={() => document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' })}><MessageCircle size={18} /></button>
        <button type="button" aria-label="帮助说明" onClick={() => window.alert('进入对应系统后，请按系统内的帮助说明操作。')}><CircleHelp size={18} /></button>
      </aside>

      <footer className="site-footer">
        <div className="footer-inner">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
            <span className="brand-name">尚毅</span>
            <span className="brand-divider" aria-hidden="true" />
            <span className="brand-subtitle">中台入口</span>
          </a>
          <div className="footer-copy">统一入口 · 清晰边界 · 可追溯协同</div>
          <div className="footer-note">© 2026 尚毅中台</div>
        </div>
      </footer>
    </div>
  )
}

export default App
