import { useState } from 'react'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formatDateTime } from '@/lib/utils'
import type { SeguimientoOrdenAreaDto } from '@/types/orden.types'

interface ProgressTrackerProps {
  seguimientos: SeguimientoOrdenAreaDto[]
  canEdit: boolean
  onRegistrar?: (porcentajeAvance: number, comentario: string) => Promise<void>
  isLoading?: boolean
}

export function ProgressTracker({
  seguimientos,
  canEdit,
  onRegistrar,
  isLoading,
}: ProgressTrackerProps) {
  const [pct, setPct] = useState(0)
  const [comentario, setComentario] = useState('')
  const [open, setOpen] = useState(false)

  const lastPct = seguimientos.length > 0
    ? seguimientos[seguimientos.length - 1].porcentajeAvance
    : 0

  async function handleSubmit() {
    if (!comentario.trim()) {
      toast.error('Escribe un comentario sobre el avance')
      return
    }
    await onRegistrar?.(pct, comentario)
    setComentario('')
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Barra actual */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Progreso actual</span>
          <span className="font-bold text-primary">{lastPct}%</span>
        </div>
        <Progress value={lastPct} className="h-2.5" />
      </div>

      {/* Historial */}
      {seguimientos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Historial de avance
          </p>
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {[...seguimientos].reverse().map((s) => (
              <div key={s.id} className="rounded-md border bg-muted/30 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{s.porcentajeAvance}% completado</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(s.fechaRegistro)}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.comentario}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario */}
      {canEdit && !open && (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Registrar avance
        </Button>
      )}

      {canEdit && open && (
        <div className="space-y-3 rounded-lg border p-3">
          <div className="space-y-1">
            <Label>Porcentaje de avance</Label>
            <Input
              type="number"
              min={lastPct}
              max={100}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label>Comentario *</Label>
            <Textarea
              rows={2}
              placeholder="Describe lo que se realizó..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar avance'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
          </div>
        </div>
      )}
    </div>
  )
}
