import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable, type Column } from '@/components/common/DataTable'
import { useClientesList } from '@/features/clientes/hooks/useClientes'
import { useCambiarPropietario } from '../hooks/useVehiculos'
import type { ClienteDto } from '@/types/cliente.types'

interface CambiarPropietarioDialogProps {
  vehiculoId: number
  propietarioActualId?: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CambiarPropietarioDialog({
  vehiculoId,
  propietarioActualId,
  open,
  onOpenChange,
}: CambiarPropietarioDialogProps) {
  const [busqueda, setBusqueda] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data, isLoading } = useClientesList({
    pageNumber: 1,
    pageSize: 10,
    nombre: busqueda || undefined,
  })

  const cambiarMutation = useCambiarPropietario(vehiculoId)

  const columns: Column<ClienteDto>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="nuevoCliente"
            value={r.id}
            disabled={r.id === propietarioActualId}
            onChange={() => setSelectedId(r.id)}
            className="size-4"
          />
          <span className="font-medium">{r.nombre}</span>
          {r.id === propietarioActualId && (
            <span className="text-xs text-muted-foreground">(propietario actual)</span>
          )}
        </div>
      ),
    },
    { key: 'doc', header: 'Documento', cell: (r) => r.numeroDocumento },
    { key: 'correo', header: 'Correo', cell: (r) => r.correo },
  ]

  async function handleConfirm() {
    if (!selectedId) return
    if (selectedId === propietarioActualId) {
      toast.error('Selecciona un cliente diferente al propietario actual')
      return
    }

    try {
      await cambiarMutation.mutateAsync(selectedId)
      toast.success('Propietario actualizado exitosamente')
      onOpenChange(false)
      setSelectedId(null)
      setBusqueda('')
    } catch {
      toast.error('No se pudo cambiar el propietario. Revisa si el vehículo tiene órdenes activas.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cambiar propietario</DialogTitle>
          <DialogDescription>
            Selecciona el nuevo propietario del vehículo. El historial anterior se conservará.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Buscar cliente</Label>
            <Input
              placeholder="Escribe el nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="mt-1"
            />
          </div>

          <DataTable
            columns={columns}
            data={data?.items ?? []}
            isLoading={isLoading}
            getRowKey={(r) => r.id}
            emptyTitle="Sin resultados"
            emptyDescription="No se encontraron clientes con ese nombre."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedId || cambiarMutation.isPending}
          >
            {cambiarMutation.isPending ? 'Cambiando...' : 'Confirmar cambio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
