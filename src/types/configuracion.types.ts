export interface ConfiguracionTallerDto {
  nombreTaller: string
  nit: string | null
  direccion: string | null
  ciudad: string | null
  telefono: string | null
  correo: string | null
  porcentajeIva: number
  prefijoFactura: string
  numeroConsecutivoActual: number
  resolucionDIAN: string | null
}

export interface ActualizarConfiguracionRequest {
  nombreTaller: string
  nit?: string | null
  direccion?: string | null
  ciudad?: string | null
  telefono?: string | null
  correo?: string | null
  porcentajeIva: number
  prefijoFactura: string
  resolucionDIAN?: string | null
}
