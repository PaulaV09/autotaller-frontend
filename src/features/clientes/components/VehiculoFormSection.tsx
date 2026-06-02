import { useEffect } from 'react'
import { useFormContext, useWatch, type Path } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMarcasVehiculo, useModelosVehiculo } from '@/features/catalogos/hooks/useCatalogos'
import { TipoCombustible, TipoTransmision } from '@/types/enums'
import { TIPO_COMBUSTIBLE_LABEL, TIPO_TRANSMISION_LABEL } from '@/lib/constants'
import type { RegistrarClienteFormValues } from '../schemas/cliente.schema'

interface VehiculoFormSectionProps {
  index: number
  onRemove: () => void
  showRemove: boolean
}

type VPath = Path<RegistrarClienteFormValues>

export function VehiculoFormSection({ index, onRemove, showRemove }: VehiculoFormSectionProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<RegistrarClienteFormValues>()

  // Helper tipado para paths de vehiculo[index]
  const vp = (f: string): VPath => `vehiculos.${index}.${f}` as VPath

  const marcaId = useWatch({ name: vp('marcaVehiculoId') }) as number
  const { data: marcas } = useMarcasVehiculo()
  const { data: modelos } = useModelosVehiculo(marcaId > 0 ? marcaId : undefined)

  useEffect(() => {
    setValue(vp('modeloVehiculoId'), 0 as never)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marcaId, index])

  const vErr = errors.vehiculos?.[index]

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Vehículo {index + 1}</h4>
        {showRemove && (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Marca */}
        <div className="space-y-1">
          <Label>Marca *</Label>
          <Select
            onValueChange={(v) => setValue(vp('marcaVehiculoId'), Number(v) as never)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una marca" />
            </SelectTrigger>
            <SelectContent>
              {marcas?.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {vErr?.marcaVehiculoId && (
            <p className="text-xs text-destructive">{vErr.marcaVehiculoId.message}</p>
          )}
        </div>

        {/* Modelo */}
        <div className="space-y-1">
          <Label>Modelo *</Label>
          <Select
            disabled={!marcaId || marcaId <= 0}
            onValueChange={(v) => setValue(vp('modeloVehiculoId'), Number(v) as never)}
          >
            <SelectTrigger>
              <SelectValue placeholder={marcaId > 0 ? 'Selecciona un modelo' : 'Selecciona marca primero'} />
            </SelectTrigger>
            <SelectContent>
              {modelos?.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {vErr?.modeloVehiculoId && (
            <p className="text-xs text-destructive">{vErr.modeloVehiculoId.message}</p>
          )}
        </div>

        {/* Año */}
        <div className="space-y-1">
          <Label>Año *</Label>
          <Input
            type="number"
            placeholder={String(new Date().getFullYear())}
            {...register(vp('anio'), { valueAsNumber: true })}
          />
          {vErr?.anio && <p className="text-xs text-destructive">{vErr.anio.message}</p>}
        </div>

        {/* Placa */}
        <div className="space-y-1">
          <Label>Placa *</Label>
          <Input placeholder="ABC123" {...register(vp('placa'))} />
          {vErr?.placa && <p className="text-xs text-destructive">{vErr.placa.message}</p>}
        </div>

        {/* VIN */}
        <div className="space-y-1">
          <Label>VIN *</Label>
          <Input placeholder="17 caracteres" maxLength={17} {...register(vp('vin'))} />
          {vErr?.vin && <p className="text-xs text-destructive">{vErr.vin.message}</p>}
        </div>

        {/* Kilometraje */}
        <div className="space-y-1">
          <Label>Kilometraje *</Label>
          <Input
            type="number"
            placeholder="0"
            {...register(vp('kilometraje'), { valueAsNumber: true })}
          />
          {vErr?.kilometraje && <p className="text-xs text-destructive">{vErr.kilometraje.message}</p>}
        </div>

        {/* Combustible */}
        <div className="space-y-1">
          <Label>Combustible *</Label>
          <Select
            onValueChange={(v) => setValue(vp('tipoCombustible'), Number(v) as never)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TipoCombustible)
                .filter(([, v]) => typeof v === 'number')
                .map(([, v]) => (
                  <SelectItem key={v} value={String(v)}>
                    {TIPO_COMBUSTIBLE_LABEL[v as TipoCombustible]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {vErr?.tipoCombustible && <p className="text-xs text-destructive">{vErr.tipoCombustible.message}</p>}
        </div>

        {/* Transmisión */}
        <div className="space-y-1">
          <Label>Transmisión *</Label>
          <Select
            onValueChange={(v) => setValue(vp('tipoTransmision'), Number(v) as never)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TipoTransmision)
                .filter(([, v]) => typeof v === 'number')
                .map(([, v]) => (
                  <SelectItem key={v} value={String(v)}>
                    {TIPO_TRANSMISION_LABEL[v as TipoTransmision]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {vErr?.tipoTransmision && <p className="text-xs text-destructive">{vErr.tipoTransmision.message}</p>}
        </div>

        {/* Color (opcional) */}
        <div className="space-y-1">
          <Label>Color</Label>
          <Input placeholder="Ej: Blanco" {...register(vp('color'))} />
        </div>

        {/* SOAT */}
        <div className="space-y-1">
          <Label>Vencimiento SOAT</Label>
          <Input type="date" {...register(vp('fechaVencimientoSOAT'))} />
        </div>

        {/* Tecnomecánica */}
        <div className="space-y-1">
          <Label>Vencimiento Tecnomecánica</Label>
          <Input type="date" {...register(vp('fechaVencimientoTecnomecanica'))} />
        </div>

        {/* Número de motor */}
        <div className="space-y-1">
          <Label>Número de motor</Label>
          <Input {...register(vp('numeroMotor'))} />
        </div>
      </div>
    </div>
  )
}
