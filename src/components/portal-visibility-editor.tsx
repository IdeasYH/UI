import { useState } from 'react'
import { Check, ChevronDown, ShieldCheck, X } from 'lucide-react'
import type { PortalPermissionResource } from '../lib/portal-auth'
import type { PortalVisibilityRule } from '../lib/portal-content-contract'
import { Button } from './ui/button'
import { Input } from './ui/input'

type PortalVisibilityEditorProps = {
  label: string
  value?: PortalVisibilityRule
  onChange: (value: PortalVisibilityRule) => void
  resources: PortalPermissionResource[]
  inheritDescription?: string
}

export function PortalVisibilityEditor({ label, value, onChange, resources, inheritDescription }: PortalVisibilityEditorProps) {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const rule = value ?? { mode: inheritDescription ? 'inherit' : 'admin' }
  const modes = [
    ...(inheritDescription ? [{ mode: 'inherit' as const, label: '随内容显示' }] : []),
    { mode: 'permission' as const, label: '按人员中台权限' },
    { mode: 'admin' as const, label: '仅管理员' },
    { mode: 'public' as const, label: '公开显示' },
  ]
  const selectedCodes = rule.mode === 'permission' ? rule.resourceCodes : []
  const search = query.trim().toLowerCase()
  const matches = resources.filter((resource) => `${resource.applicationName} ${resource.name} ${resource.code}`.toLowerCase().includes(search))
  const summary = rule.mode === 'permission' ? `按权限 · ${selectedCodes.length} 项`
    : modes.find((mode) => mode.mode === rule.mode)?.label ?? '随内容显示'
  const toggleResource = (code: string) => onChange({
    mode: 'permission',
    resourceCodes: selectedCodes.includes(code) ? selectedCodes.filter((item) => item !== code) : [...selectedCodes, code],
  })

  return (
    <div className="portal-visibility-editor" role="group" aria-label={`${label}显示权限`}>
      <Button variant="ghost" className="portal-visibility-trigger" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
        <ShieldCheck size={14} /> 显示权限：{summary} <ChevronDown size={13} />
      </Button>
      {expanded && (
        <div className="portal-visibility-body">
          <div className="portal-visibility-modes" role="radiogroup" aria-label="显示方式">
            {modes.map((option) => (
              <Button key={option.mode} variant={rule.mode === option.mode ? 'outline' : 'ghost'} role="radio"
                aria-checked={rule.mode === option.mode}
                onClick={() => {
                  if (rule.mode !== option.mode) onChange(option.mode === 'permission' ? { mode: 'permission', resourceCodes: [] } : { mode: option.mode })
                }}>
                {option.label}
              </Button>
            ))}
          </div>
          {rule.mode === 'inherit' && <p>{inheritDescription}</p>}
          {rule.mode === 'admin' && <p>普通账号和未登录访问者不显示此内容；可在绑定功能权限后开放。</p>}
          {rule.mode === 'public' && <p>无需登录也可见，适合帮助说明。关联系统和上级内容仍须可见。</p>}
          {rule.mode === 'permission' && (
            <>
              <p>拥有下列任意一项的“查看”权限即可显示。这里不配置数据范围。</p>
              <div className="portal-visibility-selected">
                {selectedCodes.map((code) => (
                  <Button variant="outline" key={code} title={code} onClick={() => toggleResource(code)}
                    aria-label={`移除权限 ${resources.find((resource) => resource.code === code)?.name ?? code}`}>
                    {resources.find((resource) => resource.code === code)?.name ?? code}<X size={12} />
                  </Button>
                ))}
              </div>
              {selectedCodes.length === 0 && <p className="portal-visibility-required">请选择至少一项权限后保存。</p>}
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索系统或功能名称" aria-label="搜索功能权限" />
              <div className="portal-visibility-resources" aria-label="可选功能权限">
                {matches.slice(0, 50).map((resource) => (
                  <Button key={resource.code} variant="ghost" role="checkbox" aria-checked={selectedCodes.includes(resource.code)}
                    disabled={selectedCodes.length >= 50 && !selectedCodes.includes(resource.code)} title={resource.code}
                    onClick={() => toggleResource(resource.code)}>
                    <span className="portal-visibility-check">{selectedCodes.includes(resource.code) && <Check size={12} />}</span>
                    <span>{resource.name}<small>{resource.applicationName}</small></span>
                  </Button>
                ))}
                {matches.length === 0 && <p>{resources.length ? '没有匹配的功能权限。' : '功能权限目录未加载，请在面板顶部重试。'}</p>}
              </div>
              {matches.length > 50 && <small>仅展示前 50 项，请输入名称缩小范围。</small>}
            </>
          )}
        </div>
      )}
    </div>
  )
}
