import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useVehiculo, useUpdateVehiculo } from '../hooks/useVehiculos'
import { useMarcasVehiculo, useModelosVehiculo } from '@/features/catalogos/hooks/useCatalogos'
import { editarVehiculoSchema, type EditarVehiculoFormValues } from '../schemas/vehiculo.schema'
import { TipoCombustible, TipoTransmision } from '@/types/enums'
import { TIPO_COMBUSTIBLE_LABEL, TIPO_TRANSMISION_LABEL } from '@/lib/constants'

interface VehiculoEditPageProps {
  basePath: string
}

export function VehiculoEditPage({ basePath }: VehiculoEditPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vehiculoId = Number(id)

  const { data: vehiculo, isLoading } = useVehiculo(vehiculoId)
  const updateMutation = useUpdateVehiculo(vehiculoId)

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditarVehiculoFormValues>({
    resolver: zodResolver(editarVehiculoSchema) as Resolver<EditarVehiculoFormValues>,
  })

  const marcaId = watch('marcaVehiculoId')
  const { data: marcas } = useMarcasVehiculo()
  const { data: modelos } = useModelosVehiculo(marcaId > 0 ? marcaId : undefined)

  useEffect(() => {
    if (vehiculo) {
      reset({
        modeloVehiculoId: vehiculo.modeloVehiculoId,
        marcaVehiculoId: 0,
        anio: vehiculo.anio,
        placa: vehiculo.placa,
        kilometraje: vehiculo.kilometraje,
        tipoCombustible: vehiculo.tipoCombustible,
        tipoTransmision: vehiculo.tipoTransmision,
        color: vehiculo.color ?? '',
        cilindraje: vehiculo.cilindraje ?? undefined,
        numeroMotor: vehiculo.numeroMotor ?? '',
        numeroChasis: vehiculo.numeroChasis ?? '',
        activo: vehiculo.activo,
        fechaVencimientoSOAT: vehiculo.fechaVencimientoSOAT?.split('T')[0] ?? '',
        fechaVencimientoTecnomecanica: vehiculo.fechaVencimientoTecnomecanica?.split('T')[0] ?? '',
        paisOrigen: vehiculo.paisOrigen ?? '',
        esImportado: vehiculo.esImportado,
        numeroLlave: vehiculo.numeroLlave ?? '',
        capacidadCombustibleLitros: vehiculo.capacidadCombustibleLitros ?? undefined,
      })
    }
  }, [vehiculo, reset])

  async function onSubmit(values: EditarVehiculoFormValues) {
    const { marcaVehiculoId: _m, ...rest } = values
    try {
      await updateMutation.mutateAsync({
        ...rest,
        color: rest.color || null,
        numeroMotor: rest.numeroMotor || null,
        numeroChasis: rest.numeroChasis || null,
        fechaVencimientoSOAT: rest.fechaVencimientoSOAT || null,
        fechaVencimientoTecnomecanica: rest.fechaVencimientoTecnomecanica || null,
        paisOrigen: rest.paisOrigen || null,
        numeroLlave: rest.numeroLlave || null,
      })
      toast.success('Vehículo actualizado')
      navigate(`${basePath}/vehiculos/${vehiculoId}`)
    } catch {
      toast.error('Error al actualizar el vehículo')
    }
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Editar vehículo"
        description={`Placa: ${vehiculo?.placa}`}
        backPath={`${basePath}/vehiculos/${vehiculoId}`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border bg-card p-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Marca */}
          <div className="space-y-1">
            <Label>Marca</Label>
            <Select onValueChange={(v) => { setValue('marcaVehiculoId', Number(v)); setValue('modeloVehiculoId', 0) }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona marca para cambiar modelo" />
              </SelectTrigger>
              <SelectContent>
                {marcas?.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Modelo */}
          <div className="space-y-1">
            <Label>Modelo *</Label>
            <Select
              value={String(watch('modeloVehiculoId') || '')}
              onValueChange={(v) => setValue('modeloVehiculoId', Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona modelo" />
              </SelectTrigger>
              <SelectContent>
                {modelos?.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.modeloVehiculoId && <p className="text-xs text-destructive">{errors.modeloVehiculoId.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Año *</Label>
            <Input type="number" {...register('anio', { valueAsNumber: true })} />
            {errors.anio && <p className="text-xs text-destructive">{errors.anio.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Placa *</Label>
            <Input {...register('placa')} />
            {errors.placa && <p className="text-xs text-destructive">{errors.placa.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Kilometraje *</Label>
            <Input type="number" {...register('kilometraje', { valueAsNumber: true })} />
            {errors.kilometraje && <p className="text-xs text-destructive">{errors.kilometraje.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Color</Label>
            <Input {...register('color')} />
          </div>

          <div className="space-y-1">
            <Label>Combustible *</Label>
            <Select
              value={String(watch('tipoCombustible') || '')}
              onValueChange={(v) => setValue('tipoCombustible', Number(v) as TipoCombustible)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TipoCombustible).filter(([, v]) => typeof v === 'number').map(([, v]) => (
                  <SelectItem key={v} value={String(v)}>{TIPO_COMBUSTIBLE_LABEL[v as TipoCombustible]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Transmisión *</Label>
            <Select
              value={String(watch('tipoTransmision') || '')}
              onValueChange={(v) => setValue('tipoTransmision', Number(v) as TipoTransmision)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TipoTransmision).filter(([, v]) => typeof v === 'number').map(([, v]) => (
                  <SelectItem key={v} value={String(v)}>{TIPO_TRANSMISION_LABEL[v as TipoTransmision]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Vencimiento SOAT</Label>
            <Input type="date" {...register('fechaVencimientoSOAT')} />
          </div>

          <div className="space-y-1">
            <Label>Vencimiento Tecnomecánica</Label>
            <Input type="date" {...register('fechaVencimientoTecnomecanica')} />
          </div>

          <div className="space-y-1">
            <Label>Número de motor</Label>
            <Input {...register('numeroMotor')} />
          </div>

          <div className="space-y-1">
            <Label>Número de chasis</Label>
            <Input {...register('numeroChasis')} />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="activo_v" {...register('activo')} className="size-4" />
            <Label htmlFor="activo_v">Vehículo activo</Label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="importado" {...register('esImportado')} className="size-4" />
            <Label htmlFor="importado">Es importado</Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(`${basePath}/vehiculos/${vehiculoId}`)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  )
}
