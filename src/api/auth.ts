import { api } from './axios'
import type { User, SignupDto, SigninDto, AuthResponse } from '../types/auth'

export async function signupApi(data: SignupDto): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/signup', data)
  return response.data
}

export async function signinApi(data: SigninDto): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/signin', data)
  return response.data
}

export async function fetchCurrentUserApi(): Promise<User> {
  const response = await api.get<User>('/users/me')
  return response.data
}
