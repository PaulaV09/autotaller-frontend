import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PagedResponse } from '@/types/common.types'
import type {
  VehiculoDto,
  UpdateVehiculoRequest,
  PropietarioHistorialDto,
  VehiculoHistorialDto,
} from '@/types/vehiculo.types'

interface ListVehiculosParams {
  pageNumber?: number
  pageSize?: number
  vin?: string
  clienteId?: number
}

export const vehiculosService = {
  list: (params: ListVehiculosParams = {}) =>
    apiClient
      .get<PagedResponse<VehiculoDto>>(ENDPOINTS.vehiculos.list, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<VehiculoDto>(ENDPOINTS.vehiculos.byId(id)).then((r) => r.data),

  update: (id: number, body: UpdateVehiculoRequest) =>
    apiClient.put(ENDPOINTS.vehiculos.byId(id), body),

  cambiarPropietario: (id: number, nuevoClienteId: number) =>
    apiClient.patch(ENDPOINTS.vehiculos.cambiarPropietario(id), { nuevoClienteId }),

  getPropietarios: (id: number) =>
    apiClient
      .get<PropietarioHistorialDto[]>(ENDPOINTS.vehiculos.propietarios(id))
      .then((r) => r.data),

  getHistorial: (id: number) =>
    apiClient
      .get<VehiculoHistorialDto>(ENDPOINTS.vehiculos.historial(id))
      .then((r) => r.data),
}
