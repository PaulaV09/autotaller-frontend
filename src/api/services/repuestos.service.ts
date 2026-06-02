import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PagedResponse } from '@/types/common.types'
import type {
  CreateRepuestoRequest,
  LinkProveedorRepuestoRequest,
  RepuestoDto,
  RepuestoProveedorDto,
  UpdateRepuestoRequest,
} from '@/types/repuesto.types'

interface ListRepuestosParams {
  pageNumber?: number
  pageSize?: number
  stockMinimo?: number
  categoriaId?: number
  descripcion?: string
}

export const repuestosService = {
  list: (params: ListRepuestosParams = {}) =>
    apiClient
      .get<PagedResponse<RepuestoDto>>(ENDPOINTS.repuestos.list, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<RepuestoDto>(ENDPOINTS.repuestos.byId(id)).then((r) => r.data),

  create: (body: CreateRepuestoRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.repuestos.list, body).then((r) => r.data),

  update: (id: number, body: UpdateRepuestoRequest) =>
    apiClient.put(ENDPOINTS.repuestos.byId(id), body),

  delete: (id: number) =>
    apiClient.delete(ENDPOINTS.repuestos.byId(id)),

  getProveedores: (id: number) =>
    apiClient
      .get<RepuestoProveedorDto[]>(ENDPOINTS.repuestos.proveedores(id))
      .then((r) => r.data),

  linkProveedor: (id: number, proveedorId: number, body: LinkProveedorRepuestoRequest) =>
    apiClient.post(ENDPOINTS.repuestos.proveedor(id, proveedorId), body),

  unlinkProveedor: (id: number, proveedorId: number) =>
    apiClient.delete(ENDPOINTS.repuestos.proveedor(id, proveedorId)),
}
