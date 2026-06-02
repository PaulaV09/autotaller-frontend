import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Car, Wrench, FileText, LogOut, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { cn, getInitials } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/api/services/auth.service'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const PORTAL_NAV = [
  { label: 'Inicio', href: '/portal/dashboard', icon: LayoutDashboard },
  { label: 'Mis Vehículos', href: '/portal/vehiculos', icon: Car },
  { label: 'Mis Órdenes', href: '/portal/ordenes', icon: Wrench },
  { label: 'Mis Facturas', href: '/portal/facturas', icon: FileText },
]

export function PortalShell() {
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

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top navbar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <Wrench className="size-5 text-primary" />
          <span className="text-sm font-semibold">AutoTaller</span>
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Portal Cliente
          </span>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {PORTAL_NAV.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">
                {getInitials(user?.correo ?? 'C')}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => navigate('/portal/perfil')}>
              <KeyRound className="mr-2 size-4" />
              Cambiar contraseña
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() =>
                toast.promise(handleLogout(), {
                  loading: 'Cerrando sesión...',
                  success: 'Sesión cerrada',
                  error: 'Error',
                })
              }
            >
              <LogOut className="mr-2 size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Mobile bottom nav */}
      <nav className="flex border-t sm:hidden">
        {PORTAL_NAV.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-[10px]',
                isActive ? 'text-primary font-medium' : 'text-muted-foreground',
              )
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}
