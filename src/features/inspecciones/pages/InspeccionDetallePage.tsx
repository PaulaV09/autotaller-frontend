import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Resolver } from 'react-hook-form'
import { ClipboardList, Image, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { InspeccionBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useInspeccion,
  useInspeccionDetalles,
  useInspeccionEvidencias,
  useCrearOrdenDesdeInspeccion,
} from '../hooks/useInspecciones'
import { useTiposServicio } from '@/features/catalogos/hooks/useCatalogos'
import { crearOrdenSchema, type CrearOrdenFormValues } from '../schemas/inspeccion.schema'
import { formatDateTime } from '@/lib/utils'
import { EstadoInspeccion } from '@/types/enums'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface InspeccionDetallePageProps {
  basePath: string
}

export function InspeccionDetallePage({ basePath }: InspeccionDetallePageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const inspeccionId = Number(id)
  const [crearOrdenOpen, setCrearOrdenOpen] = useState(false)

  const { data: inspeccion, isLoading } = useInspeccion(inspeccionId)
  const { data: detalles } = useInspeccionDetalles(inspeccionId)
  const { data: evidencias } = useInspeccionEvidencias(inspeccionId)
  const { data: tiposServicio } = useTiposServicio()
  const crearOrdenMutation = useCrearOrdenDesdeInspeccion(inspeccionId)

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CrearOrdenFormValues>({
    resolver: zodResolver(crearOrdenSchema) as Resolver<CrearOrdenFormValues>,
    defaultValues: { tipoServicioId: 0, observacionesIniciales: '' },
  })

  async function onCrearOrden(values: CrearOrdenFormValues) {
    try {
      const result = await crearOrdenMutation.mutateAsync(values)
      toast.success('Orden de servicio creada')
      setCrearOrdenOpen(false)
      navigate(`${basePath}/ordenes/${result.ordenId}`)
    } catch {
      toast.error('Error al crear la orden')
    }
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!inspeccion) return <p className="text-muted-foreground">Inspección no encontrada</p>

  const canCrearOrden = inspeccion.estado === EstadoInspeccion.Completada

  return (
    <div>
      <PageHeader
        title={`Inspección #${inspeccion.id}`}
        description={`${formatDateTime(inspeccion.fechaInspeccion)} · Vehículo #${inspeccion.vehiculoId}`}
        backPath={`${basePath}/inspecciones`}
        action={
          canCrearOrden ? (
            <Button onClick={() => setCrearOrdenOpen(true)}>
              <Plus className="mr-2 size-4" />
              Crear orden de servicio
            </Button>
          ) : undefined
        }
      />

      {/* Info general */}
      <Card className="mb-5">
        <CardContent className="grid gap-3 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-medium">Estado:</span>{' '}
            <InspeccionBadge estado={inspeccion.estado} />
          </div>
          <div><span className="font-medium">Kilometraje:</span> {inspeccion.kilometrajeActual.toLocaleString('es-CO')} km</div>
          <div><span className="font-medium">Cliente:</span> #{inspeccion.clienteId}</div>
          <div><span className="font-medium">Inspector:</span> #{inspeccion.inspectorId}</div>
          <div className="sm:col-span-2 lg:col-span-4">
            <span className="font-medium">Observaciones generales:</span>
            <p className="mt-0.5 text-muted-foreground">{inspeccion.observacionesGenerales}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="detalles">
        <TabsList>
          <TabsTrigger value="detalles">
            <ClipboardList className="mr-1.5 size-3.5" />
            Secciones ({detalles?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="evidencias">
            <Image className="mr-1.5 size-3.5" />
            Evidencias ({evidencias?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="detalles" className="mt-4">
          {detalles && detalles.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {detalles.map((d) => (
                <div key={d.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{d.seccion}</p>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        d.estado === 'Bueno'
                          ? 'bg-green-100 text-green-800'
                          : d.estado === 'Regular'
                          ? 'bg-yellow-100 text-yellow-800'
                          : d.estado === 'Malo'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {d.estado}
                    </span>
                  </div>
                  {d.observacion && (
                    <p className="mt-1 text-xs text-muted-foreground">{d.observacion}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay detalles registrados.</p>
          )}
        </TabsContent>

        <TabsContent value="evidencias" className="mt-4">
          {evidencias && evidencias.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {evidencias.map((e) => (
                <a
                  key={e.id}
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-1 rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    {e.tipo === 1 ? 'Foto' : e.tipo === 2 ? 'Video' : 'Documento'}
                  </span>
                  <span className="truncate text-sm text-primary underline">{e.url}</span>
                  {e.descripcion && <span className="text-xs text-muted-foreground">{e.descripcion}</span>}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay evidencias registradas.</p>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog: Crear Orden */}
      <Dialog open={crearOrdenOpen} onOpenChange={setCrearOrdenOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear orden de servicio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCrearOrden)} className="space-y-4" noValidate>
            <div className="space-y-1">
              <Label>Tipo de servicio *</Label>
              <Select onValueChange={(v) => setValue('tipoServicioId', Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {tiposServicio?.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipoServicioId && (
                <p className="text-xs text-destructive">{errors.tipoServicioId.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Observaciones iniciales *</Label>
              <Textarea rows={3} {...register('observacionesIniciales')} />
              {errors.observacionesIniciales && (
                <p className="text-xs text-destructive">{errors.observacionesIniciales.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setCrearOrdenOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear orden'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
