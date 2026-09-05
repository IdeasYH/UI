import { normalizePersonSearch } from '../person-picker/person-search.ts'

const pinyinOrder = new Intl.Collator('zh-CN-u-co-pinyin')
const boundaries = [...'阿八嚓哒妸发旮哈讥咔垃妈拿噢啪期然撒塌挖昔压匝']
const initials = 'abcdefghjklmnopqrstwxyz'

// Native pinyin collation avoids a new dependency. Polyphonic names use the
// runtime's default reading; this is a search aid, never an organization ID.
export function matchesOrganization(name: string, query: string): boolean {
  const keyword = normalizePersonSearch(query)
  if (normalizePersonSearch(name).includes(keyword)) return true
  const abbreviation = [...name].map((character) => {
    if (!/[\u4e00-\u9fff]/.test(character)) return character
    let index = boundaries.length - 1
    while (index >= 0 && pinyinOrder.compare(character, boundaries[index]) < 0) index--
    return index < 0 ? character : initials[index]
  }).join('')
  return normalizePersonSearch(abbreviation).includes(keyword)
}
