import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleGuard } from './RoleGuard'
import { ForbiddenPage, PageNotFound } from './RouteStatusPages'
import { AppShell } from '@/components/layout/AppShell'
import { PortalShell } from '@/components/layout/PortalShell'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RoleRedirect } from './RoleRedirect'
import {
  AuditoriasPage,
  CatalogosPage,
  ConfiguracionPage,
  FacturasPage,
  InventarioSolicitudesPage,
  OperationalDashboardPage,
  OrdenesCompraPage,
  PortalDashboardPage,
  PortalFacturasPage,
  PortalOrdenDetallePage,
  PortalOrdenesPage,
  PortalPerfilPage,
  PortalVehiculosPage,
  ProveedoresPage,
  ReportesPage,
  RepuestosPage,
  UsuariosPage,
} from '@/features/operaciones/pages/OperationalPages'
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
                <OperationalDashboardPage title="Panel Recepcionista" description="Gestión de clientes, vehículos y pagos." />
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
                <FacturasPage />
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
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><FacturasPage /></RoleGuard>,
          },
          {
            path: 'taller/reportes',
            element: <RoleGuard roles={['JefeTaller', 'SuperAdministrador']}><ReportesPage /></RoleGuard>,
          },

          // ── Mecánico ───────────────────────────────────────────────────
          {
            path: 'mecanico/dashboard',
            element: (
              <RoleGuard roles={['Mecanico', 'SuperAdministrador']}>
                <MecanicoMisOrdenesPage />
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
                <OperationalDashboardPage title="Panel Jefe de Almacén" description="Solicitudes de repuestos e inventario de almacén." />
              </RoleGuard>
            ),
          },
          {
            path: 'almacen/solicitudes',
            element: (
              <RoleGuard roles={['JefeAlmacen', 'SuperAdministrador']}>
                <InventarioSolicitudesPage />
              </RoleGuard>
            ),
          },
          {
            path: 'almacen/inventario',
            element: (
              <RoleGuard roles={['JefeAlmacen', 'SuperAdministrador']}>
                <RepuestosPage />
              </RoleGuard>
            ),
          },

          // ── Jefe de Bodega ─────────────────────────────────────────────
          {
            path: 'bodega/dashboard',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <OperationalDashboardPage title="Panel Jefe de Bodega" description="Inventario principal, compras y proveedores." />
              </RoleGuard>
            ),
          },
          {
            path: 'bodega/inventario',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <RepuestosPage />
              </RoleGuard>
            ),
          },
          {
            path: 'bodega/solicitudes',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <InventarioSolicitudesPage />
              </RoleGuard>
            ),
          },
          {
            path: 'bodega/ordenes-compra',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <OrdenesCompraPage />
              </RoleGuard>
            ),
          },
          {
            path: 'bodega/proveedores',
            element: (
              <RoleGuard roles={['JefeBodega', 'SuperAdministrador']}>
                <ProveedoresPage />
              </RoleGuard>
            ),
          },

          // ── Super Administrador ────────────────────────────────────────
          {
            path: 'admin/dashboard',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <OperationalDashboardPage title="Panel Administrador" description="Control total del sistema." />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/usuarios',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <UsuariosPage />
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
                <InspeccionesListPage basePath="/admin" />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/ordenes',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <OrdenesListPage basePath="/admin" />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/repuestos',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <RepuestosPage />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/inventario',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <RepuestosPage />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/proveedores',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <ProveedoresPage />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/facturas',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <FacturasPage />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/reportes',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <ReportesPage />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/catalogos',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <CatalogosPage />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/configuracion',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <ConfiguracionPage />
              </RoleGuard>
            ),
          },
          {
            path: 'admin/auditorias',
            element: (
              <RoleGuard roles={['SuperAdministrador']}>
                <AuditoriasPage />
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
          { path: 'dashboard', element: <PortalDashboardPage /> },
          {
            path: 'vehiculos',
            element: <PortalVehiculosPage />,
          },
          {
            path: 'ordenes',
            element: <PortalOrdenesPage />,
          },
          {
            path: 'ordenes/:id',
            element: <PortalOrdenDetallePage />,
          },
          {
            path: 'facturas',
            element: <PortalFacturasPage />,
          },
          {
            path: 'perfil',
            element: <PortalPerfilPage />,
          },
        ],
      },
    ],
  },

  // Ruta raíz sin ProtectedRoute redirige al login
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
