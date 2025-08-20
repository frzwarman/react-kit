export type AutocompleteOption = {
  value: string | number
  label: string
}

export type AutocompleteFetchParams = {
  search: string
  cursor?: string | number | null
  page?: number
  pageSize: number
}

export type AutocompleteFetchResult = {
  items: AutocompleteOption[]
  nextCursor?: string | number | null
  hasMore: boolean
  total?: number
}

export type AutocompleteFetcher = (
  params: AutocompleteFetchParams,
) => Promise<AutocompleteFetchResult>

export type AutocompleteMode = 'client' | 'server'
