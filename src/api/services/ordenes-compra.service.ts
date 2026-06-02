import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { EstadoOrdenCompra } from '@/types/enums'
import type {
  CancelarOrdenCompraRequest,
  CreateOrdenCompraRequest,
  OrdenCompraDetalleResponse,
  OrdenCompraResumenDto,
  RecibirMercanciaRequest,
} from '@/types/repuesto.types'

interface ListOrdenesCompraParams {
  pageNumber?: number
  pageSize?: number
  proveedorId?: number
  estado?: EstadoOrdenCompra
}

export const ordenesCompraService = {
  list: (params: ListOrdenesCompraParams = {}) =>
    apiClient
      .get<OrdenCompraResumenDto[]>(ENDPOINTS.ordenesCompra.list, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<OrdenCompraDetalleResponse>(ENDPOINTS.ordenesCompra.byId(id))
      .then((r) => r.data),

  create: (body: CreateOrdenCompraRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.ordenesCompra.list, body).then((r) => r.data),

  recibir: (id: number, body: RecibirMercanciaRequest) =>
    apiClient.post(ENDPOINTS.ordenesCompra.recibir(id), body),

  cancelar: (id: number, body: CancelarOrdenCompraRequest) =>
    apiClient.patch(ENDPOINTS.ordenesCompra.cancelar(id), body),
}
