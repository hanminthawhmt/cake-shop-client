import { api } from './axios'
import type { UpdateInfoDto, ChangePasswordDto } from '../types/auth'

export async function updateUserInfoApi(data: UpdateInfoDto): Promise<any> {
  const response = await api.patch('/users/me', data)
  return response.data
}

export async function changePasswordApi(data: ChangePasswordDto): Promise<any> {
  const response = await api.patch('/auth/change-password', data)
  return response.data
}
