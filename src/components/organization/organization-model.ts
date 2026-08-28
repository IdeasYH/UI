import { filterPeople } from '../person-picker/person-search.ts'
import type { EmploymentStatus, Organization, OrganizationPerson } from '../../data/demo-organization'

export function organizationPath(organizations: readonly Organization[], id: string): Organization[] {
  const path: Organization[] = []
  const seen = new Set<string>()
  let current = organizations.find((organization) => organization.id === id)
  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    path.unshift(current)
    current = organizations.find((organization) => organization.id === current?.parentId)
  }
  return path
}

export function descendantIds(organizations: readonly Organization[], id: string): Set<string> {
  const result = new Set<string>()
  const visit = (currentId: string) => {
    if (result.has(currentId)) return
    result.add(currentId)
    organizations.filter((organization) => organization.parentId === currentId).forEach((child) => visit(child.id))
  }
  if (organizations.some((organization) => organization.id === id)) visit(id)
  return result
}

export function organizationMembers(
  organizations: readonly Organization[], people: readonly OrganizationPerson[],
  id: string, status: EmploymentStatus, query = '', includeDescendants = true,
): readonly OrganizationPerson[] {
  const ids = includeDescendants ? descendantIds(organizations, id) : new Set([id])
  const scoped = people.filter((person) => person.status === status && ids.has(person.organizationId))
  const matches = new Set(filterPeople(scoped, query).map((person) => person.personId))
  return scoped.filter((person) => matches.has(person.personId))
}

export function organizationCounts(organizations: readonly Organization[], people: readonly OrganizationPerson[], status: EmploymentStatus): Map<string, number> {
  return new Map(organizations.map((organization) => [organization.id, organizationMembers(organizations, people, organization.id, status).length]))
}

export function visibleOrganizationIds(organizations: readonly Organization[], rootId: string, collapsed: ReadonlySet<string>, maxDepth = Infinity): Set<string> {
  const visible = new Set<string>()
  const visit = (id: string, depth: number) => {
    if (visible.has(id)) return
    visible.add(id)
    if (collapsed.has(id) || depth >= maxDepth) return
    organizations.filter((organization) => organization.parentId === id).forEach((child) => visit(child.id, depth + 1))
  }
  if (organizations.some((organization) => organization.id === rootId)) visit(rootId, 0)
  return visible
}

type Point = { x: number; y: number }

// Nodes are laid out by normal document flow; these paths only join their measured edges.
export function organizationConnector(from: Point, to: Point, direction: 'vertical' | 'horizontal'): string {
  if (direction === 'horizontal') {
    if (Math.abs(to.y - from.y) < 1) return `M ${from.x} ${from.y} H ${to.x}`
    const middle = (from.x + to.x) / 2
    const sign = Math.sign(to.y - from.y)
    const radius = Math.min(7, Math.abs(to.y - from.y) / 2, Math.abs(to.x - from.x) / 4)
    return `M ${from.x} ${from.y} H ${middle - radius} Q ${middle} ${from.y} ${middle} ${from.y + sign * radius} V ${to.y - sign * radius} Q ${middle} ${to.y} ${middle + radius} ${to.y} H ${to.x}`
  }
  if (Math.abs(to.x - from.x) < 1) return `M ${from.x} ${from.y} V ${to.y}`
  const middle = (from.y + to.y) / 2
  const sign = Math.sign(to.x - from.x)
  const radius = Math.min(7, Math.abs(to.x - from.x) / 2, Math.abs(to.y - from.y) / 4)
  return `M ${from.x} ${from.y} V ${middle - radius} Q ${from.x} ${middle} ${from.x + sign * radius} ${middle} H ${to.x - sign * radius} Q ${to.x} ${middle} ${to.x} ${middle + radius} V ${to.y}`
}
