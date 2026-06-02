import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { AppRole } from '@/types/auth.types'

interface RoleGuardProps {
  roles: AppRole[]
  children: React.ReactNode
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { hasRole } = useAuth()

  if (!hasRole(...roles)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
