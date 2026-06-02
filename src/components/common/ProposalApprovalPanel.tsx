import { useState } from 'react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '@/lib/utils'
import { EstadoAprobacion } from '@/types/enums'
import type { TrabajoPropuestoDto, RepuestoPropuestoDto } from '@/types/orden.types'
import { ESTADO_APROBACION_LABEL } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ProposalApprovalPanelJefeTallerProps {
  trabajos: TrabajoPropuestoDto[]
  repuestos: RepuestoPropuestoDto[]
  onAprobar: (trabajosAprobados: number[], repuestosAprobados: number[], comentario: string) => Promise<void>
  onRechazar: (motivo: string) => Promise<void>
  isLoading: boolean
}

export function ProposalApprovalPanelJefeTaller({
  trabajos,
  repuestos,
  onAprobar,
  onRechazar,
  isLoading,
}: ProposalApprovalPanelJefeTallerProps) {
  const [selectedTrabajos, setSelectedTrabajos] = useState<number[]>(trabajos.map((t) => t.id))
  const [selectedRepuestos, setSelectedRepuestos] = useState<number[]>(repuestos.map((r) => r.id))
  const [comentario, setComentario] = useState('')
  const [motivo, setMotivo] = useState('')
  const [mode, setMode] = useState<'idle' | 'aprobar' | 'rechazar'>('idle')

  function toggleTrabajo(id: number) {
    setSelectedTrabajos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function toggleRepuesto(id: number) {
    setSelectedRepuestos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  async function handleAprobar() {
    await onAprobar(selectedTrabajos, selectedRepuestos, comentario)
  }

  async function handleRechazar() {
    if (!motivo.trim()) {
      toast.error('Indica el motivo del rechazo')
      return
    }
    await onRechazar(motivo)
  }

  return (
    <div className="space-y-4 rounded-lg border bg-orange-50/40 p-4">
      <p className="text-sm font-semibold text-orange-800">Revisión pendiente — Jefe de Taller</p>

      {/* Trabajos */}
      {trabajos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trabajos propuestos</p>
          {trabajos.map((t) => (
            <div key={t.id} className="flex items-start gap-3 rounded-md border bg-background p-3">
              <Checkbox
                id={`t-${t.id}`}
                checked={selectedTrabajos.includes(t.id)}
                onCheckedChange={() => toggleTrabajo(t.id)}
              />
              <div className="flex-1">
                <label htmlFor={`t-${t.id}`} className="cursor-pointer text-sm font-medium">{t.descripcion}</label>
                <p className="text-xs text-muted-foreground">{formatCurrency(t.costoEstimadoManoObra)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Repuestos */}
      {repuestos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Repuestos propuestos</p>
          {repuestos.map((r) => (
            <div key={r.id} className="flex items-start gap-3 rounded-md border bg-background p-3">
              <Checkbox
                id={`r-${r.id}`}
                checked={selectedRepuestos.includes(r.id)}
                onCheckedChange={() => toggleRepuesto(r.id)}
              />
              <div className="flex-1">
                <label htmlFor={`r-${r.id}`} className="cursor-pointer text-sm font-medium">
                  Repuesto #{r.repuestoId}
                </label>
                <p className="text-xs text-muted-foreground">
                  {r.cantidadSolicitada} unid. × {formatCurrency(r.precioUnitario)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'aprobar' && (
        <div className="space-y-1">
          <Label>Comentario (opcional)</Label>
          <Textarea
            rows={2}
            placeholder="Observaciones al mecánico..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>
      )}

      {mode === 'rechazar' && (
        <div className="space-y-1">
          <Label>Motivo de rechazo *</Label>
          <Textarea
            rows={2}
            placeholder="Explica por qué se rechaza la propuesta..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {mode === 'idle' && (
          <>
            <Button onClick={() => setMode('aprobar')} size="sm">Aprobar propuesta</Button>
            <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => setMode('rechazar')}>
              Rechazar propuesta
            </Button>
          </>
        )}
        {mode === 'aprobar' && (
          <>
            <Button size="sm" onClick={handleAprobar} disabled={isLoading}>
              {isLoading ? 'Aprobando...' : 'Confirmar aprobación'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMode('idle')}>Cancelar</Button>
          </>
        )}
        {mode === 'rechazar' && (
          <>
            <Button variant="destructive" size="sm" onClick={handleRechazar} disabled={isLoading}>
              {isLoading ? 'Rechazando...' : 'Confirmar rechazo'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMode('idle')}>Cancelar</Button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Panel para Cliente / Recepcionista ────────────────────────────────────────

interface ProposalApprovalPanelClienteProps {
  trabajos: TrabajoPropuestoDto[]
  repuestos: RepuestoPropuestoDto[]
  onAprobar: (trabajosAprobados: number[], repuestosAprobados: number[], comentario: string) => Promise<void>
  onRechazar: (comentario: string) => Promise<void>
  isLoading: boolean
}

export function ProposalApprovalPanelCliente({
  trabajos,
  repuestos,
  onAprobar,
  onRechazar,
  isLoading,
}: ProposalApprovalPanelClienteProps) {
  const aprobados = trabajos.filter((t) => t.estadoAprobacion === EstadoAprobacion.Aprobado)
  const aprobadosR = repuestos.filter((r) => r.estadoAprobacion === EstadoAprobacion.Aprobado)

  const [selectedT, setSelectedT] = useState<number[]>(aprobados.map((t) => t.id))
  const [selectedR, setSelectedR] = useState<number[]>(aprobadosR.map((r) => r.id))
  const [comentario, setComentario] = useState('')
  const [mode, setMode] = useState<'idle' | 'action'>('idle')

  return (
    <div className="space-y-4 rounded-lg border bg-amber-50/40 p-4">
      <p className="text-sm font-semibold text-amber-800">Pendiente aprobación del cliente</p>

      {trabajos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trabajos</p>
          {trabajos.map((t) => (
            <div key={t.id} className={cn('flex items-start gap-3 rounded-md border p-3', t.estadoAprobacion === EstadoAprobacion.Rechazado ? 'bg-red-50' : 'bg-background')}>
              {t.estadoAprobacion !== EstadoAprobacion.Rechazado && (
                <Checkbox
                  id={`ct-${t.id}`}
                  checked={selectedT.includes(t.id)}
                  onCheckedChange={() => setSelectedT((p) => p.includes(t.id) ? p.filter((x) => x !== t.id) : [...p, t.id])}
                />
              )}
              <div className="flex-1">
                <label htmlFor={`ct-${t.id}`} className="cursor-pointer text-sm font-medium">{t.descripcion}</label>
                <p className="text-xs text-muted-foreground">{formatCurrency(t.costoEstimadoManoObra)}</p>
                {t.estadoAprobacion === EstadoAprobacion.Rechazado && (
                  <span className="text-xs font-medium text-red-600">Rechazado por Jefe de Taller</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {repuestos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Repuestos</p>
          {repuestos.map((r) => (
            <div key={r.id} className={cn('flex items-start gap-3 rounded-md border p-3', r.estadoAprobacion === EstadoAprobacion.Rechazado ? 'bg-red-50' : 'bg-background')}>
              {r.estadoAprobacion !== EstadoAprobacion.Rechazado && (
                <Checkbox
                  id={`cr-${r.id}`}
                  checked={selectedR.includes(r.id)}
                  onCheckedChange={() => setSelectedR((p) => p.includes(r.id) ? p.filter((x) => x !== r.id) : [...p, r.id])}
                />
              )}
              <div className="flex-1">
                <label htmlFor={`cr-${r.id}`} className="text-sm font-medium">Repuesto #{r.repuestoId}</label>
                <p className="text-xs text-muted-foreground">{r.cantidadSolicitada} × {formatCurrency(r.precioUnitario)}</p>
                {r.estadoAprobacion === EstadoAprobacion.Rechazado && (
                  <span className="text-xs font-medium text-red-600">Rechazado por Jefe de Taller</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'action' && (
        <div className="space-y-1">
          <Label>Comentario del cliente</Label>
          <Textarea rows={2} value={comentario} onChange={(e) => setComentario(e.target.value)} />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {mode === 'idle' && (
          <Button size="sm" onClick={() => setMode('action')}>Revisar y aprobar/rechazar</Button>
        )}
        {mode === 'action' && (
          <>
            <Button size="sm" onClick={() => onAprobar(selectedT, selectedR, comentario)} disabled={isLoading}>
              {isLoading ? '...' : 'Aprobar selección'}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onRechazar(comentario)} disabled={isLoading}>
              Rechazar todo
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMode('idle')}>Cancelar</Button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Vista solo lectura ────────────────────────────────────────────────────────

export function ProposalReadOnly({
  trabajos,
  repuestos,
}: {
  trabajos: TrabajoPropuestoDto[]
  repuestos: RepuestoPropuestoDto[]
}) {
  const colorMap: Record<EstadoAprobacion, string> = {
    [EstadoAprobacion.Pendiente]: 'bg-yellow-50 border-yellow-200',
    [EstadoAprobacion.Aprobado]: 'bg-green-50 border-green-200',
    [EstadoAprobacion.Rechazado]: 'bg-red-50 border-red-200',
  }

  return (
    <div className="space-y-3">
      {trabajos.map((t) => (
        <div key={t.id} className={cn('rounded-md border p-3', colorMap[t.estadoAprobacion])}>
          <p className="text-sm font-medium">{t.descripcion}</p>
          <p className="text-xs text-muted-foreground">{formatCurrency(t.costoEstimadoManoObra)} · {ESTADO_APROBACION_LABEL[t.estadoAprobacion]}</p>
        </div>
      ))}
      {repuestos.map((r) => (
        <div key={r.id} className={cn('rounded-md border p-3', colorMap[r.estadoAprobacion])}>
          <p className="text-sm font-medium">Repuesto #{r.repuestoId}</p>
          <p className="text-xs text-muted-foreground">
            Sol: {r.cantidadSolicitada} · Aprob: {r.cantidadAprobada} · {formatCurrency(r.precioUnitario)} c/u · {ESTADO_APROBACION_LABEL[r.estadoAprobacion]}
          </p>
        </div>
      ))}
    </div>
  )
}
