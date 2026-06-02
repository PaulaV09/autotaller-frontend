export interface LoginRequest {
  correo: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
  refreshToken: string
  usuarioId: number
  correo: string
  clienteId: number | null
  roles: string[]
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface CambiarPasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface CrearCredencialesClienteRequest {
  password: string
}

export interface UsuarioDto {
  id: number
  nombre: string
  correo: string
  activo: boolean
  clienteId: number | null
  roles: string[]
}

export interface CreateUsuarioRequest {
  nombre: string
  correo: string
  password: string
  rolIds: number[]
}

export interface UpdateUsuarioRequest {
  nombre: string
  correo: string
  activo: boolean
  rolIds: number[]
}

export interface RolDto {
  id: number
  nombre: string
  descripcion: string
}

export interface CreateRolRequest {
  nombre: string
  descripcion?: string | null
}

export type AppRole =
  | 'SuperAdministrador'
  | 'JefeTaller'
  | 'JefeAlmacen'
  | 'JefeBodega'
  | 'Mecanico'
  | 'Recepcionista'
  | 'Cliente'
