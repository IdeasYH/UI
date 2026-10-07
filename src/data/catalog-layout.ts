/** Preview widths describe presentation requirements, not business semantics. */
const wide = new Set(['prerequisite-action', 'feishu-field-config', 'feishu-condition-filter', 'table', 'table-crosshair-highlight', 'flex-carousel', 'uiverse-auth-split-form', 'uiverse-stacked-contact-form', 'card-nav', 'flowing-menu', 'infinite-menu', 'scroll-stack', 'scroll-reveal', 'chroma-grid', 'masonry'])
const small = /switch|toggle|button|spinner|loader|tooltip|rating|badge|pill|copy|bookmark|logout|delete|swatch|color-picker|toast|banner|drawer|cursor/
export function catalogSize(component: { id: string; kind: string }) {
  if (wide.has(component.id) || component.kind === '业务组件') return 'wide'
  return small.test(component.id) || component.kind === '页面组合' ? 'small' : 'medium'
}
