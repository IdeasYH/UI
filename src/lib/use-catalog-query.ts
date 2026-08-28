import { useState } from 'react'

export function useCatalogQuery() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')

  const updateQuery = (next: string) => {
    setQuery(next)
    const url = new URL(window.location.href)
    if (next.trim()) url.searchParams.set('q', next)
    else url.searchParams.delete('q')
    url.hash = ''
    window.history.replaceState(null, '', url)
  }

  return [query, updateQuery] as const
}
