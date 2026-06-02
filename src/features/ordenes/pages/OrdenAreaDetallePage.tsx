import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { OrdenAreaBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ProgressTracker } from '@/components/common/ProgressTracker'
import {
  ProposalApprovalPanelJefeTaller,
  ProposalApprovalPanelCliente,
  ProposalReadOnly,
} from '@/components/common/ProposalApprovalPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import {
  useOrdenArea,
  useTrabajosPropuestos,
  useRepuestosPropuestos,
  useSeguimientosArea,
  useProponerTrabajo,
  useProponerRepuesto,
  useAprobarJefeTaller,
  useRechazarJefeTaller,
  useAprobarCliente,
  useRechazarCliente,
  useCompletarOrdenArea,
  useFinalizarDiagnostico,
  useRegistrarSeguimiento,
  useCancelarOrdenArea,
  useActualizarDiagnostico,
} from '../hooks/useOrdenes'
import { accionesOrdenArea } from '../utils/accionesOrdenArea'
import { useAuth } from '@/hooks/useAuth'

interface OrdenAreaDetallePageProps {
  backPath?: string
}

export function OrdenAreaDetallePage({ backPath }: OrdenAreaDetallePageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, primaryRole } = useAuth()
  const areaId = Number(id)

  const { data: area, isLoading } = useOrdenArea(areaId)
  const { data: trabajos = [] } = useTrabajosPropuestos(areaId)
  const { data: repuestos = [] } = useRepuestosPropuestos(areaId)
  const { data: seguimientos = [] } = useSeguimientosArea(areaId)

  const proponerTrabajoMutation = useProponerTrabajo(areaId)
  const proponerRepuestoMutation = useProponerRepuesto(areaId)
  const aprobarJTMutation = useAprobarJefeTaller(areaId)
  const rechazarJTMutation = useRechazarJefeTaller(areaId)
  const aprobarClienteMutation = useAprobarCliente(areaId)
  const rechazarClienteMutation = useRechazarCliente(areaId)
  const completarMutation = useCompletarOrdenArea(areaId)
  const finalizarDxMutation = useFinalizarDiagnostico(areaId)
  const seguimientoMutation = useRegistrarSeguimiento(areaId)
  const cancelarMutation = useCancelarOrdenArea(areaId)
  const actualizarDxMutation = useActualizarDiagnostico(areaId)

  // Form states
  const [proponerTrabajoOpen, setProponerTrabajoOpen] = useState(false)
  const [proponerRepuestoOpen, setProponerRepuestoOpen] = useState(false)
  const [completarOpen, setCompletarOpen] = useState(false)
  const [cancelarOpen, setCancelarOpen] = useState(false)
  const [diagnosticoEdit, setDiagnosticoEdit] = useState(false)
  const [diagnosticoText, setDiagnosticoText] = useState('')

  const [trabajoDesc, setTrabajoDesc] = useState('')
  const [trabajoCosto, setTrabajoCosto] = useState(0)
  const [repuestoId, setRepuestoId] = useState(0)
  const [repuestoCant, setRepuestoCant] = useState(1)
  const [repuestoPrecio, setRepuestoPrecio] = useState(0)
  const [trabajoRealizado, setTrabajoRealizado] = useState('')
  const [costoFinal, setCostoFinal] = useState(0)

  if (isLoading || !area) return <Skeleton className="h-64 w-full" />

  const role = primaryRole ?? 'Mecanico'
  const acciones = accionesOrdenArea(
    area.estado,
    role as Parameters<typeof accionesOrdenArea>[1],
    area.mecanicoAsignadoId,
    user?.id ?? null,
  )

  const back = backPath ?? -1

  async function handleProponerTrabajo() {
    if (!trabajoDesc.trim()) { toast.error('Describe el trabajo'); return }
    try {
      await proponerTrabajoMutation.mutateAsync({ descripcion: trabajoDesc, costoEstimadoManoObra: trabajoCosto })
      toast.success('Trabajo propuesto')
      setProponerTrabajoOpen(false)
      setTrabajoDesc('')
      setTrabajoCosto(0)
    } catch { toast.error('Error al proponer el trabajo') }
  }

  async function handleProponerRepuesto() {
    if (!repuestoId) { toast.error('Ingresa el ID del repuesto'); return }
    try {
      await proponerRepuestoMutation.mutateAsync({
        repuestoId,
        cantidadSolicitada: repuestoCant,
        precioUnitario: repuestoPrecio,
      })
      toast.success('Repuesto propuesto')
      setProponerRepuestoOpen(false)
    } catch { toast.error('Error al proponer el repuesto') }
  }

  async function handleCompletar() {
    if (!trabajoRealizado.trim()) { toast.error('Describe el trabajo realizado'); return }
    try {
      await completarMutation.mutateAsync({ trabajoRealizado, costoManoObraFinal: costoFinal })
      toast.success('Área completada')
      setCompletarOpen(false)
    } catch { toast.error('Error al completar el área') }
  }

  async function handleActualizarDiagnostico() {
    try {
      await actualizarDxMutation.mutateAsync({ diagnostico: diagnosticoText })
      toast.success('Diagnóstico actualizado')
      setDiagnosticoEdit(false)
    } catch { toast.error('Error al actualizar diagnóstico') }
  }

  return (
    <div>
      <PageHeader
        title={`Área #${area.id}`}
        description={`Orden general #${area.ordenServicioGeneralId}`}
        backPath={typeof back === 'string' ? back : undefined}
        action={
          <div className="flex flex-wrap gap-2">
            {acciones.puedeFinalizarDiagnostico && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  finalizarDxMutation.mutateAsync().then(() => toast.success('Diagnóstico finalizado'))
                }}
                disabled={finalizarDxMutation.isPending}
              >
                Finalizar diagnóstico
              </Button>
            )}
            {acciones.puedeCompletar && (
              <Button size="sm" onClick={() => setCompletarOpen(true)}>
                Completar área
              </Button>
            )}
            {acciones.puedeCancelar && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
                onClick={() => setCancelarOpen(true)}
              >
                Cancelar
              </Button>
            )}
          </div>
        }
      />

      <div className="space-y-5">
        {/* Estado y datos */}
        <Card>
          <CardContent className="grid gap-3 pt-4 text-sm sm:grid-cols-2">
            <div>
              <span className="font-medium">Estado:</span>{' '}
              <OrdenAreaBadge estado={area.estado} />
            </div>
            <div><span className="font-medium">Mecánico:</span> {area.mecanicoAsignadoId ? `#${area.mecanicoAsignadoId}` : 'Sin asignar'}</div>
            <div><span className="font-medium">Costo estimado:</span> {formatCurrency(area.costoManoObraEstimado)}</div>
            {area.costoManoObraFinal > 0 && (
              <div><span className="font-medium">Costo final:</span> {formatCurrency(area.costoManoObraFinal)}</div>
            )}
            {area.comentarioJefeTaller && (
              <div className="sm:col-span-2">
                <span className="font-medium">Comentario JefeTaller:</span>
                <p className="text-muted-foreground">{area.comentarioJefeTaller}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diagnóstico */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Diagnóstico</CardTitle>
            {acciones.puedeActualizarDiagnostico && !diagnosticoEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDiagnosticoText(area.diagnostico)
                  setDiagnosticoEdit(true)
                }}
              >
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {diagnosticoEdit ? (
              <div className="space-y-2">
                <Textarea rows={3} value={diagnosticoText} onChange={(e) => setDiagnosticoText(e.target.value)} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleActualizarDiagnostico} disabled={actualizarDxMutation.isPending}>Guardar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setDiagnosticoEdit(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{area.diagnostico || 'Sin diagnóstico registrado'}</p>
            )}
          </CardContent>
        </Card>

        {/* Propuestas de trabajo */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Trabajos y repuestos propuestos</CardTitle>
            {acciones.puedeProponerItems && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setProponerTrabajoOpen(true)}>+ Trabajo</Button>
                <Button size="sm" variant="outline" onClick={() => setProponerRepuestoOpen(true)}>+ Repuesto</Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {trabajos.length === 0 && repuestos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin propuestas registradas.</p>
            ) : (
              <ProposalReadOnly trabajos={trabajos} repuestos={repuestos} />
            )}
          </CardContent>
        </Card>

        {/* Panel aprobación JefeTaller */}
        {acciones.puedeAprobarJefeTaller && (
          <ProposalApprovalPanelJefeTaller
            trabajos={trabajos}
            repuestos={repuestos}
            onAprobar={(t, r, comentario) =>
              aprobarJTMutation
                .mutateAsync({ trabajosAprobados: t, repuestosAprobados: r, comentario })
                .then(() => toast.success('Propuesta aprobada'))
                .catch(() => toast.error('Error al aprobar'))
            }
            onRechazar={(motivo) =>
              rechazarJTMutation
                .mutateAsync({ motivoRechazo: motivo })
                .then(() => toast.success('Propuesta rechazada'))
                .catch(() => toast.error('Error al rechazar'))
            }
            isLoading={aprobarJTMutation.isPending || rechazarJTMutation.isPending}
          />
        )}

        {/* Panel aprobación Cliente */}
        {acciones.puedeAprobarCliente && (
          <ProposalApprovalPanelCliente
            trabajos={trabajos}
            repuestos={repuestos}
            onAprobar={(t, r, comentario) =>
              aprobarClienteMutation
                .mutateAsync({ trabajosAprobados: t, repuestosAprobados: r, comentarioCliente: comentario })
                .then(() => toast.success('Aprobado por el cliente'))
                .catch(() => toast.error('Error al aprobar'))
            }
            onRechazar={(comentario) =>
              rechazarClienteMutation
                .mutateAsync({ comentarioCliente: comentario })
                .then(() => toast.success('Rechazado por el cliente'))
                .catch(() => toast.error('Error al rechazar'))
            }
            isLoading={aprobarClienteMutation.isPending || rechazarClienteMutation.isPending}
          />
        )}

        {/* Progreso */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Progreso del servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressTracker
              seguimientos={seguimientos}
              canEdit={acciones.puedeRegistrarSeguimiento}
              onRegistrar={(porcentajeAvance, comentario) =>
                seguimientoMutation
                  .mutateAsync({ porcentajeAvance, comentario })
                  .then(() => toast.success('Avance registrado'))
                  .catch(() => toast.error('Error al registrar avance'))
              }
              isLoading={seguimientoMutation.isPending}
            />
          </CardContent>
        </Card>

        {/* Trabajo realizado (solo visible si completada) */}
        {area.trabajoRealizado && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Resumen final del trabajo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{area.trabajoRealizado}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog: Proponer trabajo */}
      <Dialog open={proponerTrabajoOpen} onOpenChange={setProponerTrabajoOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Proponer trabajo</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Descripción *</Label>
              <Textarea rows={2} value={trabajoDesc} onChange={(e) => setTrabajoDesc(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Costo estimado</Label>
              <Input type="number" min={0} value={trabajoCosto} onChange={(e) => setTrabajoCosto(Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProponerTrabajoOpen(false)}>Cancelar</Button>
            <Button onClick={handleProponerTrabajo} disabled={proponerTrabajoMutation.isPending}>
              {proponerTrabajoMutation.isPending ? '...' : 'Proponer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Proponer repuesto */}
      <Dialog open={proponerRepuestoOpen} onOpenChange={setProponerRepuestoOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Proponer repuesto</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>ID del repuesto *</Label>
              <Input type="number" min={1} value={repuestoId || ''} onChange={(e) => setRepuestoId(Number(e.target.value))} placeholder="Ingresa el ID del repuesto" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Cantidad</Label>
                <Input type="number" min={1} value={repuestoCant} onChange={(e) => setRepuestoCant(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label>Precio unitario</Label>
                <Input type="number" min={0} value={repuestoPrecio} onChange={(e) => setRepuestoPrecio(Number(e.target.value))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProponerRepuestoOpen(false)}>Cancelar</Button>
            <Button onClick={handleProponerRepuesto} disabled={proponerRepuestoMutation.isPending}>
              {proponerRepuestoMutation.isPending ? '...' : 'Proponer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Completar */}
      <Dialog open={completarOpen} onOpenChange={setCompletarOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Completar área de servicio</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Resumen del trabajo realizado *</Label>
              <Textarea rows={3} value={trabajoRealizado} onChange={(e) => setTrabajoRealizado(e.target.value)} placeholder="Describe detalladamente el trabajo realizado..." />
            </div>
            <div className="space-y-1">
              <Label>Costo final de mano de obra</Label>
              <Input type="number" min={0} value={costoFinal} onChange={(e) => setCostoFinal(Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompletarOpen(false)}>Cancelar</Button>
            <Button onClick={handleCompletar} disabled={completarMutation.isPending}>
              {completarMutation.isPending ? 'Completando...' : 'Confirmar completar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={cancelarOpen}
        onOpenChange={setCancelarOpen}
        title="Cancelar área de servicio"
        description="Esta área será cancelada. No se puede deshacer."
        confirmLabel="Cancelar área"
        variant="destructive"
        onConfirm={() => {
          cancelarMutation.mutateAsync()
            .then(() => { toast.success('Área cancelada'); setCancelarOpen(false) })
            .catch(() => toast.error('Error al cancelar'))
        }}
        isLoading={cancelarMutation.isPending}
      />
    </div>
  )
}
