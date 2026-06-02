import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  CreateUsuarioRequest,
  CrearCredencialesClienteRequest,
  UpdateUsuarioRequest,
  UsuarioDto,
} from '@/types/auth.types'

export const usuariosService = {
  list: () =>
    apiClient.get<UsuarioDto[]>(ENDPOINTS.usuarios.list).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<UsuarioDto>(ENDPOINTS.usuarios.byId(id)).then((r) => r.data),

  create: (body: CreateUsuarioRequest) =>
    apiClient.post<{ id: number }>(ENDPOINTS.usuarios.list, body).then((r) => r.data),

  update: (id: number, body: UpdateUsuarioRequest) =>
    apiClient.put(ENDPOINTS.usuarios.byId(id), body),

  delete: (id: number) =>
    apiClient.delete(ENDPOINTS.usuarios.byId(id)),

  crearCredencialesCliente: (clienteId: number, body: CrearCredencialesClienteRequest) =>
    apiClient
      .post<{ id: number }>(ENDPOINTS.usuarios.crearCredencialesCliente(clienteId), body)
      .then((r) => r.data),
}
