import { reactBitsFavorites } from './react-bits-favorites.ts'
import { uiverseFavorites } from './uiverse-favorites.ts'

/** 复用包是显式白名单；网页、静态下载和隔离编译共同使用，禁止接受任意文件路径。 */
type ReferenceEntry = {
  title: string
  document: string
  example: string
  exportName: string
  files: readonly string[]
  dependencies?: readonly string[]
}

export const componentReferences: Record<string, ReferenceEntry> = {
  'swatch-color-picker': {
    title: '固定色板中的单值选择',
    document: 'docs/components/swatch-color-picker.md',
    example: 'src/examples/swatch-color-picker-example.tsx',
    exportName: 'SwatchColorPickerExample',
    files: ['src/components/ui/swatch-color-picker.tsx', 'src/components/ui/swatch-color-picker.css'],
    dependencies: ['react', 'react-dom'],
  },
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
  'segmented-control': {
    title: '少量互斥选项切换同一区域',
    document: 'docs/components/segmented-control.md',
    example: 'src/examples/segmented-control-example.tsx',
    exportName: 'SegmentedControlExample',
    files: ['src/components/ui/segmented-control.tsx', 'src/components/ui/segmented-control.css'],
  },
  'collapse-panel': {
    title: '标题与详情的单项展开',
    document: 'docs/components/collapse-panel.md',
    example: 'src/examples/collapse-panel-example.tsx',
    exportName: 'CollapsePanelExample',
    files: ['src/components/ui/collapse-panel.tsx', 'src/components/ui/collapse-panel.css'],
  },
  timeline: {
    title: '按顺序展示里程碑和已完成状态',
    document: 'docs/components/timeline.md',
    example: 'src/examples/timeline-example.tsx',
    exportName: 'TimelineExample',
    files: ['src/components/ui/timeline.tsx', 'src/components/ui/timeline.css'],
  },
  'flex-carousel': {
    title: 'React Bits 图片画廊',
    document: 'docs/components/flex-carousel.md',
    example: 'src/examples/flex-carousel-example.tsx',
    exportName: 'FlexCarouselExample',
    files: ['src/components/react-bits/FlexCarousel.jsx', 'src/components/react-bits/FlexCarousel.css', 'src/components/react-bits/FlexCarousel.d.ts'],
    dependencies: ['react', 'react-dom', 'ogl'],
  },
  'peek-rating': {
    title: 'React Bits 悬停反馈评分',
    document: 'docs/components/peek-rating.md',
    example: 'src/examples/peek-rating-example.tsx',
    exportName: 'PeekRatingExample',
    files: ['src/components/react-bits/PeekRating.jsx', 'src/components/react-bits/PeekRating.css', 'src/components/react-bits/PeekRating.d.ts'],
    dependencies: ['react', 'react-dom', '@hugeicons/react', '@hugeicons/core-free-icons'],
  },
  ...Object.fromEntries(uiverseFavorites.map(item => [item.id, {
    title: `Uiverse ${item.name}`,
    document: `docs/components/${item.id}.md`,
    example: `src/examples/${item.id}-example.tsx`,
    exportName: item.exampleExport,
    files: 'rawSlug' in item
      ? [
          `src/components/uiverse/${item.fileStem}.tsx`, 'src/components/uiverse/original-frame.tsx',
          `public/uiverse-originals/${item.rawSlug}.source.html`, `public/uiverse-originals/${item.rawSlug}.css`,
          `public/uiverse-originals/${item.rawSlug}.preview.html`,
          ...(['Praashoo7--smooth-crab-52', 'chase2k25--mighty-dragonfly-75'].includes(item.rawSlug) ? [`public/uiverse-originals/${item.rawSlug}.override.css`] : []),
          ...(['ayman-ashine--wicked-liger-39', 'Cybercom682--jolly-liger-24', 'hoshikawamaki--pretty-panther-5'].includes(item.rawSlug) ? [`public/uiverse-originals/${item.rawSlug}.adapter.css`] : []),
          'docs/components/uiverse-license.md', 'docs/UIVERSE-SOURCE-SNAPSHOT.json',
        ]
      : [`src/components/uiverse/${item.fileStem}.tsx`, `src/components/uiverse/${item.fileStem}.css`, 'docs/components/uiverse-license.md'],
    dependencies: ['react', 'react-dom'],
  }])),
  ...Object.fromEntries(reactBitsFavorites.map(item => [item.id, {
    title: `React Bits ${item.symbol} · ${item.name}`,
    document: `docs/components/${item.id}.md`,
    example: `src/examples/${item.id}-example.tsx`,
    exportName: `${item.symbol}Example`,
    files: [`src/components/react-bits/${item.symbol}.jsx`, `src/components/react-bits/${item.symbol}.css`, `src/components/react-bits/${item.symbol}.d.ts`],
    dependencies: ['react', 'react-dom', ...item.dependencies],
  }])),
}

export type ComponentReference = ReferenceEntry
export function getComponentReference(id: string): ComponentReference | undefined {
  return Object.hasOwn(componentReferences, id) ? componentReferences[id] : undefined
}

/** 结构词可用于发现候选，例子永远不是适用业务的穷举清单。 */
export const interactionKeywords: Record<string, readonly string[]> = {
  'swatch-color-picker': ['颜色', '选色', '固定色板', '预设色', '悬停', '单值', '即时选择'],
  'search-select': ['单值', '互斥', '候选项', '搜索', '即时筛选', '本地列表'],
  'date-range': ['连续区间', '时间范围', '日期筛选', '草稿', '确认', '浏览月份'],
  'prerequisite-action': ['前置条件', '依赖', '全部满足', '操作门槛', '条件提示'],
  'segmented-control': ['单值', '互斥', '少量选项', '切换内容', '周期'],
  'collapse-panel': ['折叠', '展开', '收起', '详情', '问答', '同一时刻一项'],
  timeline: ['顺序', '里程碑', '历史', '进度', '事件'],
  'flex-carousel': ['图片', '画廊', '轮播', '展示', 'WebGL'],
  'peek-rating': ['评分', '悬停', '动效', '整数星级', '清除'],
  ...Object.fromEntries(uiverseFavorites.map(item => [item.id, item.keywords])),
  ...Object.fromEntries(reactBitsFavorites.map(item => [item.id, item.keywords])),
  'cascader': ['层级路径', '上下级', '逐级', '单条路径'],
  'tree-select': ['多选', '层级', '父子联动', '部分选中'],
  'switch': ['布尔', '即时生效', '开启', '关闭'],
  'rating': ['评分', '预览', '确认', '半星'],
  'radio-cards': ['互斥', '单值', '平铺'],
  'checkbox-cards': ['多选', '集合', '全选', '部分选中'],
}
