import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PagedResponse } from '@/types/common.types'
import type {
  InspeccionVehiculoDto,
  DetalleInspeccionVehiculoDto,
  EvidenciaInspeccionVehiculoDto,
  CreateInspeccionRequest,
  CrearOrdenDesdeInspeccionRequest,
} from '@/types/inspeccion.types'
import type { EstadoInspeccion } from '@/types/enums'

interface ListParams {
  pageNumber?: number
  pageSize?: number
  vehiculoId?: number
  clienteId?: number
  estado?: EstadoInspeccion
}

export const inspeccionesService = {
  list: (params: ListParams = {}) =>
    apiClient
      .get<PagedResponse<InspeccionVehiculoDto>>(ENDPOINTS.inspecciones.list, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<InspeccionVehiculoDto>(ENDPOINTS.inspecciones.byId(id)).then((r) => r.data),

  getDetalles: (id: number) =>
    apiClient
      .get<DetalleInspeccionVehiculoDto[]>(ENDPOINTS.inspecciones.detalles(id))
      .then((r) => r.data),

  getEvidencias: (id: number) =>
    apiClient
      .get<EvidenciaInspeccionVehiculoDto[]>(ENDPOINTS.inspecciones.evidencias(id))
      .then((r) => r.data),

  create: (body: CreateInspeccionRequest) =>
    apiClient
      .post<{ id: number }>(ENDPOINTS.inspecciones.list, body)
      .then((r) => r.data),

  crearOrden: (id: number, body: CrearOrdenDesdeInspeccionRequest) =>
    apiClient
      .post<{ ordenId: number }>(ENDPOINTS.inspecciones.crearOrden(id), body)
      .then((r) => r.data),

  cancelar: (id: number, motivo: string) =>
    apiClient.patch(ENDPOINTS.inspecciones.cancelar(id), { motivo }),
}
