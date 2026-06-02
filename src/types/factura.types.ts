import type { EstadoPagoFactura, TipoDetalleFactura } from './enums'

export interface FacturaDto {
  id: number
  ordenServicioGeneralId: number
  numeroFactura: string
  fechaEmision: string
  subtotal: number
  impuestos: number
  total: number
  estadoPago: EstadoPagoFactura
}

export interface FacturaDetalleDto {
  id: number
  facturaId: number
  tipoDetalle: TipoDetalleFactura
  descripcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface FacturaResumenDto extends FacturaDto {
  totalPagado: number
  saldoPendiente: number
  detalles: FacturaDetalleDto[]
}

export interface PagoFacturaDto {
  id: number
  facturaId: number
  metodoPagoId: number
  metodoPago: string
  monto: number
  fechaPago: string
  referencia: string
}

export interface RegistrarPagoFacturaRequest {
  metodoPagoId: number
  monto: number
  referencia: string
}
