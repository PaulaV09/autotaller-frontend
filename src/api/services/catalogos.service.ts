import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  TipoDocumento,
  MarcaVehiculo,
  ModeloVehiculo,
  AreaServicio,
  TipoServicio,
  MetodoPago,
  SeccionInspeccion,
} from '@/types/catalogo.types'

export const catalogosService = {
  getTiposDocumento: () =>
    apiClient.get<TipoDocumento[]>(ENDPOINTS.catalogos.tiposDocumento).then((r) => r.data),

  getMarcasVehiculo: () =>
    apiClient.get<MarcaVehiculo[]>(ENDPOINTS.catalogos.marcasVehiculo).then((r) => r.data),

  getModelosVehiculo: (marcaId?: number) =>
    apiClient
      .get<ModeloVehiculo[]>(ENDPOINTS.catalogos.modelosVehiculo, {
        params: marcaId ? { marcaId } : undefined,
      })
      .then((r) => r.data),

  getAreasServicio: () =>
    apiClient.get<AreaServicio[]>(ENDPOINTS.catalogos.areasServicio).then((r) => r.data),

  getTiposServicio: () =>
    apiClient.get<TipoServicio[]>(ENDPOINTS.catalogos.tiposServicio).then((r) => r.data),

  getMetodosPago: () =>
    apiClient.get<MetodoPago[]>(ENDPOINTS.catalogos.metodosPago).then((r) => r.data),

  getSeccionesInspeccion: () =>
    apiClient.get<SeccionInspeccion[]>(ENDPOINTS.catalogos.seccionesInspeccion).then((r) => r.data),
}
