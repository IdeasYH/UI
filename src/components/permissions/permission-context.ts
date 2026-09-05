import { createContext, useContext } from 'react'
import type { PermissionState } from './permission-model'

export type PermissionContextValue = {
  state: PermissionState;
  can: (code: string) => boolean;
  reason: (code: string) => string;
  inspect: (code: string) => void;
  launch: () => void;
  assign: (person: { id: string; name: string }) => void;
}
export const PermissionContext = createContext<PermissionContextValue | null>(null)
export const usePermissions = () => useContext(PermissionContext)
