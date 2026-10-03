export type HslColor = { h: number; s: number; l: number }
// 渐变绘制与取色共用节点；单轴表达一条常用色路径，精确颜色仍由 HEX/系统面板输入。
export const colorStripStops = ['#FFFFFF', '#FFC4D6', '#FF3030', '#FF9100', '#FFE600', '#31D548', '#00D6DC', '#2874FF', '#9D35F4', '#392B68', '#000000']
const rgb = (hex: string) => [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16))
export function stripColor(position: number): string {
  const scaled = Math.max(0, Math.min(100, position)) / 100 * (colorStripStops.length - 1)
  const index = Math.min(Math.floor(scaled), colorStripStops.length - 2)
  const from = rgb(colorStripStops[index]), to = rgb(colorStripStops[index + 1])
  return '#' + from.map((channel, n) => Math.round(channel + (to[n] - channel) * (scaled - index)).toString(16).padStart(2, '0')).join('').toUpperCase()
}
export function stripPosition(hex: string): number {
  const target = rgb(hex)
  let best = 0, distance = Infinity
  for (let index = 0; index < colorStripStops.length - 1; index++) {
    const from = rgb(colorStripStops[index]), to = rgb(colorStripStops[index + 1])
    const delta = to.map((channel, n) => channel - from[n])
    const fraction = Math.max(0, Math.min(1, target.reduce((sum, channel, n) => sum + (channel - from[n]) * delta[n], 0) / delta.reduce((sum, channel) => sum + channel * channel, 0)))
    const error = target.reduce((sum, channel, n) => sum + (channel - from[n] - fraction * delta[n]) ** 2, 0)
    if (error < distance) { distance = error; best = (index + fraction) / (colorStripStops.length - 1) * 100 }
  }
  return best
}
export function hslToHex({ h, s, l }: HslColor): string {
  const saturation = s / 100
  const lightness = l / 100
  const amplitude = saturation * Math.min(lightness, 1 - lightness)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    return Math.round(255 * (lightness - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0')
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase()
}
export function hexToHsl(hex: string): HslColor {
  const [r, g, b] = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const delta = max - min, l = (max + min) / 2
  const h = !delta ? 0 : max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  return { h: h * 60, s: delta ? delta / (1 - Math.abs(2 * l - 1)) * 100 : 0, l: l * 100 }
}
