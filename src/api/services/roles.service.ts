import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { CreateRolRequest, RolDto } from '@/types/auth.types'

export const rolesService = {
  list: () =>
    apiClient.get<RolDto[]>(ENDPOINTS.roles.list).then((r) => r.data),

  create: (body: CreateRolRequest) =>
    apiClient.post<RolDto>(ENDPOINTS.roles.list, body).then((r) => r.data),

  update: (id: number, body: CreateRolRequest) =>
    apiClient.put(ENDPOINTS.roles.byId(id), body),
}
