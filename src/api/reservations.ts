import { api } from './axios'
import type { Reservation } from '../types/room'

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await api.get<Reservation[]>('/reservations')
  return response.data
}

export async function fetchReservationById(id: number): Promise<Reservation> {
  const response = await api.get<Reservation>(`/reservations/${id}`)
  return response.data
}

export async function cancelReservation(id: number): Promise<Reservation> {
  const response = await api.patch<Reservation>(`/reservations/${id}/cancel`)
  return response.data
}
