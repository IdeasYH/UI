import { OriginalFrame } from './original-frame'

/** Original HTML/CSS by nazar-gavrylyk: https://uiverse.io/nazar-gavrylyk/terrible-gecko-91 (MIT). */
export function TeamActionCard({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return <OriginalFrame slug={`nazar-gavrylyk--terrible-gecko-91${variant === 'light' ? '-light' : ''}`} title={variant === 'light' ? '团队动作卡片（白色版）' : '团队动作卡片（深色版）'} height={270} />
}
