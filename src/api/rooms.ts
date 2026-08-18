import { api } from './axios'
import type { Room, RoomAvailabilitySlot, Reservation, CreateReservationDto } from '../types/room'

export async function fetchRooms(): Promise<Room[]> {
  const response = await api.get<Room[]>('/rooms')
  return response.data
}

export async function fetchRoomById(id: number): Promise<Room> {
  const response = await api.get<Room>(`/rooms/${id}`)
  return response.data
}

export async function fetchRoomAvailability(id: number, date: string): Promise<RoomAvailabilitySlot[]> {
  const response = await api.get<RoomAvailabilitySlot[]>(`/rooms/${id}/availability`, {
    params: { date },
  })
  return response.data
}

export async function createReservation(roomId: number, data: CreateReservationDto): Promise<Reservation> {
  const response = await api.post<Reservation>(`/rooms/${roomId}/reservations`, data)
  return response.data
}
