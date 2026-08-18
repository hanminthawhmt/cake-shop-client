import { api } from './axios'
import type { Cart, AddCartItemDto, UpdateCartItemDto } from '../types/cart'

export async function fetchCart(): Promise<Cart> {
  const response = await api.get<Cart>('/cart')
  return response.data
}

export async function addCartItem(data: AddCartItemDto): Promise<any> {
  const response = await api.post('/cart/items', data)
  return response.data
}

export async function updateCartItem(id: number, data: UpdateCartItemDto): Promise<any> {
  const response = await api.patch(`/cart/items/${id}`, data)
  return response.data
}

export async function deleteCartItem(id: number): Promise<any> {
  const response = await api.delete(`/cart/items/${id}`)
  return response.data
}

export async function clearCart(): Promise<any> {
  const response = await api.delete('/cart')
  return response.data
}
