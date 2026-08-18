export interface Category {
  id: number
  name: string
}

export interface CakeImage {
  id: number
  cakeId?: number
  url: string
  publicId?: string
  displayOrder?: number
}

export interface CakeOptionValue {
  id: number
  cakeOptionId: number
  label: string
  priceModifier: string | number
}

export interface CakeOption {
  id: number
  cakeId: number
  name: string
  values: CakeOptionValue[]
}

export interface Cake {
  id: number
  name: string
  description: string
  basePrice: string | number
  isAvailable: boolean
  categoryId: number
  createdAt: string
  updatedAt: string
  category?: Category
  images?: CakeImage[]
  options?: CakeOption[]
}

export interface FetchCakesParams {
  search?: string
  categoryId?: number | null
}
