import { useQuery } from '@tanstack/react-query'
import { catalogosService } from '@/api/services/catalogos.service'

export const CATALOG_KEYS = {
  tiposDocumento: ['catalogos', 'tipos-documento'] as const,
  marcasVehiculo: ['catalogos', 'marcas-vehiculo'] as const,
  modelosVehiculo: (marcaId?: number) => ['catalogos', 'modelos-vehiculo', marcaId] as const,
  areasServicio: ['catalogos', 'areas-servicio'] as const,
  tiposServicio: ['catalogos', 'tipos-servicio'] as const,
  metodosPago: ['catalogos', 'metodos-pago'] as const,
  seccionesInspeccion: ['catalogos', 'secciones-inspeccion'] as const,
}

export function useTiposDocumento() {
  return useQuery({
    queryKey: CATALOG_KEYS.tiposDocumento,
    queryFn: catalogosService.getTiposDocumento,
    staleTime: Infinity,
  })
}

export function useMarcasVehiculo() {
  return useQuery({
    queryKey: CATALOG_KEYS.marcasVehiculo,
    queryFn: catalogosService.getMarcasVehiculo,
    staleTime: Infinity,
  })
}

export function useModelosVehiculo(marcaId?: number) {
  return useQuery({
    queryKey: CATALOG_KEYS.modelosVehiculo(marcaId),
    queryFn: () => catalogosService.getModelosVehiculo(marcaId),
    enabled: marcaId !== undefined && marcaId > 0,
    staleTime: Infinity,
  })
}

export function useAreasServicio() {
  return useQuery({
    queryKey: CATALOG_KEYS.areasServicio,
    queryFn: catalogosService.getAreasServicio,
    staleTime: Infinity,
  })
}

export function useTiposServicio() {
  return useQuery({
    queryKey: CATALOG_KEYS.tiposServicio,
    queryFn: catalogosService.getTiposServicio,
    staleTime: Infinity,
  })
}

export function useMetodosPago() {
  return useQuery({
    queryKey: CATALOG_KEYS.metodosPago,
    queryFn: catalogosService.getMetodosPago,
    staleTime: Infinity,
  })
}

export function useSeccionesInspeccion() {
  return useQuery({
    queryKey: CATALOG_KEYS.seccionesInspeccion,
    queryFn: catalogosService.getSeccionesInspeccion,
    staleTime: Infinity,
  })
}
