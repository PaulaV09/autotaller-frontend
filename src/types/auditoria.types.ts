export interface AuditoriaDto {
  id: number
  tipoAccionAuditoriaId: number
  usuarioId: number | null
  entidad: string
  entidadId: string
  fechaHora: string
  descripcion: string
  valoresAnteriores: string | null
  valoresNuevos: string | null
}

export interface ErrorSistemaDto {
  id: number
  usuarioId: number | null
  mensaje: string
  stackTrace: string | null
  ruta: string
  metodoHttp: string
  traceId: string
  fecha: string
}

export interface AuditoriaPagedResponse<T> {
  pageNumber: number
  pageSize: number
  total: number
  items: T[]
}
