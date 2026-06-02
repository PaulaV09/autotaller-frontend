export interface TipoDocumento {
  id: number
  nombre: string
  codigo: string
}

export interface MarcaVehiculo {
  id: number
  nombre: string
}

export interface ModeloVehiculo {
  id: number
  marcaVehiculoId: number
  nombre: string
}

export interface AreaServicio {
  id: number
  nombre: string
  descripcion: string
}

export interface TipoServicio {
  id: number
  nombre: string
  descripcion: string
  diasEstimadosBase: number
}

export interface CategoriaRepuesto {
  id: number
  nombre: string
  descripcion: string
}

export interface MetodoPago {
  id: number
  nombre: string
  activo: boolean
}

export interface SeccionInspeccion {
  id: number
  nombre: string
  descripcion: string | null
  orden: number
  activo: boolean
}

export interface EnumItem {
  id: number
  nombre: string
}
