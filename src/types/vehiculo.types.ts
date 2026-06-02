import type { TipoCombustible, TipoTransmision, EstadoOrdenGeneral, EstadoInspeccion } from './enums'

export interface VehiculoDto {
  id: number
  modeloVehiculoId: number
  anio: number
  vin: string
  placa: string
  kilometraje: number
  color: string | null
  tipoCombustible: TipoCombustible
  tipoTransmision: TipoTransmision
  cilindraje: number | null
  numeroMotor: string | null
  numeroChasis: string | null
  foto: string | null
  activo: boolean
  fechaVencimientoSOAT: string | null
  fechaVencimientoTecnomecanica: string | null
  paisOrigen: string | null
  esImportado: boolean
  numeroLlave: string | null
  capacidadCombustibleLitros: number | null
}

export interface CreateVehiculoRequest {
  modeloVehiculoId: number
  anio: number
  vin: string
  placa: string
  kilometraje: number
  tipoCombustible: TipoCombustible
  tipoTransmision: TipoTransmision
  color?: string
  cilindraje?: number
  numeroMotor?: string
  numeroChasis?: string
  foto?: string
  fechaVencimientoSOAT?: string
  fechaVencimientoTecnomecanica?: string
  paisOrigen?: string
  esImportado?: boolean
  numeroLlave?: string
  capacidadCombustibleLitros?: number
}

export interface UpdateVehiculoRequest {
  modeloVehiculoId: number
  anio: number
  placa: string
  kilometraje: number
  color?: string | null
  tipoCombustible: TipoCombustible
  tipoTransmision: TipoTransmision
  cilindraje?: number | null
  numeroMotor?: string | null
  numeroChasis?: string | null
  foto?: string | null
  activo: boolean
  fechaVencimientoSOAT?: string | null
  fechaVencimientoTecnomecanica?: string | null
  paisOrigen?: string | null
  esImportado?: boolean
  numeroLlave?: string | null
  capacidadCombustibleLitros?: number | null
}

export interface RegistrarClienteConVehiculoRequest {
  tipoDocumentoId: number
  numeroDocumento: string
  nombre: string
  telefono: string
  correo: string
  direccion?: string
  ciudad?: string
  vehiculos: CreateVehiculoRequest[]
  fechaNacimiento?: string
  telefonoAlternativo?: string
  genero?: string
}

export interface PropietarioHistorialDto {
  clienteId: number
  nombreCliente: string
  numeroDocumento: string
  fechaInicio: string
  fechaFin: string | null
  esPropietarioActual: boolean
}

export interface VehiculoHistorialDto {
  id: number
  vin: string
  placa: string
  anio: number
  modeloVehiculoId: number
  activo: boolean
  propietarios: PropietarioHistorialDto[]
  inspecciones: Array<{
    id: number
    fechaInspeccion: string
    estado: EstadoInspeccion
    kilometrajeActual: number
    observacionesGenerales: string
  }>
  ordenes: Array<{
    id: number
    estado: EstadoOrdenGeneral
    fechaIngreso: string
    fechaCierre: string | null
    tipoServicioId: number
    totalFacturado: number | null
  }>
  totalGastado: number
}
