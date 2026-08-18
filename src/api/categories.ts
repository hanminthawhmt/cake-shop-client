import { api } from './axios'
import type { Category } from '../types/cake'

export async function fetchCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories')
  return response.data
}
