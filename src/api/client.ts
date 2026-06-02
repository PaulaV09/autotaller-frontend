import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'
import type { LoginResponse } from '@/types/auth.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5171'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request: adjuntar token ───────────────────────────────────────────────────

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response: renovar token al recibir 401 ───────────────────────────────────

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(err: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (err) reject(err)
    else resolve(token!)
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return apiClient(original)
      })
    }

    original._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post<LoginResponse>(
        `${BASE_URL}/api/Auth/refresh-token`,
        { refreshToken },
      )

      useAuthStore.getState().setAuth(
        data.token,
        data.expiresAt,
        data.refreshToken,
        {
          id: data.usuarioId,
          correo: data.correo,
          clienteId: data.clienteId,
          roles: data.roles as import('@/types/auth.types').AppRole[],
        },
      )

      processQueue(null, data.token)
      original.headers.Authorization = `Bearer ${data.token}`
      return apiClient(original)
    } catch (refreshErr) {
      processQueue(refreshErr, null)
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  },
)
