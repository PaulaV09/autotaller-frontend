export interface ReporteResumenDto {
  ordenes: {
    pendientes: number
    enDiagnostico: number
    esperandoAprobacion: number
    enProceso: number
    completadas: number
    canceladas: number
    facturadas: number
    total: number
  }
  ingresos: {
    totalFacturado: number
    totalCobrado: number
    saldoPendiente: number
    facturasPendientes: number
    facturasParciales: number
    facturasCompletas: number
  }
}

export interface AlertaInventarioDto {
  id: number
  codigo: string
  descripcion: string
  stockBodega: number
  stockAlmacen: number
  stockReservado: number
  stockEnObra: number
  disponible: number
}

export interface ProductividadMecanicoDto {
  mecanicoId: number
  nombreMecanico: string
  periodo: PeriodoReporte
  ordenesCompletadas: number
  totalManoObra: number
  promedioManoObra: number
}

export interface RendimientoAreasDto {
  periodo: PeriodoReporte
  areas: RendimientoAreaDto[]
}

export interface RendimientoAreaDto {
  areaServicioId: number
  nombreArea: string
  totalOrdenes: number
  totalManoObra: number
  promedioManoObra: number
}

export interface IngresosReporteDto {
  periodo: PeriodoReporte
  totalFacturado: number
  totalCobrado: number
  saldoPendiente: number
}

export interface RotacionInventarioDto {
  repuestoId: number
  codigo: string
  descripcion: string
  totalSalidas: number
  usosFrecuencia: number
  stockActual: number
}

export interface PeriodoReporte {
  desde: string | null
  hasta: string | null
}
