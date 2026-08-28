import type { PersonOption } from './types'

export function normalizePersonSearch(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/[\s._-]+/g, '')
}

// Use the roster's authoritative spelling, including polyphonic surnames.
export function filterPeople(people: readonly PersonOption[], query: string): readonly PersonOption[] {
  const keyword = normalizePersonSearch(query)
  if (!keyword) return people
  return people.filter((person) => [
    person.displayName,
    person.employeeNumber,
    person.accountLoginName,
    person.namePinyin,
    person.nameInitials,
  ].some((candidate) => normalizePersonSearch(candidate).includes(keyword)))
}
