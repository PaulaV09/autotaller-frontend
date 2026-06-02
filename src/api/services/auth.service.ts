import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  LoginRequest,
  LoginResponse,
  CambiarPasswordRequest,
} from '@/types/auth.types'

export const authService = {
  login: (body: LoginRequest) =>
    apiClient.post<LoginResponse>(ENDPOINTS.auth.login, body).then((r) => r.data),

  logout: () =>
    apiClient.post(ENDPOINTS.auth.logout).then((r) => r.data),

  cambiarPassword: (body: CambiarPasswordRequest) =>
    apiClient.post(ENDPOINTS.auth.cambiarPassword, body).then((r) => r.data),
}
