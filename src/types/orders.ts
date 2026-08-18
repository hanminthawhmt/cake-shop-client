export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pick_up'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'unpaid' | 'paid'

export interface OrderItem {
  id: number
  orderId: number
  cakeId?: number
  quantity: number
  unitPrice: number | string
  totalPrice: number | string
  notes?: string
  cakeName?: string
  cake?: {
    id: number
    name: string
    images?: Array<{ url: string }>
  }
  selectedValues?: Array<{
    id: number
    label: string
    priceModifier: string | number
  }>
}

export interface Order {
  id: number
  userId: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  pickupDate: string
  pickupTime: string
  totalPrice: number | string
  createdAt: string
  updatedAt: string
  items?: OrderItem[]
}

export interface CreateOrderDto {
  pickupDate: string
  pickupTime: string
}
