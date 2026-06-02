import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { EstadoOrdenGeneral } from '@/types/enums'
import type { FacturaDto, RegistrarPagoFacturaRequest } from '@/types/factura.types'
import type {
  PortalAprobarAreaRequest,
  PortalOrdenAreaDetalleDto,
  PortalOrdenResumenDto,
  PortalRechazarAreaRequest,
  PortalSeguimientoOrdenAreaDto,
  PortalVehiculoHistorialDto,
  PortalVehiculoResumenDto,
} from '@/types/portal.types'

interface ListPortalOrdenesParams {
  estado?: EstadoOrdenGeneral
  desde?: string
  hasta?: string
}

export const portalService = {
  getOrdenes: (params: ListPortalOrdenesParams = {}) =>
    apiClient
      .get<PortalOrdenResumenDto[]>(ENDPOINTS.portal.ordenes, { params })
      .then((r) => r.data),

  getOrden: (id: number) =>
    apiClient.get<PortalOrdenResumenDto>(ENDPOINTS.portal.orden(id)).then((r) => r.data),

  getOrdenAreas: (id: number) =>
    apiClient
      .get<PortalOrdenAreaDetalleDto[]>(ENDPOINTS.portal.ordenAreas(id))
      .then((r) => r.data),

  aprobarArea: (areaId: number, body: PortalAprobarAreaRequest) =>
    apiClient.post(ENDPOINTS.portal.aprobarArea(areaId), body),

  rechazarArea: (areaId: number, body: PortalRechazarAreaRequest) =>
    apiClient.post(ENDPOINTS.portal.rechazarArea(areaId), body),

  getSeguimientosArea: (areaId: number) =>
    apiClient
      .get<PortalSeguimientoOrdenAreaDto[]>(ENDPOINTS.portal.seguimientosArea(areaId))
      .then((r) => r.data),

  getVehiculos: () =>
    apiClient.get<PortalVehiculoResumenDto[]>(ENDPOINTS.portal.vehiculos).then((r) => r.data),

  getVehiculoHistorial: (id: number) =>
    apiClient
      .get<PortalVehiculoHistorialDto>(ENDPOINTS.portal.vehiculoHistorial(id))
      .then((r) => r.data),

  getFacturas: () =>
    apiClient.get<FacturaDto[]>(ENDPOINTS.portal.facturas).then((r) => r.data),

  getFactura: (id: number) =>
    apiClient.get<FacturaDto>(ENDPOINTS.portal.factura(id)).then((r) => r.data),

  pagarFactura: (id: number, body: RegistrarPagoFacturaRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.portal.pagarFactura(id), body).then((r) => r.data),
}
