import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider, useFieldArray, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
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
import { VehiculoFormSection } from '../components/VehiculoFormSection'
import {
  registrarClienteSchema,
  type RegistrarClienteFormValues,
} from '../schemas/cliente.schema'
import { useRegistrarCliente } from '../hooks/useClientes'
import { useTiposDocumento } from '@/features/catalogos/hooks/useCatalogos'
import { TipoCombustible, TipoTransmision } from '@/types/enums'

interface ClienteFormPageProps {
  basePath: string
}

const defaultVehiculo = {
  marcaVehiculoId: 0,
  modeloVehiculoId: 0,
  anio: new Date().getFullYear(),
  vin: '',
  placa: '',
  kilometraje: 0,
  tipoCombustible: TipoCombustible.Gasolina,
  tipoTransmision: TipoTransmision.Manual,
  esImportado: false,
}

export function ClienteFormPage({ basePath }: ClienteFormPageProps) {
  const navigate = useNavigate()
  const { data: tiposDocumento } = useTiposDocumento()
  const registrarMutation = useRegistrarCliente()

  const methods = useForm<RegistrarClienteFormValues>({
    resolver: zodResolver(registrarClienteSchema) as Resolver<RegistrarClienteFormValues>,
    defaultValues: {
      tipoDocumentoId: 0,
      vehiculos: [defaultVehiculo],
    },
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'vehiculos',
  })

  async function onSubmit(values: RegistrarClienteFormValues) {
    try {
      const { vehiculos, ...clienteData } = values
      const payload = {
        ...clienteData,
        direccion: clienteData.direccion || undefined,
        ciudad: clienteData.ciudad || undefined,
        fechaNacimiento: clienteData.fechaNacimiento || undefined,
        telefonoAlternativo: clienteData.telefonoAlternativo || undefined,
        genero: clienteData.genero || undefined,
        vehiculos: vehiculos.map(({ marcaVehiculoId, ...v }) => {
          void marcaVehiculoId
          return {
            ...v,
            color: v.color || undefined,
            cilindraje: Number.isFinite(v.cilindraje) ? v.cilindraje : undefined,
            numeroMotor: v.numeroMotor || undefined,
            numeroChasis: v.numeroChasis || undefined,
            fechaVencimientoSOAT: v.fechaVencimientoSOAT || undefined,
            fechaVencimientoTecnomecanica: v.fechaVencimientoTecnomecanica || undefined,
            paisOrigen: v.paisOrigen || undefined,
            numeroLlave: v.numeroLlave || undefined,
            capacidadCombustibleLitros: Number.isFinite(v.capacidadCombustibleLitros)
              ? v.capacidadCombustibleLitros
              : undefined,
          }
        }),
      }
      const result = await registrarMutation.mutateAsync(payload)
      toast.success('Cliente registrado exitosamente')
      navigate(`${basePath}/clientes/${result.id}`)
    } catch {
      toast.error('Error al registrar el cliente. Verifica los datos.')
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Registrar cliente"
        description="Registra un nuevo cliente con al menos un vehículo"
        backPath={`${basePath}/clientes`}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Datos del cliente */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Datos del cliente
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Tipo documento */}
              <div className="space-y-1">
                <Label>Tipo de documento *</Label>
                <Select onValueChange={(v) => setValue('tipoDocumentoId', Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocumento?.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipoDocumentoId && (
                  <p className="text-xs text-destructive">{errors.tipoDocumentoId.message}</p>
                )}
              </div>

              {/* Número documento */}
              <div className="space-y-1">
                <Label>Número de documento *</Label>
                <Input placeholder="1234567890" {...register('numeroDocumento')} />
                {errors.numeroDocumento && (
                  <p className="text-xs text-destructive">{errors.numeroDocumento.message}</p>
                )}
              </div>

              {/* Nombre */}
              <div className="space-y-1 sm:col-span-2">
                <Label>Nombre completo *</Label>
                <Input placeholder="Juan Carlos Pérez" {...register('nombre')} />
                {errors.nombre && (
                  <p className="text-xs text-destructive">{errors.nombre.message}</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-1">
                <Label>Teléfono *</Label>
                <Input placeholder="3001234567" {...register('telefono')} />
                {errors.telefono && (
                  <p className="text-xs text-destructive">{errors.telefono.message}</p>
                )}
              </div>

              {/* Correo */}
              <div className="space-y-1">
                <Label>Correo electrónico *</Label>
                <Input type="email" placeholder="juan@correo.com" {...register('correo')} />
                {errors.correo && (
                  <p className="text-xs text-destructive">{errors.correo.message}</p>
                )}
              </div>

              {/* Dirección */}
              <div className="space-y-1">
                <Label>Dirección</Label>
                <Input placeholder="Calle 123 # 45-67" {...register('direccion')} />
              </div>

              {/* Ciudad */}
              <div className="space-y-1">
                <Label>Ciudad</Label>
                <Input placeholder="Bogotá" {...register('ciudad')} />
              </div>

              {/* Teléfono alternativo */}
              <div className="space-y-1">
                <Label>Teléfono alternativo</Label>
                <Input placeholder="3009876543" {...register('telefonoAlternativo')} />
              </div>

              {/* Fecha de nacimiento */}
              <div className="space-y-1">
                <Label>Fecha de nacimiento</Label>
                <Input type="date" {...register('fechaNacimiento')} />
              </div>

              {/* Género */}
              <div className="space-y-1">
                <Label>Género</Label>
                <Select onValueChange={(v) => setValue('genero', String(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                    <SelectItem value="No especificado">No especificado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Vehículos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Vehículos
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append(defaultVehiculo)}
              >
                <Plus className="mr-1 size-3.5" />
                Agregar vehículo
              </Button>
            </div>

            {errors.vehiculos && !Array.isArray(errors.vehiculos) && (
              <p className="text-sm text-destructive">{errors.vehiculos.message}</p>
            )}

            {fields.map((field, index) => (
              <VehiculoFormSection
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
                showRemove={fields.length > 1}
              />
            ))}
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`${basePath}/clientes`)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrar cliente'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
