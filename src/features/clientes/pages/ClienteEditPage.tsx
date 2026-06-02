import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
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
import { useCliente, useUpdateCliente } from '../hooks/useClientes'
import { editarClienteSchema, type EditarClienteFormValues } from '../schemas/cliente.schema'

interface ClienteEditPageProps {
  basePath: string
}

export function ClienteEditPage({ basePath }: ClienteEditPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const clienteId = Number(id)

  const { data: cliente, isLoading } = useCliente(clienteId)
  const updateMutation = useUpdateCliente(clienteId)

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditarClienteFormValues>({
    resolver: zodResolver(editarClienteSchema),
  })

  useEffect(() => {
    if (cliente) {
      reset({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        correo: cliente.correo,
        direccion: cliente.direccion ?? '',
        ciudad: cliente.ciudad ?? '',
        activo: cliente.activo,
        fechaNacimiento: cliente.fechaNacimiento ?? '',
        telefonoAlternativo: cliente.telefonoAlternativo ?? '',
        genero: cliente.genero ?? '',
      })
    }
  }, [cliente, reset])

  async function onSubmit(values: EditarClienteFormValues) {
    try {
      await updateMutation.mutateAsync({
        ...values,
        direccion: values.direccion || null,
        ciudad: values.ciudad || null,
        fechaNacimiento: values.fechaNacimiento || null,
        telefonoAlternativo: values.telefonoAlternativo || null,
        genero: values.genero || null,
      })
      toast.success('Cliente actualizado')
      navigate(`${basePath}/clientes/${clienteId}`)
    } catch {
      toast.error('Error al actualizar el cliente')
    }
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Editar cliente"
        description={cliente?.nombre}
        backPath={`${basePath}/clientes/${clienteId}`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border bg-card p-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <Label>Nombre completo *</Label>
            <Input {...register('nombre')} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Teléfono *</Label>
            <Input {...register('telefono')} />
            {errors.telefono && <p className="text-xs text-destructive">{errors.telefono.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Correo *</Label>
            <Input type="email" {...register('correo')} />
            {errors.correo && <p className="text-xs text-destructive">{errors.correo.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Dirección</Label>
            <Input {...register('direccion')} />
          </div>

          <div className="space-y-1">
            <Label>Ciudad</Label>
            <Input {...register('ciudad')} />
          </div>

          <div className="space-y-1">
            <Label>Teléfono alternativo</Label>
            <Input {...register('telefonoAlternativo')} />
          </div>

          <div className="space-y-1">
            <Label>Fecha de nacimiento</Label>
            <Input type="date" {...register('fechaNacimiento')} />
          </div>

          <div className="space-y-1">
            <Label>Género</Label>
            <Select
              value={watch('genero') || ''}
              onValueChange={(v) => setValue('genero', String(v))}
            >
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

          <div className="flex items-center gap-2">
            <input type="checkbox" id="activo" {...register('activo')} className="size-4" />
            <Label htmlFor="activo">Cliente activo</Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`${basePath}/clientes/${clienteId}`)}
          >
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
