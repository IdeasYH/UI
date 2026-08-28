import type { PortalPermission } from './portal-content-contract'

export type PortalSession = {
  capabilities: string[]
  personId: string | null
  loginName: string
  displayName: string
  localAccount: boolean
  mustChangePassword: boolean
  permissions: PortalPermission[]
  permissionsAvailable: boolean
}

export type PortalPermissionResource = {
  code: string
  name: string
  applicationCode: string
  applicationName: string
}

export class PortalAuthError extends Error {
  constructor(message: string, readonly status?: number, readonly code?: string) {
    super(message)
    this.name = 'PortalAuthError'
  }
}

// Preview identity only. This module must never be used as production authentication.
const demoSession: PortalSession = {
  capabilities: [],
  personId: null,
  loginName: 'admin',
  displayName: '示例管理员',
  localAccount: true,
  mustChangePassword: false,
  permissions: [{ resourceCode: 'authorization.admin.manage', actions: ['VIEW', 'EXECUTE'] }],
  permissionsAvailable: true,
}
let signedIn = true

export async function getPortalSession(
  signal?: AbortSignal,
  _applications?: readonly string[],
): Promise<PortalSession | null> {
  signal?.throwIfAborted()
  return signedIn ? structuredClone(demoSession) : null
}

export async function loginPortal(): Promise<PortalSession> {
  signedIn = true
  return structuredClone(demoSession)
}

export async function logoutPortal(): Promise<void> {
  signedIn = false
}

export async function getPortalPermissionCatalog(signal?: AbortSignal): Promise<PortalPermissionResource[]> {
  signal?.throwIfAborted()
  return [
    { code: 'authorization.admin.manage', name: '门户管理', applicationCode: 'authorization', applicationName: '权限中心' },
    { code: 'hrm.personnel.roster', name: '人员名册', applicationCode: 'hrm', applicationName: '人员与组织' },
    { code: 'invest.access.member', name: '招商工作区', applicationCode: 'invest', applicationName: '水果中台' },
    { code: 'invest.operator.access.member', name: '运营工作区', applicationCode: 'invest', applicationName: '水果中台' },
    { code: 'invest.operator.sync.workspace', name: '运营同步', applicationCode: 'invest', applicationName: '水果中台' },
  ]
}
