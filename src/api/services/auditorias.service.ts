import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  AuditoriaDto,
  AuditoriaPagedResponse,
  ErrorSistemaDto,
} from '@/types/auditoria.types'

interface ListAuditoriaParams {
  pageNumber?: number
  pageSize?: number
}

export const auditoriasService = {
  list: (params: ListAuditoriaParams = {}) =>
    apiClient
      .get<AuditoriaPagedResponse<AuditoriaDto>>(ENDPOINTS.auditorias.list, { params })
      .then((r) => r.data),

  getErrores: (params: ListAuditoriaParams = {}) =>
    apiClient
      .get<AuditoriaPagedResponse<ErrorSistemaDto>>(ENDPOINTS.auditorias.errores, { params })
      .then((r) => r.data),
}
