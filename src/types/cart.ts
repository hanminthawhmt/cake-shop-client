export interface SelectedValue {
  id: number
  label: string
  priceModifier: string | number
  cakeOptionId?: number
}

export interface CartCakeInfo {
  id: number
  name: string
  description?: string
  basePrice?: string | number
  images?: Array<{ url: string }>
}

export interface CartItem {
  id: number
  cakeId?: number
  quantity: number
  notes?: string
  cake: CartCakeInfo
  selectedValues: SelectedValue[]
  unitPrice: number
  lineTotal: number
}

export interface Cart {
  cartId: number
  items: CartItem[]
  cartTotal: number
}

export interface AddCartItemDto {
  cakeId: number
  quantity: number
  notes?: string
  selectedValueIds: number[]
}

export interface UpdateCartItemDto {
  quantity?: number
  notes?: string
}
