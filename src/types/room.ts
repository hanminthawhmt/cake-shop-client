export interface RoomImage {
  id: number
  roomId?: number
  url: string
  publicId?: string
}

export interface Room {
  id: number
  name: string
  description?: string
  capacity: number
  price: string | number
  isAvailable: boolean
  createdAt?: string
  updatedAt?: string
  images?: RoomImage[]
}

export interface RoomAvailabilitySlot {
  timeSlot: string
  isAvailable: boolean
}

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Reservation {
  id: number
  roomId: number
  userId: number
  date: string
  timeSlot: string
  guestCount: number
  birthdayRequirements?: string
  status: ReservationStatus
  createdAt: string
  updatedAt?: string
  room?: Room
}

export interface CreateReservationDto {
  date: string
  timeSlot: string
  guestCount: number
  birthdayRequirements?: string
}
