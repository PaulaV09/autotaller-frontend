import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordenesGeneralesService, ordenesAreaService } from '@/api/services/ordenes.service'
import type {
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

export const ORDENES_KEYS = {
  all: ['ordenes'] as const,
  generales: {
    list: (params: object) => ['ordenes', 'generales', 'list', params] as const,
    detail: (id: number) => ['ordenes', 'generales', id] as const,
  },
  areas: {
    byId: (id: number) => ['ordenes', 'area', id] as const,
    porOrden: (ordenId: number) => ['ordenes', 'area', 'por-orden', ordenId] as const,
    misOrdenes: (estado?: EstadoOrdenArea) => ['ordenes', 'area', 'mis-ordenes', estado] as const,
    trabajos: (id: number) => ['ordenes', 'area', id, 'trabajos'] as const,
    repuestos: (id: number) => ['ordenes', 'area', id, 'repuestos'] as const,
    seguimientos: (id: number) => ['ordenes', 'area', id, 'seguimientos'] as const,
  },
}

// ── Generales ─────────────────────────────────────────────────────────────────

export function useOrdenesGeneralesList(params: {
  pageNumber: number
  pageSize: number
  clienteId?: number
  vehiculoId?: number
  estado?: EstadoOrdenGeneral
}) {
  return useQuery({
    queryKey: ORDENES_KEYS.generales.list(params),
    queryFn: () => ordenesGeneralesService.list(params),
  })
}

export function useOrdenGeneral(id: number) {
  return useQuery({
    queryKey: ORDENES_KEYS.generales.detail(id),
    queryFn: () => ordenesGeneralesService.getById(id),
    enabled: id > 0,
  })
}

export function useCerrarOrden(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => ordenesGeneralesService.cerrar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDENES_KEYS.generales.detail(id) }),
  })
}

export function useCancelarOrdenGeneral(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => ordenesGeneralesService.cancelar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDENES_KEYS.generales.detail(id) }),
  })
}

// ── Áreas ─────────────────────────────────────────────────────────────────────

export function useOrdenArea(id: number) {
  return useQuery({
    queryKey: ORDENES_KEYS.areas.byId(id),
    queryFn: () => ordenesAreaService.getById(id),
    enabled: id > 0,
  })
}

export function useMisOrdenes(estado?: EstadoOrdenArea) {
  return useQuery({
    queryKey: ORDENES_KEYS.areas.misOrdenes(estado),
    queryFn: () => ordenesAreaService.misOrdenes(estado),
  })
}

export function useAreasOrden(ordenId: number) {
  return useQuery({
    queryKey: ORDENES_KEYS.areas.porOrden(ordenId),
    queryFn: () => ordenesAreaService.porOrdenGeneral(ordenId),
    enabled: ordenId > 0,
  })
}

export function useTrabajosPropuestos(areaId: number) {
  return useQuery({
    queryKey: ORDENES_KEYS.areas.trabajos(areaId),
    queryFn: () => ordenesAreaService.getTrabajosPropuestos(areaId),
    enabled: areaId > 0,
  })
}

export function useRepuestosPropuestos(areaId: number) {
  return useQuery({
    queryKey: ORDENES_KEYS.areas.repuestos(areaId),
    queryFn: () => ordenesAreaService.getRepuestosPropuestos(areaId),
    enabled: areaId > 0,
  })
}

export function useSeguimientosArea(areaId: number) {
  return useQuery({
    queryKey: ORDENES_KEYS.areas.seguimientos(areaId),
    queryFn: () => ordenesAreaService.getSeguimientos(areaId),
    enabled: areaId > 0,
  })
}

function invalidateArea(qc: ReturnType<typeof useQueryClient>, id: number) {
  qc.invalidateQueries({ queryKey: ORDENES_KEYS.areas.byId(id) })
}

export function useCrearOrdenArea(ordenGeneralId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateOrdenServicioAreaRequest) =>
      ordenesAreaService.crear(ordenGeneralId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDENES_KEYS.areas.porOrden(ordenGeneralId) })
    },
  })
}

export function useProponerTrabajo(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ProponerTrabajoRequest) =>
      ordenesAreaService.proponerTrabajo(areaId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDENES_KEYS.areas.trabajos(areaId) }),
  })
}

export function useProponerRepuesto(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ProponerRepuestoRequest) =>
      ordenesAreaService.proponerRepuesto(areaId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDENES_KEYS.areas.repuestos(areaId) }),
  })
}

export function useAprobarJefeTaller(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AprobarRevisionJefeTallerRequest) =>
      ordenesAreaService.aprobarJefeTaller(areaId, body),
    onSuccess: () => invalidateArea(qc, areaId),
  })
}

export function useRechazarJefeTaller(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: RechazarRevisionJefeTallerRequest) =>
      ordenesAreaService.rechazarJefeTaller(areaId, body),
    onSuccess: () => invalidateArea(qc, areaId),
  })
}

export function useAprobarCliente(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AprobarOrdenAreaRequest) =>
      ordenesAreaService.aprobar(areaId, body),
    onSuccess: () => invalidateArea(qc, areaId),
  })
}

export function useRechazarCliente(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: RechazarOrdenAreaClienteRequest) =>
      ordenesAreaService.rechazarCliente(areaId, body),
    onSuccess: () => invalidateArea(qc, areaId),
  })
}

export function useCompletarOrdenArea(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CompletarOrdenAreaRequest) =>
      ordenesAreaService.completar(areaId, body),
    onSuccess: () => invalidateArea(qc, areaId),
  })
}

export function useFinalizarDiagnostico(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => ordenesAreaService.finalizarDiagnostico(areaId),
    onSuccess: () => invalidateArea(qc, areaId),
  })
}

export function useRegistrarSeguimiento(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: RegistrarSeguimientoRequest) =>
      ordenesAreaService.registrarSeguimiento(areaId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDENES_KEYS.areas.seguimientos(areaId) }),
  })
}

export function useCancelarOrdenArea(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => ordenesAreaService.cancelar(areaId),
    onSuccess: () => invalidateArea(qc, areaId),
  })
}

export function useReasignarMecanico(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ReasignarMecanicoRequest) =>
      ordenesAreaService.reasignarMecanico(areaId, body),
    onSuccess: () => invalidateArea(qc, areaId),
  })
}

export function useActualizarDiagnostico(areaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ActualizarDiagnosticoRequest) =>
      ordenesAreaService.actualizarDiagnostico(areaId, body),
    onSuccess: () => invalidateArea(qc, areaId),
  })
}
