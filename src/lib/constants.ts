import {
  EstadoOrdenGeneral,
  EstadoOrdenArea,
  EstadoInspeccion,
  EstadoAprobacion,
  EstadoPagoFactura,
  EstadoOrdenCompra,
  EstadoSolicitudRepuesto,
  TipoCombustible,
  TipoTransmision,
  ZonaInventario,
} from '@/types/enums'
import type { AppRole } from '@/types/auth.types'

// ── Etiquetas legibles ────────────────────────────────────────────────────────

export const ESTADO_ORDEN_GENERAL_LABEL: Record<EstadoOrdenGeneral, string> = {
  [EstadoOrdenGeneral.Pendiente]: 'Pendiente',
  [EstadoOrdenGeneral.EnDiagnostico]: 'En Diagnóstico',
  [EstadoOrdenGeneral.EsperandoAprobacion]: 'Esperando Aprobación',
  [EstadoOrdenGeneral.EnProceso]: 'En Proceso',
  [EstadoOrdenGeneral.Completada]: 'Completada',
  [EstadoOrdenGeneral.Cancelada]: 'Cancelada',
  [EstadoOrdenGeneral.Facturada]: 'Facturada',
}

export const ESTADO_ORDEN_AREA_LABEL: Record<EstadoOrdenArea, string> = {
  [EstadoOrdenArea.Pendiente]: 'Pendiente',
  [EstadoOrdenArea.Diagnostico]: 'En Diagnóstico',
  [EstadoOrdenArea.EsperandoAprobacionJefeTaller]: 'Pendiente Jefe de Taller',
  [EstadoOrdenArea.EsperandoAprobacionCliente]: 'Pendiente Cliente',
  [EstadoOrdenArea.Aprobada]: 'Aprobada',
  [EstadoOrdenArea.Rechazada]: 'Rechazada',
  [EstadoOrdenArea.EnProceso]: 'En Proceso',
  [EstadoOrdenArea.Completada]: 'Completada',
  [EstadoOrdenArea.Cancelada]: 'Cancelada',
}

export const ESTADO_INSPECCION_LABEL: Record<EstadoInspeccion, string> = {
  [EstadoInspeccion.Completada]: 'Completada',
  [EstadoInspeccion.DerivadaAOrden]: 'Derivada a Orden',
  [EstadoInspeccion.Cancelada]: 'Cancelada',
}

export const ESTADO_APROBACION_LABEL: Record<EstadoAprobacion, string> = {
  [EstadoAprobacion.Pendiente]: 'Pendiente',
  [EstadoAprobacion.Aprobado]: 'Aprobado',
  [EstadoAprobacion.Rechazado]: 'Rechazado',
}

export const ESTADO_PAGO_FACTURA_LABEL: Record<EstadoPagoFactura, string> = {
  [EstadoPagoFactura.Pendiente]: 'Pendiente',
  [EstadoPagoFactura.ParcialmentePagada]: 'Pago Parcial',
  [EstadoPagoFactura.PagadaCompleta]: 'Pagada',
}

export const ESTADO_ORDEN_COMPRA_LABEL: Record<EstadoOrdenCompra, string> = {
  [EstadoOrdenCompra.Pendiente]: 'Pendiente',
  [EstadoOrdenCompra.Enviada]: 'Enviada',
  [EstadoOrdenCompra.RecibidaParcial]: 'Recibida Parcial',
  [EstadoOrdenCompra.RecibidaCompleta]: 'Recibida Completa',
  [EstadoOrdenCompra.Cancelada]: 'Cancelada',
}

export const ESTADO_SOLICITUD_REPUESTO_LABEL: Record<EstadoSolicitudRepuesto, string> = {
  [EstadoSolicitudRepuesto.PendienteAlmacen]: 'Pendiente Almacén',
  [EstadoSolicitudRepuesto.EnviadaABodega]: 'Enviada a Bodega',
  [EstadoSolicitudRepuesto.EntregadaAAlmacen]: 'Entregada a Almacén',
  [EstadoSolicitudRepuesto.EntregadaAMecanico]: 'Entregada a Mecánico',
  [EstadoSolicitudRepuesto.Consumida]: 'Consumida',
  [EstadoSolicitudRepuesto.Rechazada]: 'Rechazada',
}

