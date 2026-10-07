import { useEffect } from 'react'

export function usePageScrollShortcuts() {
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="dialog"], dialog') || document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]')) return
      const key = event.key.toLowerCase()
      if (key !== 'z' && key !== 'c') return
      event.preventDefault()
      window.scrollTo({ top: key === 'z' ? 0 : document.documentElement.scrollHeight, behavior: 'instant' })
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [])
}
