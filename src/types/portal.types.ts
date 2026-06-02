import type { EstadoAprobacion, EstadoOrdenArea, EstadoOrdenGeneral } from './enums'
import type { FacturaDto } from './factura.types'
import type { RechazarOrdenAreaClienteRequest, SeguimientoOrdenAreaDto } from './orden.types'
import type { VehiculoHistorialDto } from './vehiculo.types'

export interface PortalOrdenResumenDto {
  id: number
  estado: EstadoOrdenGeneral
  fechaIngreso: string
  fechaEstimadaEntrega: string
  fechaCierre: string | null
  tipoServicioId: number
  vehiculoId: number
}

export interface PortalOrdenAreaDetalleDto {
  id: number
  areaServicioId: number
  estado: EstadoOrdenArea
  diagnostico: string
  costoManoObraEstimado: number
  trabajosPropuestos: PortalTrabajoPropuestoDto[]
  repuestosPropuestos: PortalRepuestoPropuestoDto[]
}

export interface PortalTrabajoPropuestoDto {
  id: number
  descripcion: string
  costoEstimadoManoObra: number
  estadoAprobacion: EstadoAprobacion
}

export interface PortalRepuestoPropuestoDto {
  id: number
  repuestoId: number
  cantidadSolicitada: number
  precioUnitario: number
  estadoAprobacion: EstadoAprobacion
}

export interface PortalAprobarAreaRequest {
  trabajosAprobados: number[]
  repuestosAprobados: number[]
  comentarioCliente: string
  firmaDigitalUrl?: string | null
}

export interface PortalVehiculoResumenDto {
  id: number
  vin: string
  placa: string
  anio: number
  fechaInicioPropietario: string
  fechaVencimientoSOAT: string | null
  fechaVencimientoTecnomecanica: string | null
}

export type PortalRechazarAreaRequest = RechazarOrdenAreaClienteRequest
export type PortalFacturaDto = FacturaDto
export type PortalSeguimientoOrdenAreaDto = SeguimientoOrdenAreaDto
export type PortalVehiculoHistorialDto = VehiculoHistorialDto
