import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROLE_DASHBOARD } from '@/lib/constants'
import type { AppRole } from '@/types/auth.types'

export function RoleRedirect() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  const primaryRole = user.roles[0] as AppRole
  const dest = ROLE_DASHBOARD[primaryRole] ?? '/login'
  return <Navigate to={dest} replace />
}
