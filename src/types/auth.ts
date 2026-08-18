export interface User {
  id: number
  name: string
  email: string
  role?: string
  address?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}

export interface SignupDto {
  name: string
  email: string
  password: string
}

export interface SigninDto {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken?: string
  token?: string
  access_token?: string
  user?: User
}
