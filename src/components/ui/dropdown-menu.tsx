import * as React from 'react'
import { createPortal } from 'react-dom'
import { Button, type ButtonProps } from './button'
import { cn } from '../../lib/utils'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  contentId: string
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error('DropdownMenu components must be used inside DropdownMenu')
  return context
}

export function DropdownMenu({ children, onOpenChange }: {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpenState] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const contentId = React.useId()
  const setOpen = React.useCallback((next: boolean) => {
    setOpenState(next)
    onOpenChange?.(next)
  }, [onOpenChange])

  return <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef, contentRef, contentId }}>
    {children}
  </DropdownMenuContext.Provider>
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, onKeyDown, ...props }, forwardedRef) => {
    const { open, setOpen, triggerRef, contentId } = useDropdownMenu()
    return <Button
      ref={(node) => {
        triggerRef.current = node
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      }}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setOpen(!open)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
          event.preventDefault()
          setOpen(true)
        }
      }}
      {...props}
    />
  },
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  initialFocusRef?: React.RefObject<HTMLElement | null>
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, children, initialFocusRef, onKeyDown, ...props }, forwardedRef) => {
    const { open, setOpen, triggerRef, contentRef, contentId } = useDropdownMenu()
    const [position, setPosition] = React.useState({ top: 0, left: 0, side: 'bottom' as 'top' | 'bottom', maxHeight: 0 })

    const updatePosition = React.useCallback(() => {
      const trigger = triggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const rootSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16
      const estimatedHeight = Math.min(window.innerHeight * 0.58, rootSize * 30)
      const contentWidth = contentRef.current?.getBoundingClientRect().width
        ?? Math.min(rootSize * 20, window.innerWidth - rootSize * 2)
      const below = window.innerHeight - rect.bottom
      const side = below < estimatedHeight && rect.top > below ? 'top' : 'bottom'
      setPosition({
        top: side === 'top' ? rect.top : rect.bottom,
        // Right-aligned portal: clamp its right edge to keep narrow screens usable.
        left: Math.min(Math.max(rect.right, rootSize + contentWidth), window.innerWidth - rootSize),
        side,
        maxHeight: Math.max(rootSize * 3, (side === 'top' ? rect.top : below) - rootSize * 1.5),
      })
    }, [contentRef, triggerRef])

    React.useLayoutEffect(() => {
      if (!open) return
      updatePosition()
      const frame = window.requestAnimationFrame(() => {
        const target = initialFocusRef?.current
          ?? contentRef.current?.querySelector<HTMLElement>("[role^='menuitem'], [role='option']")
        target?.focus()
      })
      return () => window.cancelAnimationFrame(frame)
    }, [contentRef, initialFocusRef, open, updatePosition])

    React.useEffect(() => {
      if (!open) return
      const closeFromOutside = (event: Event) => {
        const target = event.target as Node
        if (!contentRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false)
      }
      const closeFromEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          setOpen(false)
          triggerRef.current?.focus()
        }
      }
      window.addEventListener('pointerdown', closeFromOutside, true)
      window.addEventListener('focusin', closeFromOutside)
      window.addEventListener('keydown', closeFromEscape)
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
      return () => {
        window.removeEventListener('pointerdown', closeFromOutside, true)
        window.removeEventListener('focusin', closeFromOutside)
        window.removeEventListener('keydown', closeFromEscape)
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }, [contentRef, open, setOpen, triggerRef, updatePosition])

    const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || event.target instanceof HTMLInputElement) return
      const selector = event.target instanceof HTMLElement && event.target.getAttribute('role') === 'option'
        ? "[role='option']:not(:disabled)"
        : "[role^='menuitem']:not(:disabled)"
      const items = Array.from(contentRef.current?.querySelectorAll<HTMLButtonElement>(selector) ?? [])
      const currentIndex = items.findIndex((item) => item === document.activeElement)
      if (currentIndex < 0) return
      let nextIndex = currentIndex
      if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length
      else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length
      else if (event.key === 'Home') nextIndex = 0
      else if (event.key === 'End') nextIndex = items.length - 1
      else return
      event.preventDefault()
      items[nextIndex]?.focus()
    }

    if (!open || typeof document === 'undefined') return null
    return createPortal(
      <div
        ref={(node) => {
          contentRef.current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef) forwardedRef.current = node
        }}
        id={contentId}
        role="menu"
        data-side={position.side}
        style={{ top: position.top, left: position.left, maxHeight: position.maxHeight || undefined }}
        className={cn('ui-dropdown-content', className)}
        onKeyDown={moveFocus}
        {...props}
      >
        {children}
      </div>,
      document.body,
    )
  },
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

export function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('ui-dropdown-label', className)} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('ui-dropdown-separator', className)} {...props} />
}

export interface DropdownMenuItemProps extends Omit<ButtonProps, 'onSelect'> {
  onSelect?: () => void
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, onSelect, onClick, onKeyDown, children, ...props }, ref) => {
    const { setOpen, triggerRef } = useDropdownMenu()
    return <Button
      ref={ref}
      type="button"
      variant="ghost"
      role="menuitem"
      className={cn('ui-dropdown-item', className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          onSelect?.()
          setOpen(false)
          triggerRef.current?.focus()
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented && (event.key === 'Enter' || event.key === ' ')) {
          // Keep activation explicit for both menuitem and listbox option roles.
          event.preventDefault()
          event.currentTarget.click()
        }
      }}
      {...props}
    >
      {children}
    </Button>
  },
)
DropdownMenuItem.displayName = 'DropdownMenuItem'
