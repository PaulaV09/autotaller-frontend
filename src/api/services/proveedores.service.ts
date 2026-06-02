import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PagedResponse } from '@/types/common.types'
import type {
  CreateProveedorRequest,
  ProveedorDto,
  RepuestoProveedorDto,
  UpdateProveedorRequest,
} from '@/types/repuesto.types'

interface ListProveedoresParams {
  pageNumber?: number
  pageSize?: number
  nombre?: string
  activo?: boolean
}

export const proveedoresService = {
  list: (params: ListProveedoresParams = {}) =>
    apiClient
      .get<PagedResponse<ProveedorDto>>(ENDPOINTS.proveedores.list, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<ProveedorDto>(ENDPOINTS.proveedores.byId(id)).then((r) => r.data),

  create: (body: CreateProveedorRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.proveedores.list, body).then((r) => r.data),

  update: (id: number, body: UpdateProveedorRequest) =>
    apiClient.put(ENDPOINTS.proveedores.byId(id), body),

  toggleActivo: (id: number) =>
    apiClient.patch(ENDPOINTS.proveedores.toggleActivo(id)),

  getRepuestos: (id: number) =>
    apiClient
      .get<RepuestoProveedorDto[]>(ENDPOINTS.proveedores.repuestos(id))
      .then((r) => r.data),
}
