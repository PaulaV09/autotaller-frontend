import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { EstadoSolicitudRepuesto } from '@/types/enums'
import type {
  AvanzarSolicitudRepuestosRequest,
  CrearSolicitudRepuestosRequest,
  DetalleSolicitudRepuestoOrdenAreaDto,
  EntradaBodegaRequest,
  MovimientoInventarioDto,
  SolicitudRepuestoOrdenAreaDto,
  TransferirRequest,
} from '@/types/inventario.types'

interface ListSolicitudesParams {
  estado?: EstadoSolicitudRepuesto
  ordenServicioAreaId?: number
}

export const inventarioService = {
  getMovimientos: (repuestoId: number) =>
    apiClient
      .get<MovimientoInventarioDto[]>(ENDPOINTS.inventario.movimientos(repuestoId))
      .then((r) => r.data),

  registrarEntrada: (repuestoId: number, body: EntradaBodegaRequest) =>
    apiClient.post(ENDPOINTS.inventario.entrada(repuestoId), body),

  transferir: (repuestoId: number, body: TransferirRequest) =>
    apiClient.post(ENDPOINTS.inventario.transferir(repuestoId), body),

  getSolicitudes: (params: ListSolicitudesParams = {}) =>
    apiClient
      .get<SolicitudRepuestoOrdenAreaDto[]>(ENDPOINTS.inventario.solicitudes, { params })
      .then((r) => r.data),

  getSolicitudDetalles: (id: number) =>
    apiClient
      .get<DetalleSolicitudRepuestoOrdenAreaDto[]>(ENDPOINTS.inventario.solicitudDetalles(id))
      .then((r) => r.data),

  crearSolicitud: (ordenAreaId: number, body: CrearSolicitudRepuestosRequest) =>
    apiClient
      .post<{ id: number }>(ENDPOINTS.inventario.crearSolicitud(ordenAreaId), body)
      .then((r) => r.data),

  enviarABodega: (id: number, body: AvanzarSolicitudRepuestosRequest) =>
    apiClient.post(ENDPOINTS.inventario.enviarABodega(id), body),

  entregarAAlmacen: (id: number, body: AvanzarSolicitudRepuestosRequest) =>
    apiClient.post(ENDPOINTS.inventario.entregarAAlmacen(id), body),

  entregarAMecanico: (id: number, body: AvanzarSolicitudRepuestosRequest) =>
    apiClient.post(ENDPOINTS.inventario.entregarAMecanico(id), body),
}
