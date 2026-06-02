import { useAuthStore } from '@/store/auth.store'
import type { AppRole } from '@/types/auth.types'

export function useAuth() {
  const store = useAuthStore()

  function hasRole(...roles: AppRole[]): boolean {
    if (!store.user) return false
    return roles.some((r) => store.user!.roles.includes(r))
  }

  function isAdmin(): boolean {
    return hasRole('SuperAdministrador')
  }

  const primaryRole = store.user?.roles[0] ?? null

  return { ...store, hasRole, isAdmin, primaryRole }
}
