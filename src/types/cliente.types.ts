import type { EstadoOrdenGeneral, EstadoInspeccion } from './enums'

export interface ClienteDto {
  id: number
  tipoDocumentoId: number
  numeroDocumento: string
  nombre: string
  telefono: string
  correo: string
  direccion: string | null
  ciudad: string | null
  activo: boolean
  fechaNacimiento: string | null
  telefonoAlternativo: string | null
  genero: string | null
}

export interface CreateClienteRequest {
  tipoDocumentoId: number
  numeroDocumento: string
  nombre: string
  telefono: string
  correo: string
  direccion?: string
  ciudad?: string
  fechaNacimiento?: string
  telefonoAlternativo?: string
  genero?: string
}

export interface UpdateClienteRequest {
  nombre: string
  telefono: string
  correo: string
  direccion?: string | null
  ciudad?: string | null
  activo: boolean
  fechaNacimiento?: string | null
  telefonoAlternativo?: string | null
  genero?: string | null
}

export interface ClienteVehiculoResumenDto {
  id: number
  vin: string
  placa: string
  anio: number
  modeloVehiculoId: number
  esPropietarioActual: boolean
  fechaVencimientoSOAT: string | null
  fechaVencimientoTecnomecanica: string | null
}

export interface ClienteEstadisticasDto {
  totalOrdenes: number
  ordenesActivas: number
  ordenesCompletadas: number
  totalFacturado: number
  totalPagado: number
  saldoPendiente: number
  ultimaVisita: string | null
  totalVehiculos: number
}

export interface OrdenResumenHistorialDto {
  id: number
  estado: EstadoOrdenGeneral
  fechaIngreso: string
  fechaCierre: string | null
  tipoServicioId: number
  totalFacturado: number | null
}

export interface InspeccionResumenHistorialDto {
  id: number
  fechaInspeccion: string
  estado: EstadoInspeccion
  kilometrajeActual: number
  observacionesGenerales: string
}
