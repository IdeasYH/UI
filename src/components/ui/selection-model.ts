export type SelectOption = { value: string; label: string; pinyin?: string; initials?: string }
export type SelectionNode = SelectOption & { children?: readonly SelectionNode[] }

export function filterOptions(options: readonly SelectOption[], query: string) {
  const keyword = query.trim().toLowerCase()
  return options.filter(option => [option.label, option.pinyin, option.initials].some(text => text?.toLowerCase().includes(keyword)))
}

// 只存叶子选择；父节点状态由后代推导，避免父子勾选状态不一致。
export function leafIds(node: SelectionNode): string[] {
  return node.children?.length ? node.children.flatMap(leafIds) : [node.value]
}

export function selectionState(node: SelectionNode, selected: readonly string[]) {
  const ids = leafIds(node)
  const count = ids.filter(id => selected.includes(id)).length
  return count === ids.length ? 'all' : count ? 'mixed' : 'none'
}

export function toggleBranch(node: SelectionNode, selected: readonly string[]) {
  const ids = leafIds(node)
  return selectionState(node, selected) === 'all' ? selected.filter(id => !ids.includes(id)) : [...new Set([...selected, ...ids])]
}
