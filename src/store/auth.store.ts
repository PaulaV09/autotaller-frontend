import { create } from 'zustand'
import { getPrimaryRole } from '@/lib/constants'
import type { AppRole } from '@/types/auth.types'

interface AuthUser {
  id: number
  correo: string
  clienteId: number | null
  roles: AppRole[]
}

interface AuthStore {
  token: string | null
  expiresAt: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, expiresAt: string, refreshToken: string, user: AuthUser) => void
  clearAuth: () => void
  primaryRole: AppRole | null
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  expiresAt: null,
  user: null,
  isAuthenticated: false,

  get primaryRole() {
    return getPrimaryRole(get().user?.roles)
  },

  setAuth: (token, expiresAt, refreshToken, user) => {
    localStorage.setItem('refreshToken', refreshToken)
    set({ token, expiresAt, user, isAuthenticated: true })
  },

  clearAuth: () => {
    localStorage.removeItem('refreshToken')
    set({ token: null, expiresAt: null, user: null, isAuthenticated: false })
  },
}))
