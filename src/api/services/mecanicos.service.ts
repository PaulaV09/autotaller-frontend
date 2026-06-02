import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'

export interface MecanicoDto {
  id: number
  nombre: string
  correo: string
  activo: boolean
}

export interface MecanicoAreaDto {
  usuarioId: number
  areaServicioId: number
  nombreArea: string
}

export const mecanicosService = {
  list: () =>
    apiClient.get<MecanicoDto[]>(ENDPOINTS.mecanicos.list).then((r) => r.data),

  getAreas: (mecanicoId: number) =>
    apiClient
      .get<MecanicoAreaDto[]>(ENDPOINTS.mecanicos.areas(mecanicoId))
      .then((r) => r.data),

  asignarArea: (mecanicoId: number, areaId: number) =>
    apiClient.post(ENDPOINTS.mecanicos.asignarArea(mecanicoId, areaId)),

  removerArea: (mecanicoId: number, areaId: number) =>
    apiClient.delete(ENDPOINTS.mecanicos.removerArea(mecanicoId, areaId)),
}
