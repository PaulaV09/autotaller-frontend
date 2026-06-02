import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getPrimaryRole, ROLE_DASHBOARD } from '@/lib/constants'

export function RoleRedirect() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  const primaryRole = getPrimaryRole(user.roles)
  const dest = primaryRole ? ROLE_DASHBOARD[primaryRole] : '/login'
  return <Navigate to={dest} replace />
}
