import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Resolver } from 'react-hook-form'
import { Plus, Trash2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSeccionesInspeccion } from '@/features/catalogos/hooks/useCatalogos'
import { useClientesList } from '@/features/clientes/hooks/useClientes'
import { useClienteVehiculos } from '@/features/clientes/hooks/useClientes'
import { useCreateInspeccion } from '../hooks/useInspecciones'
import { inspeccionSchema, ESTADOS_CONDICION, type InspeccionFormValues } from '../schemas/inspeccion.schema'
import { TipoEvidenciaInspeccion } from '@/types/enums'

interface InspeccionFormPageProps {
  basePath: string
}

export function InspeccionFormPage({ basePath }: InspeccionFormPageProps) {
  const navigate = useNavigate()
  const { data: secciones } = useSeccionesInspeccion()
  const createMutation = useCreateInspeccion()

  // Estado UI para búsqueda de cliente/vehículo
  const [clienteBusqueda, setClienteBusqueda] = useState('')
  const [clienteIdSelected, setClienteIdSelected] = useState<number>(0)
  const [showClienteResults, setShowClienteResults] = useState(false)

  const { data: clientesData } = useClientesList({
    pageNumber: 1,
    pageSize: 8,
    nombre: clienteBusqueda || undefined,
  })
  const { data: vehiculos } = useClienteVehiculos(clienteIdSelected)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InspeccionFormValues>({
    resolver: zodResolver(inspeccionSchema) as Resolver<InspeccionFormValues>,
    defaultValues: {
      vehiculoId: 0,
      clienteId: 0,
      kilometrajeActual: 0,
      observacionesGenerales: '',
      detalles: [],
      evidencias: [],
    },
  })

  const evidencias = watch('evidencias') ?? []

  // Cuando las secciones se cargan, inicializa los detalles
  const detalles = watch('detalles')
  if (secciones && detalles.length === 0) {
    setValue(
      'detalles',
      secciones.map((s) => ({ seccion: s.nombre, estado: '', observacion: '' })),
    )
  }

  function selectCliente(id: number, nombre: string) {
    setClienteIdSelected(id)
    setClienteBusqueda(nombre)
    setShowClienteResults(false)
    setValue('clienteId', id)
    setValue('vehiculoId', 0)
  }

  function addEvidencia() {
    setValue('evidencias', [
      ...evidencias,
      { tipo: TipoEvidenciaInspeccion.Foto, url: '', descripcion: '' },
    ])
  }

  function removeEvidencia(idx: number) {
    setValue('evidencias', evidencias.filter((_, i) => i !== idx))
  }

  async function onSubmit(values: InspeccionFormValues) {
    try {
      const result = await createMutation.mutateAsync({
        ...values,
        evidencias: (values.evidencias ?? []).filter((e) => e.url.trim()),
      })
      toast.success('Inspección registrada exitosamente')
      navigate(`${basePath}/inspecciones/${result.id}`)
    } catch {
      toast.error('Error al registrar la inspección')
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Nueva inspección"
        description="Registro de condiciones iniciales del vehículo"
        backPath={`${basePath}/inspecciones`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

        {/* Selección de cliente */}
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Cliente y vehículo
          </h3>

          <div className="space-y-1">
            <Label>Buscar cliente *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Escribe el nombre del cliente..."
                value={clienteBusqueda}
                onChange={(e) => {
                  setClienteBusqueda(e.target.value)
                  setShowClienteResults(true)
                }}
                onFocus={() => setShowClienteResults(true)}
              />
            </div>
            {showClienteResults && clientesData && clientesData.items.length > 0 && (
              <div className="absolute z-10 mt-1 w-full max-w-sm rounded-lg border bg-background shadow-lg">
                {clientesData.items.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="flex w-full flex-col px-3 py-2 text-left hover:bg-accent"
                    onClick={() => selectCliente(c.id, c.nombre)}
                  >
                    <span className="text-sm font-medium">{c.nombre}</span>
                    <span className="text-xs text-muted-foreground">{c.correo}</span>
                  </button>
                ))}
              </div>
            )}
            {errors.clienteId && (
              <p className="text-xs text-destructive">{errors.clienteId.message}</p>
            )}
          </div>

          {clienteIdSelected > 0 && (
            <div className="space-y-1">
              <Label>Vehículo *</Label>
              <Controller
                control={control}
                name="vehiculoId"
                render={({ field }) => (
                  <Select
                    value={field.value > 0 ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiculos?.filter((v) => v.esPropietarioActual).map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.placa} — {v.vin} ({v.anio})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vehiculoId && (
                <p className="text-xs text-destructive">{errors.vehiculoId.message}</p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Kilometraje actual *</Label>
              <Input
                type="number"
                {...register('kilometrajeActual', { valueAsNumber: true })}
              />
              {errors.kilometrajeActual && (
                <p className="text-xs text-destructive">{errors.kilometrajeActual.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Observaciones generales *</Label>
            <Textarea
              rows={3}
              placeholder="Descripción general del estado del vehículo al recibirlo..."
              {...register('observacionesGenerales')}
            />
            {errors.observacionesGenerales && (
              <p className="text-xs text-destructive">{errors.observacionesGenerales.message}</p>
            )}
          </div>
        </div>

        {/* Secciones de inspección */}
        {secciones && secciones.length > 0 && (
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Detalle por sección
            </h3>

            <div className="space-y-4">
              {secciones.map((seccion, idx) => (
                <div key={seccion.id} className="grid gap-3 rounded-md border p-3 sm:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">{seccion.nombre}</p>
                    {seccion.descripcion && (
                      <p className="text-xs text-muted-foreground">{seccion.descripcion}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Estado</Label>
                    <Controller
                      control={control}
                      name={`detalles.${idx}.estado`}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {ESTADOS_CONDICION.map((e) => (
                              <SelectItem key={e} value={e}>{e}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Observación</Label>
                    <Input
                      className="h-8 text-sm"
                      placeholder="Detalle..."
                      {...register(`detalles.${idx}.observacion`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidencias */}
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Evidencias fotográficas/documentos (opcional)
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={addEvidencia}>
              <Plus className="mr-1 size-3.5" />
              Agregar
            </Button>
          </div>

          {evidencias.map((_, idx) => (
            <div key={idx} className="grid gap-3 rounded-md border p-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Tipo</Label>
                <Controller
                  control={control}
                  name={`evidencias.${idx}.tipo`}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(TipoEvidenciaInspeccion.Foto)}>Foto</SelectItem>
                        <SelectItem value={String(TipoEvidenciaInspeccion.Video)}>Video</SelectItem>
                        <SelectItem value={String(TipoEvidenciaInspeccion.Documento)}>Documento</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL del archivo</Label>
                <Input
                  className="h-8 text-sm"
                  placeholder="https://..."
                  {...register(`evidencias.${idx}.url`)}
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Descripción</Label>
                  <Input
                    className="h-8 text-sm"
                    {...register(`evidencias.${idx}.descripcion`)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mb-0.5 size-8 shrink-0"
                  onClick={() => removeEvidencia(idx)}
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <Button type="button" variant="outline" onClick={() => navigate(`${basePath}/inspecciones`)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar inspección'}
          </Button>
        </div>
      </form>
    </div>
  )
}
