import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('petal_cocoa_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
