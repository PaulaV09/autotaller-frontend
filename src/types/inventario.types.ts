import type { EstadoSolicitudRepuesto, ZonaInventario } from './enums'

export interface MovimientoInventarioDto {
  id: number
  repuestoId: number
  tipoMovimientoInventarioId: number
  ordenServicioAreaId: number | null
  usuarioId: number
  cantidad: number
  stockAnterior: number
  stockNuevo: number
  fechaMovimiento: string
  observacion: string
  zona: ZonaInventario
}

export interface EntradaBodegaRequest {
  cantidad: number
  observacion?: string
}

export interface TransferirRequest {
  cantidad: number
}

export interface SolicitudRepuestoOrdenAreaDto {
  id: number
  ordenServicioAreaId: number
  solicitadoPorUsuarioId: number
  revisadoPorUsuarioId: number | null
  entregadoPorUsuarioId: number | null
  recibidoPorUsuarioId: number | null
  estado: EstadoSolicitudRepuesto
  fechaSolicitud: string
  fechaRevisionAlmacen: string | null
  fechaEntregaBodega: string | null
  fechaRecepcionAlmacen: string | null
  fechaEntregaMecanico: string | null
  observacion: string
}

export interface DetalleSolicitudRepuestoOrdenAreaDto {
  id: number
  solicitudRepuestoOrdenAreaId: number
  repuestoId: number
  cantidadSolicitada: number
  cantidadEntregada: number
  observacion: string
}

export interface CrearSolicitudRepuestosRequest {
  observacion: string
}

export interface AvanzarSolicitudRepuestosRequest {
  observacion: string
}
