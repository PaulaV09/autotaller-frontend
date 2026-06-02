import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PagedResponse } from '@/types/common.types'
import type { EstadoPagoFactura } from '@/types/enums'
import type {
  FacturaDto,
  FacturaResumenDto,
  GenerarFacturaRequest,
  PagoFacturaDto,
  RegistrarPagoFacturaRequest,
} from '@/types/factura.types'

interface ListFacturasParams {
  pageNumber?: number
  pageSize?: number
  estadoPago?: EstadoPagoFactura
  ordenServicioGeneralId?: number
}

export const facturasService = {
  list: (params: ListFacturasParams = {}) =>
    apiClient
      .get<PagedResponse<FacturaDto>>(ENDPOINTS.facturas.list, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<FacturaResumenDto>(ENDPOINTS.facturas.byId(id)).then((r) => r.data),

  generar: (ordenId: number, body?: GenerarFacturaRequest | null) =>
    apiClient.post<{ id: number }>(ENDPOINTS.facturas.generar(ordenId), body).then((r) => r.data),

  getPagos: (facturaId: number) =>
    apiClient.get<PagoFacturaDto[]>(ENDPOINTS.facturas.pagos(facturaId)).then((r) => r.data),

  registrarPago: (facturaId: number, body: RegistrarPagoFacturaRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.facturas.pagos(facturaId), body).then((r) => r.data),
}
