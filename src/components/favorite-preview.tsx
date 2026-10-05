import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react'
import { reactBitsFavoriteIds } from '../data/react-bits-favorites'
import { uiverseFavoriteIds } from '../data/uiverse-favorites'

const modules: Record<string, () => Promise<{ default: ComponentType }>> = {
  'uiverse-glass-music-card': () => import('../examples/uiverse-glass-music-card-example'),
  'uiverse-phone-theme-switch': () => import('../examples/uiverse-phone-theme-switch-example'),
  'uiverse-starry-planet-card': () => import('../examples/uiverse-starry-planet-card-example'),
  'uiverse-purple-depth-card': () => import('../examples/uiverse-purple-depth-card-example'),
  'uiverse-rotating-border-card': () => import('../examples/uiverse-rotating-border-card-example'),
  'uiverse-expanding-file-folder': () => import('../examples/uiverse-expanding-file-folder-example'),
  'uiverse-social-bounce-dock': () => import('../examples/uiverse-social-bounce-dock-example'),
  'uiverse-glass-document-folder': () => import('../examples/uiverse-glass-document-folder-example'),
  'uiverse-vertical-status-stepper': () => import('../examples/uiverse-vertical-status-stepper-example'),
  'uiverse-expanding-vinyl-player': () => import('../examples/uiverse-expanding-vinyl-player-example'),
  'uiverse-ios-settings-panel': () => import('../examples/uiverse-ios-settings-panel-example'),
  'uiverse-portrait-reveal-card': () => import('../examples/uiverse-portrait-reveal-card-example'),
  'uiverse-sun-moon-pill-switch': () => import('../examples/uiverse-sun-moon-pill-switch-example'),
  'uiverse-social-glass-grid': () => import('../examples/uiverse-social-glass-grid-example'),
  'uiverse-flying-send-button': () => import('../examples/uiverse-flying-send-button-example'),
  'uiverse-neon-grid-search': () => import('../examples/uiverse-neon-grid-search-example'),
  'uiverse-grid-notification-stack': () => import('../examples/uiverse-grid-notification-stack-example'),
  'uiverse-orbit-dot-spinner': () => import('../examples/uiverse-orbit-dot-spinner-example'),
  'uiverse-day-night-theme-switch': () => import('../examples/uiverse-day-night-theme-switch-example'),
  'uiverse-horizontal-social-tooltips': () => import('../examples/uiverse-horizontal-social-tooltips-example'),
  'uiverse-stacked-contact-form': () => import('../examples/uiverse-stacked-contact-form-example'),
  'uiverse-google-color-bars-loader': () => import('../examples/uiverse-google-color-bars-loader-example'),
  'uiverse-clay-color-swatch': () => import('../examples/uiverse-clay-color-swatch-example'),
  'uiverse-mini-audio-player': () => import('../examples/uiverse-mini-audio-player-example'),
  'uiverse-team-action-card': () => import('../examples/uiverse-team-action-card-example'),
  'uiverse-stacked-input-form': () => import('../examples/uiverse-stacked-input-form-example'),
  'uiverse-dark-action-menu': () => import('../examples/uiverse-dark-action-menu-example'),
  'uiverse-vertical-social-tooltips': () => import('../examples/uiverse-vertical-social-tooltips-example'),
  'uiverse-laptop-recording-loader': () => import('../examples/uiverse-laptop-recording-loader-example'),
  'uiverse-perspective-color-swatch': () => import('../examples/uiverse-perspective-color-swatch-example'),
  'uiverse-auth-split-form': () => import('../examples/uiverse-auth-split-form-example'),
  'uiverse-orb-gender-radio': () => import('../examples/uiverse-orb-gender-radio-example'),
  'uiverse-glow-difficulty-radio': () => import('../examples/uiverse-glow-difficulty-radio-example'),
  'voice-pill': () => import('../examples/voice-pill-example'),
  'swipe-toast': () => import('../examples/swipe-toast-example'),
  'card-nav': () => import('../examples/card-nav-example'),
  'pill-nav': () => import('../examples/pill-nav-example'),
  'gooey-nav': () => import('../examples/gooey-nav-example'),
  'animated-list': () => import('../examples/animated-list-example'),
  'flowing-menu': () => import('../examples/flowing-menu-example'),
  dock: () => import('../examples/dock-example'),
  'fuse-button': () => import('../examples/fuse-button-example'),
  'hold-button': () => import('../examples/hold-button-example'),
  'lattice-loader': () => import('../examples/lattice-loader-example'),
  'jelly-radio': () => import('../examples/jelly-radio-example'),
  'paper-crumple': () => import('../examples/paper-crumple-example'),
  'rubber-segment': () => import('../examples/rubber-segment-example'),
  'spring-check': () => import('../examples/spring-check-example'),
  'squish-switch': () => import('../examples/squish-switch-example'),
  'code-slots': () => import('../examples/code-slots-example'),
  'bell-toggle': () => import('../examples/bell-toggle-example'),
  'branched-menu': () => import('../examples/branched-menu-example'),
}
const loaded = new Map<string, ComponentType>()

function LoadedExample({ id }: { id: string }) {
  let Example = loaded.get(id)
  if (!Example) {
    const load = modules[id]
    if (!load) throw new Error(`缺少 ${id} 的可运行示例`)
    Example = lazy(() => load().then(module => ({ default: module.default })))
    loaded.set(id, Example)
  }
  return <Suspense fallback={<p role="status">正在加载组件示例…</p>}><Example /></Suspense>
}

/** 收藏组件只在进入视口后加载，避免完整目录同时运行多个动画和 WebGL 场景。 */
export function FavoritePreview({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '150px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  if (!reactBitsFavoriteIds.has(id) && !uiverseFavoriteIds.has(id)) return null
  const minHeight = ['paper-crumple', 'card-nav', 'flowing-menu'].includes(id) ? 360 : 150
  return <div ref={ref} style={{ width: '100%', minHeight }}>{visible && <LoadedExample id={id} />}</div>
}
