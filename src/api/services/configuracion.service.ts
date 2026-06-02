import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ActualizarConfiguracionRequest,
  ConfiguracionTallerDto,
} from '@/types/configuracion.types'

export const configuracionService = {
  get: () =>
    apiClient.get<ConfiguracionTallerDto>(ENDPOINTS.configuracion.get).then((r) => r.data),

  update: (body: ActualizarConfiguracionRequest) =>
    apiClient
      .put<ConfiguracionTallerDto>(ENDPOINTS.configuracion.update, body)
      .then((r) => r.data),
}
