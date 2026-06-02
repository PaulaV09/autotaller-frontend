import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  Wrench,
  Package,
  Boxes,
  ShoppingCart,
  Truck,
  FileText,
  BarChart3,
  Settings,
  Shield,
  List,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import type { AppRole } from '@/types/auth.types'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const NAV_BY_ROLE: Record<AppRole, NavItem[]> = {
  Recepcionista: [
    { label: 'Panel', href: '/recepcion/dashboard', icon: LayoutDashboard },
    { label: 'Clientes', href: '/recepcion/clientes', icon: Users },
    { label: 'Vehículos', href: '/recepcion/vehiculos', icon: Car },
    { label: 'Facturas', href: '/recepcion/facturas', icon: FileText },
  ],

  JefeTaller: [
    { label: 'Panel', href: '/taller/dashboard', icon: LayoutDashboard },
    { label: 'Inspecciones', href: '/taller/inspecciones', icon: ClipboardList },
    { label: 'Órdenes', href: '/taller/ordenes', icon: Wrench },
    { label: 'Mecánicos', href: '/taller/mecanicos', icon: Users },
    { label: 'Facturas', href: '/taller/facturas', icon: FileText },
    { label: 'Reportes', href: '/taller/reportes', icon: BarChart3 },
  ],

  Mecanico: [
    { label: 'Panel', href: '/mecanico/dashboard', icon: LayoutDashboard },
    { label: 'Mis Órdenes', href: '/mecanico/mis-ordenes', icon: Wrench },
  ],

  JefeAlmacen: [
    { label: 'Panel', href: '/almacen/dashboard', icon: LayoutDashboard },
    { label: 'Solicitudes', href: '/almacen/solicitudes', icon: Package },
    { label: 'Inventario', href: '/almacen/inventario', icon: Boxes },
  ],

  JefeBodega: [
    { label: 'Panel', href: '/bodega/dashboard', icon: LayoutDashboard },
    { label: 'Inventario', href: '/bodega/inventario', icon: Boxes },
    { label: 'Solicitudes', href: '/bodega/solicitudes', icon: Package },
    { label: 'Órdenes de Compra', href: '/bodega/ordenes-compra', icon: ShoppingCart },
    { label: 'Proveedores', href: '/bodega/proveedores', icon: Truck },
  ],

  SuperAdministrador: [
    { label: 'Panel', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Usuarios', href: '/admin/usuarios', icon: Users },
    { label: 'Clientes', href: '/admin/clientes', icon: UserCheck },
    { label: 'Vehículos', href: '/admin/vehiculos', icon: Car },
    { label: 'Inspecciones', href: '/admin/inspecciones', icon: ClipboardList },
    { label: 'Órdenes', href: '/admin/ordenes', icon: Wrench },
    { label: 'Repuestos', href: '/admin/repuestos', icon: Settings },
    { label: 'Inventario', href: '/admin/inventario', icon: Boxes },
    { label: 'Proveedores', href: '/admin/proveedores', icon: Truck },
    { label: 'Facturas', href: '/admin/facturas', icon: FileText },
    { label: 'Reportes', href: '/admin/reportes', icon: BarChart3 },
    { label: 'Catálogos', href: '/admin/catalogos', icon: List },
    { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
    { label: 'Auditorías', href: '/admin/auditorias', icon: Shield },
  ],

  // Cliente usa PortalShell, no AppShell
  Cliente: [],
}
