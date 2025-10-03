export type AutocompleteOption<T = unknown> = {
  value: string | number
  label: string
  /** Optional original object returned by the fetcher/static source */
  raw?: T
}

export type AutocompleteFetchParams = {
  search: string
  moreFilter?: Record<string, string | number | boolean>,
  cursor?: string | number | null
  page: number
  pageSize: number
}

export type AutocompleteFetchResult<T = unknown> = {
  items: AutocompleteOption<T>[]
  nextCursor?: string | number | null
  hasMore: boolean
  total?: number
}

export type AutocompleteFetcher<T = unknown> = (
  params: AutocompleteFetchParams,
) => Promise<AutocompleteFetchResult<T>>

export type AutocompleteMode = 'client' | 'server'
