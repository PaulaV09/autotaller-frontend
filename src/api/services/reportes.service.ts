import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  AlertaInventarioDto,
  IngresosReporteDto,
  ProductividadMecanicoDto,
  RendimientoAreasDto,
  ReporteResumenDto,
  RotacionInventarioDto,
} from '@/types/reporte.types'

interface PeriodoParams {
  desde?: string
  hasta?: string
}

export const reportesService = {
  getResumen: () =>
    apiClient.get<ReporteResumenDto>(ENDPOINTS.reportes.resumen).then((r) => r.data),

  getAlertasInventario: (umbral?: number) =>
    apiClient
      .get<AlertaInventarioDto[]>(ENDPOINTS.reportes.alertasInventario, {
        params: umbral !== undefined ? { umbral } : undefined,
      })
      .then((r) => r.data),

  getProductividadMecanico: (id: number, params: PeriodoParams = {}) =>
    apiClient
      .get<ProductividadMecanicoDto>(ENDPOINTS.reportes.productividadMecanico(id), { params })
      .then((r) => r.data),

  getRendimientoAreas: (params: PeriodoParams = {}) =>
    apiClient
      .get<RendimientoAreasDto>(ENDPOINTS.reportes.rendimientoAreas, { params })
      .then((r) => r.data),

  getIngresos: (params: PeriodoParams = {}) =>
    apiClient
      .get<IngresosReporteDto>(ENDPOINTS.reportes.ingresos, { params })
      .then((r) => r.data),

  getRotacionInventario: (top?: number) =>
    apiClient
      .get<RotacionInventarioDto[]>(ENDPOINTS.reportes.rotacionInventario, {
        params: top !== undefined ? { top } : undefined,
      })
      .then((r) => r.data),
}
