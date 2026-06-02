import type { EstadoOrdenGeneral, EstadoOrdenArea, EstadoAprobacion } from './enums'

export interface OrdenServicioGeneralDto {
  id: number
  vehiculoId: number
  clienteId: number
  tipoServicioId: number
  estado: EstadoOrdenGeneral
  fechaIngreso: string
  fechaEstimadaEntrega: string
  fechaCierre: string | null
  observacionesIniciales: string
  inspeccionId: number | null
}

export interface OrdenServicioAreaDto {
  id: number
  ordenServicioGeneralId: number
  areaServicioId: number
  mecanicoAsignadoId: number | null
  estado: EstadoOrdenArea
  diagnostico: string
  trabajoRealizado: string
  costoManoObraEstimado: number
  costoManoObraFinal: number
  comentarioJefeTaller: string | null
}

export interface TrabajoPropuestoDto {
  id: number
  ordenServicioAreaId: number
  descripcion: string
  costoEstimadoManoObra: number
  estadoAprobacion: EstadoAprobacion
}

export interface SeguimientoOrdenAreaDto {
  id: number
  ordenServicioAreaId: number
  usuarioId: number
  porcentajeAvance: number
  comentario: string
  fechaRegistro: string
}

export interface RepuestoPropuestoDto {
  id: number
  ordenServicioAreaId: number
  repuestoId: number
  cantidadSolicitada: number
  cantidadAprobada: number
  cantidadUsada: number
  precioUnitario: number
  estadoAprobacion: EstadoAprobacion
}

export interface CreateOrdenServicioGeneralRequest {
  vehiculoId: number
  clienteId: number
  tipoServicioId: number
  observacionesIniciales: string
}

export interface CreateOrdenServicioAreaRequest {
  areaServicioId: number
  mecanicoAsignadoId: number | null
  diagnostico: string
  costoManoObraEstimado: number
}

export interface ProponerTrabajoRequest {
  descripcion: string
  costoEstimadoManoObra: number
}

export interface ProponerRepuestoRequest {
  repuestoId: number
  cantidadSolicitada: number
  precioUnitario: number
}

export interface AprobarRevisionJefeTallerRequest {
  trabajosAprobados: number[]
  repuestosAprobados: number[]
  comentario: string
}

export interface RechazarRevisionJefeTallerRequest {
  motivoRechazo: string
}

export interface AprobarOrdenAreaRequest {
  trabajosAprobados: number[]
  repuestosAprobados: number[]
  comentarioCliente: string
  firmaDigitalUrl?: string
}

export interface RechazarOrdenAreaClienteRequest {
  comentarioCliente: string
}

export interface CompletarOrdenAreaRequest {
  trabajoRealizado: string
  costoManoObraFinal: number
}

export interface RegistrarSeguimientoRequest {
  porcentajeAvance: number
  comentario: string
}

export interface ActualizarDiagnosticoRequest {
  diagnostico: string
}

export interface ReasignarMecanicoRequest {
  nuevoMecanicoId: number | null
}
