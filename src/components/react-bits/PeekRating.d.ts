import type { ReactElement, ReactNode } from 'react'

export type PeekRatingProps = {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  onPreview?: (value: number | null) => void
  count?: number
  shape?: 'star' | 'heart' | 'bolt'
  icon?: ReactNode
  labels?: string[]
  activeColor?: string
  idleColor?: string
  tipColor?: string
  tipTextColor?: string
  size?: number
  lift?: number
  magnify?: number
  riseDuration?: number
  popScale?: number
  showTip?: boolean
  allowClear?: boolean
  readOnly?: boolean
  disabled?: boolean
  ariaLabel?: string
  className?: string
}
export default function PeekRating(props: PeekRatingProps): ReactElement
