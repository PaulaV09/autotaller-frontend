import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inspeccionesService } from '@/api/services/inspecciones.service'
import type { CreateInspeccionRequest, CrearOrdenDesdeInspeccionRequest } from '@/types/inspeccion.types'
import type { EstadoInspeccion } from '@/types/enums'

export const INSPECCIONES_KEYS = {
  all: ['inspecciones'] as const,
  list: (params: object) => ['inspecciones', 'list', params] as const,
  detail: (id: number) => ['inspecciones', id] as const,
  detalles: (id: number) => ['inspecciones', id, 'detalles'] as const,
  evidencias: (id: number) => ['inspecciones', id, 'evidencias'] as const,
}

export function useInspeccionesList(params: {
  pageNumber: number
  pageSize: number
  vehiculoId?: number
  clienteId?: number
  estado?: EstadoInspeccion
}) {
  return useQuery({
    queryKey: INSPECCIONES_KEYS.list(params),
    queryFn: () => inspeccionesService.list(params),
  })
}

export function useInspeccion(id: number) {
  return useQuery({
    queryKey: INSPECCIONES_KEYS.detail(id),
    queryFn: () => inspeccionesService.getById(id),
    enabled: id > 0,
  })
}

export function useInspeccionDetalles(id: number) {
  return useQuery({
    queryKey: INSPECCIONES_KEYS.detalles(id),
    queryFn: () => inspeccionesService.getDetalles(id),
    enabled: id > 0,
  })
}

export function useInspeccionEvidencias(id: number) {
  return useQuery({
    queryKey: INSPECCIONES_KEYS.evidencias(id),
    queryFn: () => inspeccionesService.getEvidencias(id),
    enabled: id > 0,
  })
}

export function useCreateInspeccion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateInspeccionRequest) => inspeccionesService.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: INSPECCIONES_KEYS.all }),
  })
}

export function useCrearOrdenDesdeInspeccion(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CrearOrdenDesdeInspeccionRequest) =>
      inspeccionesService.crearOrden(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSPECCIONES_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: ['ordenes'] })
    },
  })
}
