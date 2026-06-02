import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleGuard } from './RoleGuard'
import { AppShell } from '@/components/layout/AppShell'
import { PortalShell } from '@/components/layout/PortalShell'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPlaceholder } from '@/features/dashboard/pages/DashboardPlaceholder'
import { PortalDashboardPlaceholder } from '@/features/portal/pages/PortalDashboardPlaceholder'
import { RoleRedirect } from './RoleRedirect'
// Phase 2 — Clientes
import { ClientesListPage } from '@/features/clientes/pages/ClientesListPage'
import { ClienteFormPage } from '@/features/clientes/pages/ClienteFormPage'
import { ClienteDetallePage } from '@/features/clientes/pages/ClienteDetallePage'
import { ClienteEditPage } from '@/features/clientes/pages/ClienteEditPage'
// Phase 2 — Vehículos
import { VehiculosListPage } from '@/features/vehiculos/pages/VehiculosListPage'
import { VehiculoDetallePage } from '@/features/vehiculos/pages/VehiculoDetallePage'
import { VehiculoEditPage } from '@/features/vehiculos/pages/VehiculoEditPage'
// Phase 3 — Inspecciones
import { InspeccionesListPage } from '@/features/inspecciones/pages/InspeccionesListPage'
import { InspeccionFormPage } from '@/features/inspecciones/pages/InspeccionFormPage'
import { InspeccionDetallePage } from '@/features/inspecciones/pages/InspeccionDetallePage'
// Phase 3 — Órdenes
import { OrdenesListPage } from '@/features/ordenes/pages/OrdenesListPage'
import { OrdenDetallePage } from '@/features/ordenes/pages/OrdenDetallePage'
import { OrdenAreaDetallePage } from '@/features/ordenes/pages/OrdenAreaDetallePage'
// Phase 3 — Mecánicos
import { MecanicosPage } from '@/features/mecanicos/pages/MecanicosPage'
import { MecanicoMisOrdenesPage } from '@/features/mecanicos/pages/MecanicoMisOrdenesPage'
// Phase 3 — Dashboards reales
import { JefeTallerDashboard } from '@/features/dashboard/pages/JefeTallerDashboard'

function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      <p className="text-4xl font-bold">404</p>
      <p className="text-muted-foreground">Página no encontrada</p>
    </div>
  )
}

function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <p className="text-4xl font-bold">403</p>
      <p className="text-muted-foreground">No tienes permiso para acceder a esta sección</p>
    </div>
  )
}