export const TIPO_COMBUSTIBLE_LABEL: Record<TipoCombustible, string> = {
  [TipoCombustible.Gasolina]: 'Gasolina',
  [TipoCombustible.Diesel]: 'Diésel',
  [TipoCombustible.Hibrido]: 'Híbrido',
  [TipoCombustible.Electrico]: 'Eléctrico',
  [TipoCombustible.Gas]: 'Gas',
}

export const TIPO_TRANSMISION_LABEL: Record<TipoTransmision, string> = {
  [TipoTransmision.Manual]: 'Manual',
  [TipoTransmision.Automatica]: 'Automática',
  [TipoTransmision.CVT]: 'CVT',
  [TipoTransmision.DobleEmbrague]: 'Doble Embrague',
}

export const ZONA_INVENTARIO_LABEL: Record<ZonaInventario, string> = {
  [ZonaInventario.Bodega]: 'Bodega',
  [ZonaInventario.Almacen]: 'Almacén',
  [ZonaInventario.EnObra]: 'En Obra',
}

// ── Colores por estado (clases Tailwind para Badge) ───────────────────────────

export const ESTADO_ORDEN_GENERAL_COLOR: Record<EstadoOrdenGeneral, string> = {
  [EstadoOrdenGeneral.Pendiente]: 'bg-yellow-100 text-yellow-800',
  [EstadoOrdenGeneral.EnDiagnostico]: 'bg-blue-100 text-blue-800',
  [EstadoOrdenGeneral.EsperandoAprobacion]: 'bg-orange-100 text-orange-800',
  [EstadoOrdenGeneral.EnProceso]: 'bg-indigo-100 text-indigo-800',
  [EstadoOrdenGeneral.Completada]: 'bg-green-100 text-green-800',
  [EstadoOrdenGeneral.Cancelada]: 'bg-red-100 text-red-800',
  [EstadoOrdenGeneral.Facturada]: 'bg-purple-100 text-purple-800',
}

export const ESTADO_ORDEN_AREA_COLOR: Record<EstadoOrdenArea, string> = {
  [EstadoOrdenArea.Pendiente]: 'bg-yellow-100 text-yellow-800',
  [EstadoOrdenArea.Diagnostico]: 'bg-blue-100 text-blue-800',
  [EstadoOrdenArea.EsperandoAprobacionJefeTaller]: 'bg-orange-100 text-orange-800',
  [EstadoOrdenArea.EsperandoAprobacionCliente]: 'bg-amber-100 text-amber-800',
  [EstadoOrdenArea.Aprobada]: 'bg-teal-100 text-teal-800',
  [EstadoOrdenArea.Rechazada]: 'bg-red-100 text-red-800',
  [EstadoOrdenArea.EnProceso]: 'bg-indigo-100 text-indigo-800',
  [EstadoOrdenArea.Completada]: 'bg-green-100 text-green-800',
  [EstadoOrdenArea.Cancelada]: 'bg-gray-100 text-gray-700',
}

export const ESTADO_PAGO_COLOR: Record<EstadoPagoFactura, string> = {
  [EstadoPagoFactura.Pendiente]: 'bg-red-100 text-red-800',
  [EstadoPagoFactura.ParcialmentePagada]: 'bg-yellow-100 text-yellow-800',
  [EstadoPagoFactura.PagadaCompleta]: 'bg-green-100 text-green-800',
}

// ── Dashboard por rol ─────────────────────────────────────────────────────────

export const ROLE_DASHBOARD: Record<AppRole, string> = {
  SuperAdministrador: '/admin/dashboard',
  JefeTaller: '/taller/dashboard',
  JefeAlmacen: '/almacen/dashboard',
  JefeBodega: '/bodega/dashboard',
  Mecanico: '/mecanico/dashboard',
  Recepcionista: '/recepcion/dashboard',
  Cliente: '/portal/dashboard',
}

export const ROLE_PRIORITY: AppRole[] = [
  'SuperAdministrador',
  'JefeTaller',
  'JefeAlmacen',
  'JefeBodega',
  'Mecanico',
  'Recepcionista',
  'Cliente',
]

export function getPrimaryRole(roles: string[] | readonly string[] | null | undefined): AppRole | null {
  if (!roles || roles.length === 0) return null

  return ROLE_PRIORITY.find((role) => roles.includes(role)) ?? null
}
