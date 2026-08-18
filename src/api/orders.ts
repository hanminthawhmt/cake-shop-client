import { api } from './axios'
import type { Order, CreateOrderDto } from '../types/orders'

export async function createOrder(data: CreateOrderDto): Promise<Order> {
  const response = await api.post<Order>('/orders', data)
  return response.data
}

export async function fetchOrders(params?: { status?: string; date?: string }): Promise<Order[]> {
  const response = await api.get<Order[]>('/orders', { params })
  return response.data
}

export async function fetchOrderById(id: number): Promise<Order> {
  const response = await api.get<Order>(`/orders/${id}`)
  return response.data
}

export async function cancelOrder(id: number): Promise<Order> {
  const response = await api.patch<Order>(`/orders/${id}/cancel`)
  return response.data
}
