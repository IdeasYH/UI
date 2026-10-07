import type { FilterField } from './condition-filter-model'

export type ConfigurableField = FilterField & { visible: boolean; locked?: boolean; group?: string }
export function setFieldVisible(fields: readonly ConfigurableField[], id: string, visible: boolean): ConfigurableField[] {
  return fields.map(field => field.id === id && !field.locked ? { ...field, visible } : field)
}
/** Reorder only within the same group; a locked identity column keeps its position. */
export function moveField(fields: readonly ConfigurableField[], id: string, targetId: string): ConfigurableField[] {
  const source = fields.findIndex(field => field.id === id)
  const target = fields.findIndex(field => field.id === targetId)
  if (source < 0 || target < 0 || fields[source].locked || fields[target].locked || fields[source].group !== fields[target].group) return [...fields]
  const result = [...fields]
  const [field] = result.splice(source, 1)
  result.splice(target, 0, field)
  return result
}

export function insertField(fields: readonly ConfigurableField[], id: string, targetId: string, edge: 'before' | 'after'): ConfigurableField[] {
  const source = fields.findIndex(field => field.id === id)
  const target = fields.findIndex(field => field.id === targetId)
  if (source < 0 || target < 0 || source === target || fields[source].locked || fields[target].locked || fields[source].group !== fields[target].group) return [...fields]
  if (fields.slice(Math.min(source, target), Math.max(source, target) + 1).some(field => field.locked)) return [...fields]
  const result = fields.filter(field => field.id !== id)
  const position = result.findIndex(field => field.id === targetId) + (edge === 'after' ? 1 : 0)
  result.splice(position, 0, fields[source])
  return result
}
