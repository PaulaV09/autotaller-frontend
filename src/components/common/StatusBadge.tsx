import { cn } from '@/lib/utils'
import {
  ESTADO_ORDEN_GENERAL_LABEL,
  ESTADO_ORDEN_GENERAL_COLOR,
  ESTADO_ORDEN_AREA_LABEL,
  ESTADO_ORDEN_AREA_COLOR,
  ESTADO_PAGO_FACTURA_LABEL,
  ESTADO_PAGO_COLOR,
  ESTADO_INSPECCION_LABEL,
} from '@/lib/constants'
import {
  EstadoOrdenGeneral,
  EstadoOrdenArea,
  EstadoPagoFactura,
  EstadoInspeccion,
} from '@/types/enums'

interface BadgeProps {
  className?: string
}

function BaseBadge({ label, colorClass, className }: { label: string; colorClass: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  )
}

export function OrdenGeneralBadge({ estado, className }: { estado: EstadoOrdenGeneral } & BadgeProps) {
  return (
    <BaseBadge
      label={ESTADO_ORDEN_GENERAL_LABEL[estado]}
      colorClass={ESTADO_ORDEN_GENERAL_COLOR[estado]}
      className={className}
    />
  )
}

export function OrdenAreaBadge({ estado, className }: { estado: EstadoOrdenArea } & BadgeProps) {
  return (
    <BaseBadge
      label={ESTADO_ORDEN_AREA_LABEL[estado]}
      colorClass={ESTADO_ORDEN_AREA_COLOR[estado]}
      className={className}
    />
  )
}

export function PagoBadge({ estado, className }: { estado: EstadoPagoFactura } & BadgeProps) {
  return (
    <BaseBadge
      label={ESTADO_PAGO_FACTURA_LABEL[estado]}
      colorClass={ESTADO_PAGO_COLOR[estado]}
      className={className}
    />
  )
}

export function InspeccionBadge({ estado, className }: { estado: EstadoInspeccion } & BadgeProps) {
  const colorMap: Record<EstadoInspeccion, string> = {
    [EstadoInspeccion.Completada]: 'bg-green-100 text-green-800',
    [EstadoInspeccion.DerivadaAOrden]: 'bg-blue-100 text-blue-800',
    [EstadoInspeccion.Cancelada]: 'bg-red-100 text-red-800',
  }
  return (
    <BaseBadge
      label={ESTADO_INSPECCION_LABEL[estado]}
      colorClass={colorMap[estado]}
      className={className}
    />
  )
}
