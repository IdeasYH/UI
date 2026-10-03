/** 复用包是显式白名单；网页、静态下载和隔离编译共同使用，禁止接受任意文件路径。 */
export const componentReferences = {
  'search-select': {
    title: '可搜索单值选择',
    document: 'docs/components/search-select.md',
    example: 'src/examples/search-select-example.tsx',
    exportName: 'SearchSelectExample',
    files: ['src/components/ui/selection-controls.tsx', 'src/components/ui/selection-model.ts', 'src/components/ui/selection-controls.css', 'src/components/ui/tri-state-checkbox.tsx', 'src/components/ui/tri-state-checkbox.css'],
  },
  'date-range': {
    title: '连续日期区间',
    document: 'docs/components/date-range.md',
    example: 'src/examples/date-range-example.tsx',
    exportName: 'DateRangeExample',
    files: ['src/components/ui/date-range-picker.tsx', 'src/components/ui/date-range-model.ts', 'src/components/ui/date-range-picker.css', 'src/components/ui/portable-button.tsx', 'src/components/ui/portable-button.css'],
  },
  'prerequisite-action': {
    title: '条件满足后执行动作',
    document: 'docs/components/prerequisite-action.md',
    example: 'src/examples/prerequisite-action-example.tsx',
    exportName: 'PrerequisiteActionExample',
    files: ['src/components/ui/prerequisite-action.tsx', 'src/components/ui/prerequisite-action.css', 'src/components/ui/portable-button.tsx', 'src/components/ui/portable-button.css'],
  },
} as const

export type ReferenceId = keyof typeof componentReferences
export type ComponentReference = typeof componentReferences[ReferenceId]
export function getComponentReference(id: string): ComponentReference | undefined {
  return Object.hasOwn(componentReferences, id) ? componentReferences[id as ReferenceId] : undefined
}

/** 结构词可用于发现候选，例子永远不是适用业务的穷举清单。 */
export const interactionKeywords: Record<string, readonly string[]> = {
  'search-select': ['单值', '互斥', '候选项', '搜索', '即时筛选', '本地列表'],
  'date-range': ['连续区间', '时间范围', '日期筛选', '草稿', '确认', '浏览月份'],
  'prerequisite-action': ['前置条件', '依赖', '全部满足', '操作门槛', '条件提示'],
  'cascader': ['层级路径', '上下级', '逐级', '单条路径'],
  'tree-select': ['多选', '层级', '父子联动', '部分选中'],
  'switch': ['布尔', '即时生效', '开启', '关闭'],
  'rating': ['评分', '预览', '确认', '半星'],
  'radio-cards': ['互斥', '单值', '平铺'],
  'checkbox-cards': ['多选', '集合', '全选', '部分选中'],
}
