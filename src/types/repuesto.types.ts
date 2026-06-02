import type { EstadoOrdenCompra } from './enums'

export interface RepuestoDto {
  id: number
  categoriaRepuestoId: number
  codigo: string
  descripcion: string
  stockBodega: number
  stockAlmacen: number
  stockReservado: number
  stockEnObra: number
  precioUnitario: number
  activo: boolean
}

export interface CreateRepuestoRequest {
  categoriaRepuestoId: number
  codigo: string
  descripcion: string
  stockBodega: number
  precioUnitario: number
}

export interface UpdateRepuestoRequest {
  categoriaRepuestoId: number
  descripcion: string
  precioUnitario: number
  activo: boolean
}

export interface ProveedorDto {
  id: number
  nombre: string
  telefono: string
  correo: string
  activo: boolean
}

export interface CreateProveedorRequest {
  nombre: string
  telefono: string
  correo: string
}

export interface UpdateProveedorRequest {
  nombre: string
  telefono: string
  correo: string
}

export interface RepuestoProveedorDto {
  repuestoId: number
  codigoRepuesto: string
  descripcionRepuesto: string
  proveedorId: number
  nombreProveedor: string
  codigoProveedor: string
  precioCompraReferencial: number
}

export interface LinkProveedorRepuestoRequest {
  codigoProveedor: string
  precioCompraReferencial: number
}

export interface OrdenCompraResumenDto {
  id: number
  proveedorId: number
  nombreProveedor: string
  jefeBodegaId: number
  estado: EstadoOrdenCompra
  fechaCreacion: string
  fechaEnvio: string | null
  fechaRecepcion: string | null
  observaciones: string
  totalRepuestos: number
}

export interface OrdenCompraDetalleDto {
  id: number
  repuestoId: number
  codigoRepuesto: string
  descripcionRepuesto: string
  cantidadSolicitada: number
  cantidadRecibida: number
  precioUnitarioCompra: number
  observacion: string | null
}

export interface OrdenCompraDetalleResponse {
  orden: OrdenCompraResumenDto
  detalles: OrdenCompraDetalleDto[]
}

export interface CreateOrdenCompraRequest {
  proveedorId: number
  observaciones: string
  detalles: CreateDetalleOrdenCompraRequest[]
}

export interface CreateDetalleOrdenCompraRequest {
  repuestoId: number
  cantidadSolicitada: number
  precioUnitarioCompra: number
  observacion?: string | null
}

export interface RecibirMercanciaRequest {
  recepciones: RecepcionDetalleRequest[]
  observaciones?: string
}

export interface RecepcionDetalleRequest {
  detalleOrdenCompraId: number
  cantidadRecibida: number
}

export interface CancelarOrdenCompraRequest {
  motivo: string
}
