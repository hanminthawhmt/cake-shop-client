import { api } from './axios'
import type { Cake, FetchCakesParams } from '../types/cake'

export async function fetchCakes(params: FetchCakesParams = {}): Promise<Cake[]> {
  const queryParams: Record<string, string | number> = {}

  if (params.search && params.search.trim() !== '') {
    queryParams.search = params.search.trim()
  }

  if (params.categoryId) {
    queryParams.categoryId = params.categoryId
  }

  const response = await api.get<Cake[]>('/cakes', {
    params: queryParams,
  })
  return response.data
}

export async function fetchCakeById(id: number): Promise<Cake> {
  const response = await api.get<Cake>(`/cakes/${id}`)
  return response.data
}