export const router = createBrowserRouter([
  // Públicas
  { path: '/login', element: <LoginPage /> },
  { path: '/403', element: <ForbiddenPage /> },

  // Rutas protegidas — AppShell (todos los roles admin)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          // Redirect raíz según rol
          { index: true, element: <RoleRedirect /> },

          // ── Recepcionista ──────────────────────────────────────────────
          {
            path: 'recepcion/dashboard',
            element: (
              <RoleGuard roles={['Recepcionista', 'SuperAdministrador']}>
                <DashboardPlaceholder role="Panel Recepcionista" description="Gestión de clientes, vehículos y pagos." />
              </RoleGuard>
            ),
          },
          {
            path: 'recepcion/clientes',
            element: <RoleGuard roles={['Recepcionista', 'SuperAdministrador']}><ClientesListPage basePath="/recepcion" /></RoleGuard>,
          },
          {
            path: 'recepcion/clientes/nuevo',
            element: <RoleGuard roles={['Recepcionista', 'SuperAdministrador']}><ClienteFormPage basePath="/recepcion" /></RoleGuard>,
          },
          {
            path: 'recepcion/clientes/:id',
            element: <RoleGuard roles={['Recepcionista', 'SuperAdministrador']}><ClienteDetallePage basePath="/recepcion" /></RoleGuard>,
          },
          {
            path: 'recepcion/clientes/:id/editar',
            element: <RoleGuard roles={['Recepcionista', 'SuperAdministrador']}><ClienteEditPage basePath="/recepcion" /></RoleGuard>,
          },
          {
            path: 'recepcion/vehiculos',
            element: <RoleGuard roles={['Recepcionista', 'SuperAdministrador']}><VehiculosListPage basePath="/recepcion" /></RoleGuard>,
          },
          {
            path: 'recepcion/vehiculos/:id',
            element: <RoleGuard roles={['Recepcionista', 'SuperAdministrador']}><VehiculoDetallePage basePath="/recepcion" /></RoleGuard>,
          },
          {
            path: 'recepcion/vehiculos/:id/editar',
            element: <RoleGuard roles={['Recepcionista', 'SuperAdministrador']}><VehiculoEditPage basePath="/recepcion" /></RoleGuard>,
          },
          {
            path: 'recepcion/facturas',
            element: (
              <RoleGuard roles={['Recepcionista', 'SuperAdministrador']}>
                <DashboardPlaceholder role="Facturas" description="Facturas y registro de pagos." />
              </RoleGuard>
            ),
          },

          // ── Jefe de Taller ─────────────────────────────────────────────
          {
            path: 'taller/dashboard',
            element: (
              <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}>
                <JefeTallerDashboard />
              </RoleGuard>
            ),
          },
          {
            path: 'taller/clientes',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><ClientesListPage basePath="/taller" /></RoleGuard>,
          },
          {
            path: 'taller/clientes/:id',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><ClienteDetallePage basePath="/taller" /></RoleGuard>,
          },
          {
            path: 'taller/clientes/:id/editar',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><ClienteEditPage basePath="/taller" /></RoleGuard>,
          },
          {
            path: 'taller/vehiculos/:id',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><VehiculoDetallePage basePath="/taller" /></RoleGuard>,
          },
          {
            path: 'taller/inspecciones',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><InspeccionesListPage basePath="/taller" /></RoleGuard>,
          },
          {
            path: 'taller/inspecciones/nueva',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><InspeccionFormPage basePath="/taller" /></RoleGuard>,
          },
          {
            path: 'taller/inspecciones/:id',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><InspeccionDetallePage basePath="/taller" /></RoleGuard>,
          },
          {
            path: 'taller/ordenes',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador', 'Recepcionista']}><OrdenesListPage basePath="/taller" /></RoleGuard>,
          },
          {
            path: 'taller/ordenes/:id',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador', 'Recepcionista']}><OrdenDetallePage basePath="/taller" /></RoleGuard>,
          },
          {
            path: 'taller/ordenes-area/:id',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador', 'Recepcionista']}><OrdenAreaDetallePage backPath="/taller/ordenes" /></RoleGuard>,
          },
          {
            path: 'taller/mecanicos',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><MecanicosPage /></RoleGuard>,
          },
          {
            path: 'taller/facturas',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><DashboardPlaceholder role="Facturas" description="Facturas generadas." /></RoleGuard>,
          },
          {
            path: 'taller/reportes',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><DashboardPlaceholder role="Reportes" description="Productividad y rendimiento." /></RoleGuard>,
          },

          // ── Mecánico ───────────────────────────────────────────────────
          {
            path: 'mecanico/dashboard',
            element: (
              <RoleGuard roles={['Mecanico', 'SuperAdministrador']}>
                <DashboardPlaceholder
                  role="Panel Mecánico"
                  description="Mis órdenes asignadas."
                />
              </RoleGuard>
            ),
          },
          {
            path: 'mecanico/mis-ordenes',
            element: (
              <RoleGuard roles={['Mecanico', 'SuperAdministrador']}>
                <MecanicoMisOrdenesPage />
              </RoleGuard>
            ),
          },

          // ── Jefe de Almacén ────────────────────────────────────────────
          {
            path: 'almacen/dashboard',
            element: (
              <RoleGuard roles={['JefeAlmacen', 'SuperAdministrador']}>
                <DashboardPlaceholder
                  role="Panel Jefe de Almacén"
                  description="Solicitudes de repuestos e inventario de almacén."
                />
              </RoleGuard>
            ),
          },
          {
            path: 'almacen/solicitudes',
            element: (
              <RoleGuard roles={['JefeAlmacen', 'SuperAdministrador']}>
                <DashboardPlaceholder role="Solicitudes" description="Solicitudes de repuestos." />
              </RoleGuard>
            ),
          },
          {
            path: 'almacen/inventario',
            element: (
              <RoleGuard roles={['JefeAlmacen', 'SuperAdministrador']}>
                <DashboardPlaceholder role="Inventario Almacén" description="Stock de almacén." />
              </RoleGuard>
            ),
          },

          // ── Jefe de Bodega ─────────────────────────────────────────────
          {
            path: 'bodega/dashboard',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <DashboardPlaceholder
                  role="Panel Jefe de Bodega"
                  description="Inventario principal, compras y proveedores."
                />
              </RoleGuard>
            ),
          },
          {
            path: 'bodega/inventario',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <DashboardPlaceholder role="Inventario Bodega" description="Stock de bodega." />
              </RoleGuard>
            ),
          },
          {
            path: 'bodega/solicitudes',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <DashboardPlaceholder role="Solicitudes" description="Solicitudes de almacén." />
              </RoleGuard>
            ),
          },
          {
            path: 'bodega/ordenes-compra',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <DashboardPlaceholder role="Órdenes de Compra" description="Compras a proveedores." />
              </RoleGuard>
            ),
          },
          {
            path: 'bodega/proveedores',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <DashboardPlaceholder role="Proveedores" description="Gestión de proveedores." />
              </RoleGuard>
            ),
          },

          // ── Super Administrador ────────────────────────────────────────
          {
            path: 'admin/dashboard',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder
                  role="Panel Administrador"
                  description="Control total del sistema."
                />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/usuarios',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Usuarios" description="Gestión de usuarios y roles." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/clientes',
            element: <RoleGuard roles={['SuperAdministrador']}><ClientesListPage basePath="/admin" /></RoleGuard>,
          },
          {
            path: 'admin/clientes/nuevo',
            element: <RoleGuard roles={['SuperAdministrador']}><ClienteFormPage basePath="/admin" /></RoleGuard>,
          },
          {
            path: 'admin/clientes/:id',
            element: <RoleGuard roles={['SuperAdministrador']}><ClienteDetallePage basePath="/admin" /></RoleGuard>,
          },
          {
            path: 'admin/clientes/:id/editar',
            element: <RoleGuard roles={['SuperAdministrador']}><ClienteEditPage basePath="/admin" /></RoleGuard>,
          },
          {
            path: 'admin/vehiculos',
            element: <RoleGuard roles={['SuperAdministrador']}><VehiculosListPage basePath="/admin" /></RoleGuard>,
          },
          {
            path: 'admin/vehiculos/:id',
            element: <RoleGuard roles={['SuperAdministrador']}><VehiculoDetallePage basePath="/admin" /></RoleGuard>,
          },
          {
            path: 'admin/vehiculos/:id/editar',
            element: <RoleGuard roles={['SuperAdministrador']}><VehiculoEditPage basePath="/admin" /></RoleGuard>,
          },
          {
            path: 'admin/inspecciones',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Inspecciones" description="Todas las inspecciones." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/ordenes',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Órdenes" description="Todas las órdenes." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/repuestos',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Repuestos" description="Catálogo de repuestos." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/inventario',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Inventario" description="Inventario global." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/proveedores',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Proveedores" description="Todos los proveedores." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/facturas',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Facturas" description="Todas las facturas." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/reportes',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Reportes" description="Dashboard ejecutivo y reportes." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/catalogos',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Catálogos" description="Áreas, tipos de servicio, categorías." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/configuracion',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Configuración" description="Parámetros del taller." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/auditorias',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <DashboardPlaceholder role="Auditorías" description="Registro de cambios del sistema." />
              </RoleGuard>
            ),
          },

          // 404 dentro del shell
          { path: '*', element: <PageNotFound /> },
        ],
      },

      // ── Portal Cliente (layout separado) ───────────────────────────────
      {
        path: 'portal',
        element: (
          <RoleGuard roles={['Cliente']}>
            <PortalShell />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <PortalDashboardPlaceholder /> },
          {
            path: 'vehiculos',
            element: <DashboardPlaceholder role="Mis Vehículos" description="Vehículos registrados." />,
          },
          {
            path: 'ordenes',
            element: <DashboardPlaceholder role="Mis Órdenes" description="Órdenes activas e historial." />,
          },
          {
            path: 'facturas',
            element: <DashboardPlaceholder role="Mis Facturas" description="Facturas y pagos." />,
          },
          {
            path: 'perfil',
            element: <DashboardPlaceholder role="Mi Perfil" description="Cambiar contraseña." />,
          },
        ],
      },
    ],
  },

  // Ruta raíz sin ProtectedRoute redirige al login
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
