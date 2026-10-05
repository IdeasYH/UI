import type { CSSProperties, ReactElement } from 'react'

export type FlexCarouselItem = { src: string; alt: string; title: string; subtitle?: string }
export type FlexCarouselProps = {
  items?: FlexCarouselItem[]
  preset?: string
  intro?: string
  cardHeight?: number
  gap?: number
  radius?: number
  fit?: string
  lensWidth?: number
  lensHeight?: number
  tilt?: number
  roundness?: number
  bend?: number
  reach?: number
  curl?: string
  dispersion?: number
  liquid?: number
  followCursor?: boolean
  squeeze?: number
  focusOnClick?: boolean
  autoplay?: boolean
  interval?: number
  captions?: boolean
  captureWheel?: boolean
  onChange?: (index: number, item: FlexCarouselItem) => void
  onSelect?: (index: number, item: FlexCarouselItem) => void
  className?: string
  style?: CSSProperties
}
export default function FlexCarousel(props: FlexCarouselProps): ReactElement
