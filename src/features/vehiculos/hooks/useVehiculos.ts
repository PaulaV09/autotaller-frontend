import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vehiculosService } from '@/api/services/vehiculos.service'
import type { UpdateVehiculoRequest } from '@/types/vehiculo.types'

export const VEHICULOS_KEYS = {
  all: ['vehiculos'] as const,
  list: (params: object) => ['vehiculos', 'list', params] as const,
  detail: (id: number) => ['vehiculos', id] as const,
  propietarios: (id: number) => ['vehiculos', id, 'propietarios'] as const,
  historial: (id: number) => ['vehiculos', id, 'historial'] as const,
}

export function useVehiculosList(params: { pageNumber: number; pageSize: number; vin?: string; clienteId?: number }) {
  return useQuery({
    queryKey: VEHICULOS_KEYS.list(params),
    queryFn: () => vehiculosService.list(params),
  })
}

export function useVehiculo(id: number) {
  return useQuery({
    queryKey: VEHICULOS_KEYS.detail(id),
    queryFn: () => vehiculosService.getById(id),
    enabled: id > 0,
  })
}

export function useVehiculoPropietarios(id: number) {
  return useQuery({
    queryKey: VEHICULOS_KEYS.propietarios(id),
    queryFn: () => vehiculosService.getPropietarios(id),
    enabled: id > 0,
  })
}

export function useVehiculoHistorial(id: number) {
  return useQuery({
    queryKey: VEHICULOS_KEYS.historial(id),
    queryFn: () => vehiculosService.getHistorial(id),
    enabled: id > 0,
  })
}

export function useUpdateVehiculo(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateVehiculoRequest) => vehiculosService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VEHICULOS_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: VEHICULOS_KEYS.all })
    },
  })
}

export function useCambiarPropietario(vehiculoId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nuevoClienteId: number) =>
      vehiculosService.cambiarPropietario(vehiculoId, nuevoClienteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VEHICULOS_KEYS.detail(vehiculoId) })
      qc.invalidateQueries({ queryKey: VEHICULOS_KEYS.propietarios(vehiculoId) })
      qc.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}
