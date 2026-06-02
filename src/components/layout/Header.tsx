import { LogOut, User, KeyRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/api/services/auth.service'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { user, clearAuth } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await authService.logout()
    } catch {
      // limpiamos localmente de todas formas
    } finally {
      clearAuth()
      navigate('/login', { replace: true })
    }
  }

  if (!user) return null

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div />

      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">
              {getInitials(user.correo)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:block">{user.correo}</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate('/perfil')}>
            <User className="mr-2 size-4" />
            Mi perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/perfil/password')}>
            <KeyRound className="mr-2 size-4" />
            Cambiar contraseña
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              toast.promise(handleLogout(), {
                loading: 'Cerrando sesión...',
                success: 'Sesión cerrada',
                error: 'Error al cerrar sesión',
              })
            }}
          >
            <LogOut className="mr-2 size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
