import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { PagedResponse } from '@/types/common.types'
import type {
  OrdenServicioGeneralDto,
  OrdenServicioAreaDto,
  TrabajoPropuestoDto,
  RepuestoPropuestoDto,
  SeguimientoOrdenAreaDto,
  CreateOrdenServicioAreaRequest,
  ProponerTrabajoRequest,
  ProponerRepuestoRequest,
  AprobarRevisionJefeTallerRequest,
  RechazarRevisionJefeTallerRequest,
  AprobarOrdenAreaRequest,
  RechazarOrdenAreaClienteRequest,
  CompletarOrdenAreaRequest,
  RegistrarSeguimientoRequest,
  ActualizarDiagnosticoRequest,
  ReasignarMecanicoRequest,
} from '@/types/orden.types'
import type { EstadoOrdenGeneral, EstadoOrdenArea } from '@/types/enums'

interface ListGeneralesParams {
  pageNumber?: number
  pageSize?: number
  clienteId?: number
  vehiculoId?: number
  estado?: EstadoOrdenGeneral
  fechaDesde?: string
  fechaHasta?: string
}

// ── Órdenes Generales ─────────────────────────────────────────────────────────

export const ordenesGeneralesService = {
  list: (params: ListGeneralesParams = {}) =>
    apiClient
      .get<PagedResponse<OrdenServicioGeneralDto>>(ENDPOINTS.ordenesGenerales.list, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<OrdenServicioGeneralDto>(ENDPOINTS.ordenesGenerales.byId(id))
      .then((r) => r.data),

  cerrar: (id: number) =>
    apiClient.post(ENDPOINTS.ordenesGenerales.cerrar(id)),

  cancelar: (id: number) =>
    apiClient.patch(ENDPOINTS.ordenesGenerales.cancelar(id)),
}

// ── Órdenes Área ──────────────────────────────────────────────────────────────

export const ordenesAreaService = {
  getById: (id: number) =>
    apiClient
      .get<OrdenServicioAreaDto>(ENDPOINTS.ordenesArea.byId(id))
      .then((r) => r.data),

  misOrdenes: (estado?: EstadoOrdenArea) =>
    apiClient
      .get<OrdenServicioAreaDto[]>(ENDPOINTS.ordenesArea.misOrdenes, {
        params: estado !== undefined ? { estado } : undefined,
      })
      .then((r) => r.data),

  porOrdenGeneral: (ordenId: number, estado?: EstadoOrdenArea, mecanicoId?: number) =>
    apiClient
      .get<OrdenServicioAreaDto[]>(ENDPOINTS.ordenesArea.porOrdenGeneral(ordenId), {
        params: { ...(estado && { estado }), ...(mecanicoId && { mecanicoId }) },
      })
      .then((r) => r.data),

  crear: (ordenGeneralId: number, body: CreateOrdenServicioAreaRequest) =>
    apiClient
      .post<{ id: number }>(ENDPOINTS.ordenesArea.crear(ordenGeneralId), body)
      .then((r) => r.data),

  getTrabajosPropuestos: (id: number) =>
    apiClient
      .get<TrabajoPropuestoDto[]>(ENDPOINTS.ordenesArea.trabajosPropuestos(id))
      .then((r) => r.data),

  getRepuestosPropuestos: (id: number) =>
    apiClient
      .get<RepuestoPropuestoDto[]>(ENDPOINTS.ordenesArea.repuestosPropuestos(id))
      .then((r) => r.data),

  proponerTrabajo: (id: number, body: ProponerTrabajoRequest) =>
    apiClient
      .post<{ id: number }>(ENDPOINTS.ordenesArea.proponerTrabajo(id), body)
      .then((r) => r.data),

  proponerRepuesto: (id: number, body: ProponerRepuestoRequest) =>
    apiClient
      .post<{ id: number }>(ENDPOINTS.ordenesArea.proponerRepuesto(id), body)
      .then((r) => r.data),

  aprobarJefeTaller: (id: number, body: AprobarRevisionJefeTallerRequest) =>
    apiClient.post(ENDPOINTS.ordenesArea.aprobarJefeTaller(id), body),

  rechazarJefeTaller: (id: number, body: RechazarRevisionJefeTallerRequest) =>
    apiClient.post(ENDPOINTS.ordenesArea.rechazarJefeTaller(id), body),

  aprobar: (id: number, body: AprobarOrdenAreaRequest) =>
    apiClient.post(ENDPOINTS.ordenesArea.aprobar(id), body),

  rechazarCliente: (id: number, body: RechazarOrdenAreaClienteRequest) =>
    apiClient.post(ENDPOINTS.ordenesArea.rechazarCliente(id), body),

  completar: (id: number, body: CompletarOrdenAreaRequest) =>
    apiClient.patch(ENDPOINTS.ordenesArea.completar(id), body),

  finalizarDiagnostico: (id: number) =>
    apiClient.patch(ENDPOINTS.ordenesArea.finalizarDiagnostico(id)),

  getSeguimientos: (id: number) =>
    apiClient
      .get<SeguimientoOrdenAreaDto[]>(ENDPOINTS.ordenesArea.seguimientos(id))
      .then((r) => r.data),

  registrarSeguimiento: (id: number, body: RegistrarSeguimientoRequest) =>
    apiClient
      .post<{ id: number }>(ENDPOINTS.ordenesArea.seguimientos(id), body)
      .then((r) => r.data),

  cancelar: (id: number) =>
    apiClient.patch(ENDPOINTS.ordenesArea.cancelar(id)),

  reasignarMecanico: (id: number, body: ReasignarMecanicoRequest) =>
    apiClient.patch(ENDPOINTS.ordenesArea.reasignarMecanico(id), body),

  actualizarDiagnostico: (id: number, body: ActualizarDiagnosticoRequest) =>
    apiClient.patch(ENDPOINTS.ordenesArea.actualizarDiagnostico(id), body),
}
