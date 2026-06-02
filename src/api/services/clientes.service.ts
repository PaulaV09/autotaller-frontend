import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PagedResponse } from '@/types/common.types'
import type {
  ClienteDto,
  UpdateClienteRequest,
  ClienteVehiculoResumenDto,
  ClienteEstadisticasDto,
  ClienteHistorialDto,
} from '@/types/cliente.types'
import type { RegistrarClienteConVehiculoRequest } from '@/types/vehiculo.types'
import type { OrdenServicioGeneralDto } from '@/types/orden.types'
import type { FacturaDto } from '@/types/factura.types'

interface ListClientesParams {
  pageNumber?: number
  pageSize?: number
  nombre?: string
  correo?: string
}

export const clientesService = {
  list: (params: ListClientesParams = {}) =>
    apiClient
      .get<PagedResponse<ClienteDto>>(ENDPOINTS.clientes.list, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<ClienteDto>(ENDPOINTS.clientes.byId(id)).then((r) => r.data),

  registrarConVehiculos: (body: RegistrarClienteConVehiculoRequest) =>
    apiClient
      .post<{ id: number }>(ENDPOINTS.clientes.registrarConVehiculos, body)
      .then((r) => r.data),

  update: (id: number, body: UpdateClienteRequest) =>
    apiClient.put(ENDPOINTS.clientes.byId(id), body),

  delete: (id: number) =>
    apiClient.delete(ENDPOINTS.clientes.byId(id)),

  getVehiculos: (id: number) =>
    apiClient
      .get<ClienteVehiculoResumenDto[]>(ENDPOINTS.clientes.vehiculos(id))
      .then((r) => r.data),

  getOrdenes: (id: number) =>
    apiClient
      .get<OrdenServicioGeneralDto[]>(ENDPOINTS.clientes.ordenes(id))
      .then((r) => r.data),

  getFacturas: (id: number) =>
    apiClient
      .get<FacturaDto[]>(ENDPOINTS.clientes.facturas(id))
      .then((r) => r.data),

  getEstadisticas: (id: number) =>
    apiClient
      .get<ClienteEstadisticasDto>(ENDPOINTS.clientes.estadisticas(id))
      .then((r) => r.data),

  getHistorial: (id: number) =>
    apiClient
      .get<ClienteHistorialDto>(ENDPOINTS.clientes.historial(id))
      .then((r) => r.data),
}
