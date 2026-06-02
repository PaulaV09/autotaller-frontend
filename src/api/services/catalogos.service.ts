import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  TipoDocumento,
  MarcaVehiculo,
  ModeloVehiculo,
  AreaServicio,
  TipoServicio,
  CategoriaRepuesto,
  MetodoPago,
  TipoMovimientoInventario,
  SeccionInspeccion,
  EnumItem,
  CreateAreaServicioRequest,
  CreateTipoServicioRequest,
  CreateMetodoPagoRequest,
  CreateCategoriaRepuestoRequest,
  CreateTipoMovimientoRequest,
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

  getCategoriasRepuesto: () =>
    apiClient
      .get<CategoriaRepuesto[]>(ENDPOINTS.catalogos.categoriasRepuesto)
      .then((r) => r.data),

  getMetodosPago: () =>
    apiClient.get<MetodoPago[]>(ENDPOINTS.catalogos.metodosPago).then((r) => r.data),

  getTiposMovimiento: () =>
    apiClient
      .get<TipoMovimientoInventario[]>(ENDPOINTS.catalogos.tiposMovimiento)
      .then((r) => r.data),

  getTiposCombustible: () =>
    apiClient.get<EnumItem[]>(ENDPOINTS.catalogos.tiposCombustible).then((r) => r.data),

  getTiposTransmision: () =>
    apiClient.get<EnumItem[]>(ENDPOINTS.catalogos.tiposTransmision).then((r) => r.data),

  getZonasInventario: () =>
    apiClient.get<EnumItem[]>(ENDPOINTS.catalogos.zonasInventario).then((r) => r.data),

  getEstadosPagoFactura: () =>
    apiClient.get<EnumItem[]>(ENDPOINTS.catalogos.estadosPagoFactura).then((r) => r.data),

  getEstadosOrdenGeneral: () =>
    apiClient.get<EnumItem[]>(ENDPOINTS.catalogos.estadosOrdenGeneral).then((r) => r.data),

  getEstadosOrdenArea: () =>
    apiClient.get<EnumItem[]>(ENDPOINTS.catalogos.estadosOrdenArea).then((r) => r.data),

  getEstadosOrdenCompra: () =>
    apiClient.get<EnumItem[]>(ENDPOINTS.catalogos.estadosOrdenCompra).then((r) => r.data),

  getSeccionesInspeccion: () =>
    apiClient.get<SeccionInspeccion[]>(ENDPOINTS.catalogos.seccionesInspeccion).then((r) => r.data),

  createAreaServicio: (body: CreateAreaServicioRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.catalogos.areasServicio, body).then((r) => r.data),

  updateAreaServicio: (id: number, body: CreateAreaServicioRequest) =>
    apiClient.put(ENDPOINTS.catalogos.areaServicio(id), body),

  createTipoServicio: (body: CreateTipoServicioRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.catalogos.tiposServicio, body).then((r) => r.data),

  updateTipoServicio: (id: number, body: CreateTipoServicioRequest) =>
    apiClient.put(ENDPOINTS.catalogos.tipoServicio(id), body),

  createMetodoPago: (body: CreateMetodoPagoRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.catalogos.metodosPago, body).then((r) => r.data),

  toggleMetodoPago: (id: number) =>
    apiClient.patch(ENDPOINTS.catalogos.metodoPagoActivar(id)),

  createCategoriaRepuesto: (body: CreateCategoriaRepuestoRequest) =>
    apiClient
      .post<{ id: number }>(ENDPOINTS.catalogos.categoriasRepuesto, body)
      .then((r) => r.data),

  updateCategoriaRepuesto: (id: number, body: CreateCategoriaRepuestoRequest) =>
    apiClient.put(ENDPOINTS.catalogos.categoriaRepuesto(id), body),

  createTipoMovimiento: (body: CreateTipoMovimientoRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.catalogos.tiposMovimiento, body).then((r) => r.data),
}
