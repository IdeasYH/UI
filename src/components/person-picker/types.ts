export type PersonOption = {
  personId: string
  displayName: string
  employeeNumber: string | null
  organizationName: string | null
  accountLoginName: string | null
  namePinyin: string | null
  nameInitials: string | null
}

export type PersonPickerProps = {
  id?: string
  assignees: readonly PersonOption[]
  value: string
  onValueChange: (personId: string) => void
  disabled?: boolean
  shopLabel?: string
  compact?: boolean
  subjectLabel?: string
  emptyLabel?: string
  unavailableValueLabel?: string
}
