import sourceConfig from '../data/portal-config.json'
import { defaultPortalConfig, type PortalConfig } from './portal-content-contract'

export class PortalContentError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'PortalContentError'
  }
}

// Configuration edits are confined to this page's memory; no Home files or APIs are changed.
let previewConfig = structuredClone(sourceConfig) as PortalConfig

export async function getPortalConfig(): Promise<PortalConfig> {
  return structuredClone(previewConfig)
}

export async function savePortalConfig(config: PortalConfig): Promise<PortalConfig> {
  previewConfig = structuredClone(config)
  return getPortalConfig()
}

export { defaultPortalConfig }
