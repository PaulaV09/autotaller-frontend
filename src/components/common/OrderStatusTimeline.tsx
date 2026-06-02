import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EstadoOrdenGeneral } from '@/types/enums'

const STEPS: { estado: EstadoOrdenGeneral; label: string }[] = [
  { estado: EstadoOrdenGeneral.Pendiente, label: 'Pendiente' },
  { estado: EstadoOrdenGeneral.EnDiagnostico, label: 'Diagnóstico' },
  { estado: EstadoOrdenGeneral.EsperandoAprobacion, label: 'Aprobación' },
  { estado: EstadoOrdenGeneral.EnProceso, label: 'En Proceso' },
  { estado: EstadoOrdenGeneral.Completada, label: 'Completada' },
  { estado: EstadoOrdenGeneral.Facturada, label: 'Facturada' },
]

interface OrderStatusTimelineProps {
  estado: EstadoOrdenGeneral
}

export function OrderStatusTimeline({ estado }: OrderStatusTimelineProps) {
  if (estado === EstadoOrdenGeneral.Cancelada) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-500" />
        <span className="text-sm font-medium text-red-800">Orden cancelada</span>
      </div>
    )
  }

  const currentIdx = STEPS.findIndex((s) => s.estado === estado)

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {STEPS.map((step, i) => {
        const done = i < currentIdx
        const current = i === currentIdx
        const pending = i > currentIdx

        return (
          <div key={step.estado} className="flex items-center">
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                  done && 'border-primary bg-primary text-primary-foreground',
                  current && 'border-primary bg-primary/10 text-primary',
                  pending && 'border-muted bg-transparent text-muted-foreground',
                )}
              >
                {done ? <Check className="size-3.5" /> : <Circle className="size-2.5 fill-current" />}
              </div>
              <span
                className={cn(
                  'text-center text-[10px] leading-tight',
                  done || current ? 'text-primary font-medium' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mb-4 h-0.5 w-8 flex-shrink-0',
                  i < currentIdx ? 'bg-primary' : 'bg-muted',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
