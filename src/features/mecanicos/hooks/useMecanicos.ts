import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mecanicosService } from '@/api/services/mecanicos.service'

const KEYS = {
  all: ['mecanicos'] as const,
  areas: (id: number) => ['mecanicos', id, 'areas'] as const,
}

export function useMecanicos() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: mecanicosService.list,
    staleTime: 30_000,
  })
}

export function useMecanicoAreas(mecanicoId: number) {
  return useQuery({
    queryKey: KEYS.areas(mecanicoId),
    queryFn: () => mecanicosService.getAreas(mecanicoId),
    enabled: mecanicoId > 0,
  })
}

export function useAsignarArea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ mecanicoId, areaId }: { mecanicoId: number; areaId: number }) =>
      mecanicosService.asignarArea(mecanicoId, areaId),
    onSuccess: (_, { mecanicoId }) =>
      qc.invalidateQueries({ queryKey: KEYS.areas(mecanicoId) }),
  })
}

export function useRemoverArea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ mecanicoId, areaId }: { mecanicoId: number; areaId: number }) =>
      mecanicosService.removerArea(mecanicoId, areaId),
    onSuccess: (_, { mecanicoId }) =>
      qc.invalidateQueries({ queryKey: KEYS.areas(mecanicoId) }),
  })
}
