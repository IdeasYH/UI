import { useMemo, useRef, useState } from 'react'
import { Check, ChevronsUpDown, Search, UserRound, X } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'
import { filterPeople } from './person-search'
import type { PersonPickerProps } from './types'
import './person-picker.css'

export function PersonPicker({
  id, assignees, value, onValueChange, disabled = false, shopLabel = '',
  compact = false, subjectLabel = '运营人员', emptyLabel, unavailableValueLabel,
}: PersonPickerProps) {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const selected = assignees.find((person) => person.personId === value) ?? null
  // Keep historical display separate from the active, selectable roster.
  const selectedLabel = selected?.displayName || (value ? unavailableValueLabel : undefined)
  const filtered = useMemo(() => filterPeople(assignees, query), [assignees, query])

  return <DropdownMenu onOpenChange={(open) => { if (open) setQuery('') }}>
    <DropdownMenuTrigger
      id={id}
      variant="outline"
      disabled={disabled}
      aria-haspopup="dialog"
      aria-label={`${shopLabel}${subjectLabel}`}
      title={selected ? `${selected.displayName} · ${selected.employeeNumber || '无工号'}` : selectedLabel || `选择${subjectLabel}`}
      className={cn('person-picker-trigger', compact && 'person-picker-trigger-compact')}
    >
      <span>{selectedLabel || emptyLabel || (compact ? '选择运营' : `选择${subjectLabel}`)}</span>
      <ChevronsUpDown size=".85em" aria-hidden />
    </DropdownMenuTrigger>

    <DropdownMenuContent
      role="dialog"
      aria-label={`${shopLabel}选择${subjectLabel}`}
      initialFocusRef={searchRef}
      className="person-picker-content"
    >
      <div className="person-picker-heading">
        <span className="person-picker-heading-icon" aria-hidden><UserRound size="1em" /></span>
        <span className="person-picker-heading-copy">
          <strong>选择{subjectLabel}</strong>
          <small>当前在职 {assignees.length} 人</small>
        </span>
      </div>

      <div className="person-picker-search-shell">
        <Search aria-hidden size="1em" />
        <Input
          ref={searchRef}
          type="search"
          aria-label={`搜索${subjectLabel}`}
          autoComplete="off"
          placeholder="姓名 / 拼音 / 首字母 / 工号"
          value={query}
          className="person-picker-search"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return
            const first = resultsRef.current?.querySelector<HTMLButtonElement>("[role='option']")
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              first?.focus()
            }
            if (event.key === 'Enter' && first) {
              event.preventDefault()
              first.click()
            }
          }}
        />
      </div>

      <DropdownMenuLabel className="person-picker-result-label">
        <span>可选人员</span><span aria-live="polite">{filtered.length} 项</span>
      </DropdownMenuLabel>
      <div ref={resultsRef} role="listbox" aria-label={`${subjectLabel}可选项`} className="person-picker-results">
        {filtered.length > 0 ? filtered.map((person) => {
          const isSelected = person.personId === value
          return <DropdownMenuItem
            key={person.personId}
            role="option"
            aria-selected={isSelected}
            aria-label={`${person.displayName} · ${person.employeeNumber || '无工号'}`}
            className={cn('person-picker-option', isSelected && 'person-picker-option-selected')}
            onSelect={() => onValueChange(person.personId)}
          >
            <span aria-hidden className="person-picker-avatar">{person.displayName.slice(0, 1)}</span>
            <span className="person-picker-option-copy">
              <strong>{person.displayName}</strong>
              <small>{person.employeeNumber || '无工号'} · {person.organizationName || '未标注组织'}</small>
            </span>
            {isSelected && <Check aria-hidden size="1em" className="person-picker-check" />}
          </DropdownMenuItem>
        }) : <div className="person-picker-empty" role="status">没有匹配的{subjectLabel}</div>}
      </div>

      {value && <>
        <DropdownMenuSeparator />
        <DropdownMenuItem aria-label={`清除${subjectLabel}选择`} className="person-picker-clear" onSelect={() => onValueChange('')}>
          <X size="1em" aria-hidden /><span>清除选择</span>
        </DropdownMenuItem>
      </>}
    </DropdownMenuContent>
  </DropdownMenu>
}
