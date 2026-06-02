import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, XCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { OrderStatusTimeline } from '@/components/common/OrderStatusTimeline'
import { OrdenAreaBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  useOrdenGeneral,
  useAreasOrden,
  useCerrarOrden,
  useCancelarOrdenGeneral,
  useCrearOrdenArea,
} from '../hooks/useOrdenes'
import { useMecanicos } from '@/features/mecanicos/hooks/useMecanicos'
import { useAreasServicio } from '@/features/catalogos/hooks/useCatalogos'
import { formatDate, formatCurrency } from '@/lib/utils'
import { EstadoOrdenGeneral, EstadoOrdenArea } from '@/types/enums'
import { useAuth } from '@/hooks/useAuth'
import type { OrdenServicioAreaDto } from '@/types/orden.types'

interface OrdenDetallePageProps {
  basePath: string
}

const ESTADOS_CERRABLE = [EstadoOrdenGeneral.Completada]
const ESTADOS_NO_CANCELABLE = [
  EstadoOrdenGeneral.Completada,
  EstadoOrdenGeneral.Cancelada,
  EstadoOrdenGeneral.Facturada,
]

export function OrdenDetallePage({ basePath }: OrdenDetallePageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hasRole, user } = useAuth()
  const ordenId = Number(id)

  const [cancelarOpen, setCancelarOpen] = useState(false)
  const [cerrarOpen, setCerrarOpen] = useState(false)
  const [nuevaAreaOpen, setNuevaAreaOpen] = useState(false)

  // Form state para nueva área
  const [areaId, setAreaId] = useState(0)
  const [mecanicoId, setMecanicoId] = useState<number | null>(null)
  const [diagnostico, setDiagnostico] = useState('')
  const [costoEstimado, setCostoEstimado] = useState(0)

  const { data: orden, isLoading } = useOrdenGeneral(ordenId)
  const { data: areas, isLoading: areasLoading } = useAreasOrden(ordenId)
  const { data: mecanicos } = useMecanicos()
  const { data: areasServicio } = useAreasServicio()

  const cerrarMutation = useCerrarOrden(ordenId)
  const cancelarMutation = useCancelarOrdenGeneral(ordenId)
  const crearAreaMutation = useCrearOrdenArea(ordenId)

  const esJefeTaller = hasRole('JefeTaller', 'SuperAdministrador')

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!orden) return <p className="text-muted-foreground">Orden no encontrada</p>

  const puedeCerrar = ESTADOS_CERRABLE.includes(orden.estado)
  const puedeCancelar = !ESTADOS_NO_CANCELABLE.includes(orden.estado)

  async function handleCerrar() {
    try {
      await cerrarMutation.mutateAsync()
      toast.success('Orden cerrada exitosamente')
      setCerrarOpen(false)
    } catch {
      toast.error('No se pudo cerrar la orden. Verifica que todas las áreas estén completadas.')
      setCerrarOpen(false)
    }
  }

  async function handleCancelar() {
    try {
      await cancelarMutation.mutateAsync()
      toast.success('Orden cancelada')
      setCancelarOpen(false)
    } catch {
      toast.error('No se pudo cancelar la orden')
      setCancelarOpen(false)
    }
  }

  async function handleCrearArea() {
    if (!areaId) { toast.error('Selecciona un área de servicio'); return }
    if (!diagnostico.trim()) { toast.error('Ingresa un diagnóstico'); return }
    try {
      const result = await crearAreaMutation.mutateAsync({
        areaServicioId: areaId,
        mecanicoAsignadoId: mecanicoId,
        diagnostico,
        costoManoObraEstimado: costoEstimado,
      })
      toast.success('Área de servicio creada')
      setNuevaAreaOpen(false)
      navigate(`${basePath}/ordenes-area/${result.id}`)
    } catch {
      toast.error('Error al crear el área')
    }
  }

  return (
    <div>
      <PageHeader
        title={`Orden #${orden.id}`}
        description={`Cliente #${orden.clienteId} · Vehículo #${orden.vehiculoId}`}
        backPath={`${basePath}/ordenes`}
        action={
          esJefeTaller ? (
            <div className="flex gap-2">
              {puedeCerrar && (
                <Button size="sm" onClick={() => setCerrarOpen(true)}>
                  <CheckCircle2 className="mr-1.5 size-4" />
                  Cerrar orden
                </Button>
              )}
              {puedeCancelar && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => setCancelarOpen(true)}
                >
                  <XCircle className="mr-1.5 size-4" />
                  Cancelar
                </Button>
              )}
            </div>
          ) : undefined
        }
      />

      {/* Timeline */}
      <div className="mb-5">
        <OrderStatusTimeline estado={orden.estado} />
      </div>

      {/* Info general */}
      <Card className="mb-5">
        <CardContent className="grid gap-3 pt-4 text-sm sm:grid-cols-3">
          <div><span className="font-medium">Fecha ingreso:</span> {formatDate(orden.fechaIngreso)}</div>
          <div><span className="font-medium">Entrega estimada:</span> {formatDate(orden.fechaEstimadaEntrega)}</div>
          <div><span className="font-medium">Cierre:</span> {formatDate(orden.fechaCierre)}</div>
          <div className="sm:col-span-3">
            <span className="font-medium">Observaciones iniciales:</span>
            <p className="mt-0.5 text-muted-foreground">{orden.observacionesIniciales}</p>
          </div>
        </CardContent>
      </Card>

      {/* Áreas de servicio */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Áreas de servicio ({areas?.length ?? 0})</h2>
          {esJefeTaller && !ESTADOS_NO_CANCELABLE.includes(orden.estado) && orden.estado !== EstadoOrdenGeneral.Pendiente && (
            <Button size="sm" variant="outline" onClick={() => setNuevaAreaOpen(true)}>
              <Plus className="mr-1.5 size-4" />
              Nueva área
            </Button>
          )}
        </div>

        {areasLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : areas && areas.length > 0 ? (
          areas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              areasServicio={areasServicio ?? []}
              mecanicos={mecanicos ?? []}
              onClick={() => navigate(`${basePath}/ordenes-area/${area.id}`)}
            />
          ))
        ) : (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No hay áreas de servicio asignadas. Usa el botón "Nueva área" para comenzar.
          </p>
        )}
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={cerrarOpen}
        onOpenChange={setCerrarOpen}
        title="Cerrar orden general"
        description="Todas las áreas deben estar completadas para cerrar la orden. ¿Confirmas el cierre?"
        confirmLabel="Cerrar orden"
        onConfirm={handleCerrar}
        isLoading={cerrarMutation.isPending}
      />

      <ConfirmDialog
        open={cancelarOpen}
        onOpenChange={setCancelarOpen}
        title="Cancelar orden"
        description="La orden y todas sus áreas activas serán canceladas. Esta acción no se puede deshacer."
        confirmLabel="Cancelar orden"
        variant="destructive"
        onConfirm={handleCancelar}
        isLoading={cancelarMutation.isPending}
      />

      {/* Dialog Nueva Área */}
      <Dialog open={nuevaAreaOpen} onOpenChange={setNuevaAreaOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva área de servicio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Área de servicio *</Label>
              <Select onValueChange={(v) => setAreaId(Number(v))}>
                <SelectTrigger><SelectValue placeholder="Selecciona el área" /></SelectTrigger>
                <SelectContent>
                  {areasServicio?.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Mecánico asignado</Label>
              <Select onValueChange={(v) => setMecanicoId(v === 'ninguno' ? null : Number(v))}>
                <SelectTrigger><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguno">Sin asignar</SelectItem>
                  {mecanicos?.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Diagnóstico inicial *</Label>
              <Input
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                placeholder="Describe el problema detectado..."
              />
            </div>
            <div className="space-y-1">
              <Label>Costo estimado mano de obra</Label>
              <Input
                type="number"
                min={0}
                value={costoEstimado}
                onChange={(e) => setCostoEstimado(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNuevaAreaOpen(false)}>Cancelar</Button>
            <Button onClick={handleCrearArea} disabled={crearAreaMutation.isPending}>
              {crearAreaMutation.isPending ? 'Creando...' : 'Crear área'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AreaCard({
  area,
  areasServicio,
  mecanicos,
  onClick,
}: {
  area: OrdenServicioAreaDto
  areasServicio: { id: number; nombre: string }[]
  mecanicos: { id: number; nombre: string }[]
  onClick: () => void
}) {
  const areaNombre = areasServicio.find((a) => a.id === area.areaServicioId)?.nombre ?? `Área #${area.areaServicioId}`
  const mecanicoNombre = area.mecanicoAsignadoId
    ? mecanicos.find((m) => m.id === area.mecanicoAsignadoId)?.nombre ?? `Mecánico #${area.mecanicoAsignadoId}`
    : 'Sin asignar'

  return (
    <div
      className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{areaNombre}</p>
          <OrdenAreaBadge estado={area.estado} />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Mecánico: {mecanicoNombre}
        </p>
        {area.diagnostico && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{area.diagnostico}</p>
        )}
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Estimado</p>
        <p className="text-sm font-medium">{formatCurrency(area.costoManoObraEstimado)}</p>
        {area.estado === EstadoOrdenArea.Completada && (
          <>
            <p className="text-xs text-muted-foreground">Final</p>
            <p className="text-sm font-medium text-green-700">{formatCurrency(area.costoManoObraFinal)}</p>
          </>
        )}
      </div>
    </div>
  )
}
