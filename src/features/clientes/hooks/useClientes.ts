import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientesService } from '@/api/services/clientes.service'
import type { UpdateClienteRequest } from '@/types/cliente.types'
import type { RegistrarClienteConVehiculoRequest } from '@/types/vehiculo.types'

export const CLIENTES_KEYS = {
  all: ['clientes'] as const,
  list: (params: object) => ['clientes', 'list', params] as const,
  detail: (id: number) => ['clientes', id] as const,
  vehiculos: (id: number) => ['clientes', id, 'vehiculos'] as const,
  ordenes: (id: number) => ['clientes', id, 'ordenes'] as const,
  facturas: (id: number) => ['clientes', id, 'facturas'] as const,
  estadisticas: (id: number) => ['clientes', id, 'estadisticas'] as const,
}

export function useClientesList(params: { pageNumber: number; pageSize: number; nombre?: string; correo?: string }) {
  return useQuery({
    queryKey: CLIENTES_KEYS.list(params),
    queryFn: () => clientesService.list(params),
  })
}

export function useCliente(id: number) {
  return useQuery({
    queryKey: CLIENTES_KEYS.detail(id),
    queryFn: () => clientesService.getById(id),
    enabled: id > 0,
  })
}

export function useClienteVehiculos(id: number) {
  return useQuery({
    queryKey: CLIENTES_KEYS.vehiculos(id),
    queryFn: () => clientesService.getVehiculos(id),
    enabled: id > 0,
  })
}

export function useClienteOrdenes(id: number) {
  return useQuery({
    queryKey: CLIENTES_KEYS.ordenes(id),
    queryFn: () => clientesService.getOrdenes(id),
    enabled: id > 0,
  })
}

export function useClienteFacturas(id: number) {
  return useQuery({
    queryKey: CLIENTES_KEYS.facturas(id),
    queryFn: () => clientesService.getFacturas(id),
    enabled: id > 0,
  })
}

export function useClienteEstadisticas(id: number) {
  return useQuery({
    queryKey: CLIENTES_KEYS.estadisticas(id),
    queryFn: () => clientesService.getEstadisticas(id),
    enabled: id > 0,
  })
}

export function useRegistrarCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: RegistrarClienteConVehiculoRequest) =>
      clientesService.registrarConVehiculos(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLIENTES_KEYS.all })
    },
  })
}

export function useUpdateCliente(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateClienteRequest) => clientesService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLIENTES_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: CLIENTES_KEYS.all })
    },
  })
}

export function useDeleteCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => clientesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLIENTES_KEYS.all })
    },
  })
}
