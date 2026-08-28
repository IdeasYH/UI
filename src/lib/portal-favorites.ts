export const PORTAL_FAVORITES_KEY = 'ui-model:home-favorites:v1'

export function readPortalFavorites(storage?: Pick<Storage, 'getItem'>): string[] {
  try {
    const stored = (storage ?? window.localStorage).getItem(PORTAL_FAVORITES_KEY)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : []
  } catch {
    // Favorites are optional; unavailable or malformed storage must not block the portal.
    return []
  }
}
