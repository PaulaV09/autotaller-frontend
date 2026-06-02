import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'
import { formatDate } from '@/lib/utils'

interface VehicleDocumentAlertProps {
  label: string
  fecha: string | null
}

export function VehicleDocumentAlert({ label, fecha }: VehicleDocumentAlertProps) {
  if (!fecha) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
        <AlertTriangle className="size-4 text-muted-foreground/60 shrink-0" />
        <div>
          <p className="text-xs font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">Sin fecha registrada</p>
        </div>
      </div>
    )
  }

  const days = differenceInDays(parseISO(fecha), new Date())
  const expired = days < 0
  const warning = days >= 0 && days <= 30
  const ok = days > 30

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
        expired
          ? 'border-red-200 bg-red-50'
          : warning
          ? 'border-yellow-200 bg-yellow-50'
          : 'border-green-200 bg-green-50'
      }`}
    >
      {ok ? (
        <CheckCircle2 className="size-4 shrink-0 text-green-600" />
      ) : (
        <AlertTriangle className={`size-4 shrink-0 ${expired ? 'text-red-600' : 'text-yellow-600'}`} />
      )}
      <div>
        <p className={`text-xs font-medium ${expired ? 'text-red-800' : warning ? 'text-yellow-800' : 'text-green-800'}`}>
          {label}
        </p>
        <p className={`text-xs ${expired ? 'text-red-700' : warning ? 'text-yellow-700' : 'text-green-700'}`}>
          {formatDate(fecha)} ·{' '}
          {expired
            ? `Vencido hace ${Math.abs(days)} días`
            : warning
            ? `Vence en ${days} días`
            : `Vigente (${days} días)`}
        </p>
      </div>
    </div>
  )
}
