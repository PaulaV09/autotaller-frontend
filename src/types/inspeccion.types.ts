import type { EstadoInspeccion, TipoEvidenciaInspeccion } from './enums'

export interface InspeccionVehiculoDto {
  id: number
  vehiculoId: number
  clienteId: number
  inspectorId: number
  fechaInspeccion: string
  kilometrajeActual: number
  observacionesGenerales: string
  estado: EstadoInspeccion
}

export interface DetalleInspeccionVehiculoDto {
  id: number
  inspeccionVehiculoId: number
  seccion: string
  estado: string
  observacion: string
}

export interface EvidenciaInspeccionVehiculoDto {
  id: number
  inspeccionVehiculoId: number
  tipo: TipoEvidenciaInspeccion
  url: string
  descripcion: string
}

export interface CreateDetalleInspeccionRequest {
  seccion: string
  estado: string
  observacion: string
}

export interface CreateEvidenciaInspeccionRequest {
  tipo: TipoEvidenciaInspeccion
  url: string
  descripcion: string
}

export interface CreateInspeccionRequest {
  vehiculoId: number
  clienteId: number
  kilometrajeActual: number
  observacionesGenerales: string
  detalles: CreateDetalleInspeccionRequest[]
  evidencias: CreateEvidenciaInspeccionRequest[]
}

export interface CrearOrdenDesdeInspeccionRequest {
  tipoServicioId: number
  observacionesIniciales: string
}
