import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User, SignupDto, SigninDto } from '../types/auth'
import { signupApi, signinApi, fetchCurrentUserApi } from '../api/auth'

const TOKEN_KEY = 'petal_cocoa_token'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (data: SigninDto) => Promise<void>
  signup: (data: SignupDto) => Promise<void>
  loginWithToken: (authToken: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_KEY)
    if (!currentToken) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const userData = await fetchCurrentUserApi()
      setUser(userData)
    } catch (err) {
      console.error('Failed to fetch authenticated user profile:', err)
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const saveTokenAndFetchUser = async (authToken: string) => {
    localStorage.setItem(TOKEN_KEY, authToken)
    setToken(authToken)
    try {
      const userData = await fetchCurrentUserApi()
      setUser(userData)
    } catch {
      // If /users/me fails right after login/signup, set fallback minimal user
      setUser({ id: 0, name: 'Customer', email: '' })
    }
  }

  const loginWithToken = async (authToken: string) => {
    await saveTokenAndFetchUser(authToken)
  }

  const login = async (data: SigninDto) => {
    const res = await signinApi(data)
    const authToken = res.accessToken || res.token || res.access_token
    if (authToken) {
      await saveTokenAndFetchUser(authToken)
    } else {
      throw new Error('Authentication failed: No access token received from server.')
    }
  }

  const signup = async (data: SignupDto) => {
    const res = await signupApi(data)
    const authToken = res.accessToken || res.token || res.access_token
    if (authToken) {
      await saveTokenAndFetchUser(authToken)
    } else {
      // Some APIs might return signup without auto-login token, so attempt signin
      await login({ email: data.email, password: data.password })
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: Boolean(token),
        isLoading,
        login,
        signup,
        loginWithToken,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
