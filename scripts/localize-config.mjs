import { readFileSync, writeFileSync } from 'node:fs'

const configPath = new URL('../src/data/portal-config.json', import.meta.url)
const config = JSON.parse(readFileSync(configPath, 'utf8'))

// The copied configuration contains real service URLs. Keep every demo entry local.
function localize(value) {
  if (!value || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    if (key === 'href' && typeof child === 'string' && /^https?:\/\//.test(child)) {
      value[key] = '/components/person-picker'
    } else {
      localize(child)
    }
  }
}

localize(config)
if (!config.navigation.some((item) => item.id === 'person-picker')) {
  config.navigation.push({
    id: 'person-picker', name: '人员选择', href: '/components/person-picker',
    enabled: true, order: 50, visibility: { mode: 'public' },
  })
}
writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)
