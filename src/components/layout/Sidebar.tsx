import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useUiStore } from '@/store/ui.store'
import { NAV_BY_ROLE } from './navConfig'
import type { AppRole } from '@/types/auth.types'

const ROLE_LABEL: Record<AppRole, string> = {
  SuperAdministrador: 'Super Admin',
  JefeTaller: 'Jefe de Taller',
  JefeAlmacen: 'Jefe de Almacén',
  JefeBodega: 'Jefe de Bodega',
  Mecanico: 'Mecánico',
  Recepcionista: 'Recepcionista',
  Cliente: 'Cliente',
}

export function Sidebar() {
  const { primaryRole } = useAuth()
  const { sidebarCollapsed, toggleSidebar } = useUiStore()

  const items = primaryRole ? NAV_BY_ROLE[primaryRole] ?? [] : []

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-sidebar transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Wrench className="size-6 shrink-0 text-primary" />
        {!sidebarCollapsed && (
          <span className="ml-3 truncate text-sm font-semibold tracking-tight">
            AutoTaller
          </span>
        )}
      </div>

      {/* Role badge */}
      {!sidebarCollapsed && primaryRole && (
        <div className="px-4 py-2">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {ROLE_LABEL[primaryRole]}
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {items.map((item) =>
          sidebarCollapsed ? (
            <NavLink
              key={item.href}
              to={item.href}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'flex h-10 w-full items-center justify-center rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <item.icon className="size-5" />
            </NavLink>
          ) : (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ),
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t p-2">
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          className="flex h-10 w-full items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
