import { useState } from 'react'
import { toast } from 'sonner'
import { Wrench, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMecanicos, useMecanicoAreas, useAsignarArea, useRemoverArea } from '../hooks/useMecanicos'
import { useAreasServicio } from '@/features/catalogos/hooks/useCatalogos'

export function MecanicosPage() {
  const { data: mecanicos, isLoading } = useMecanicos()
  const { data: areasServicio } = useAreasServicio()
  const [selectedMecanico, setSelectedMecanico] = useState<number | null>(null)
  const [asignarOpen, setAsignarOpen] = useState(false)
  const [areaToAdd, setAreaToAdd] = useState(0)

  const { data: areas } = useMecanicoAreas(selectedMecanico ?? 0)
  const asignarMutation = useAsignarArea()
  const removerMutation = useRemoverArea()

  async function handleAsignar() {
    if (!selectedMecanico || !areaToAdd) return
    try {
      await asignarMutation.mutateAsync({ mecanicoId: selectedMecanico, areaId: areaToAdd })
      toast.success('Área asignada')
      setAsignarOpen(false)
      setAreaToAdd(0)
    } catch { toast.error('Error al asignar área') }
  }

  async function handleRemover(mecanicoId: number, areaId: number) {
    try {
      await removerMutation.mutateAsync({ mecanicoId, areaId })
      toast.success('Área removida')
    } catch { toast.error('Error al remover área') }
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <div>
      <PageHeader
        title="Mecánicos"
        description="Gestión de mecánicos y sus áreas de especialidad"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mecanicos?.map((m) => (
          <Card
            key={m.id}
            className={`cursor-pointer transition-colors ${selectedMecanico === m.id ? 'border-primary ring-1 ring-primary' : ''}`}
            onClick={() => setSelectedMecanico(m.id === selectedMecanico ? null : m.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{m.nombre}</span>
                <Badge variant={m.activo ? 'default' : 'secondary'}>
                  {m.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground">{m.correo}</p>
            </CardHeader>
          </Card>
        ))}

        {(!mecanicos || mecanicos.length === 0) && (
          <p className="text-sm text-muted-foreground col-span-full">
            No hay mecánicos registrados. Créalos desde la sección de Usuarios.
          </p>
        )}
      </div>

      {selectedMecanico && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">
              Áreas de {mecanicos?.find((m) => m.id === selectedMecanico)?.nombre}
            </h3>
            <Button size="sm" onClick={() => setAsignarOpen(true)}>
              <Plus className="mr-1.5 size-4" />
              Asignar área
            </Button>
          </div>

          {areas && areas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <div
                  key={a.areaServicioId}
                  className="flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1.5 text-sm"
                >
                  <Wrench className="size-3 text-muted-foreground" />
                  {a.nombreArea}
                  <button
                    className="ml-1 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemover(selectedMecanico, a.areaServicioId)}
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Este mecánico no tiene áreas asignadas.</p>
          )}
        </div>
      )}

      <Dialog open={asignarOpen} onOpenChange={setAsignarOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Asignar área de especialidad</DialogTitle></DialogHeader>
          <Select onValueChange={(v) => setAreaToAdd(Number(v))}>
            <SelectTrigger><SelectValue placeholder="Selecciona el área" /></SelectTrigger>
            <SelectContent>
              {areasServicio
                ?.filter((a) => !areas?.some((ma) => ma.areaServicioId === a.id))
                .map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAsignarOpen(false)}>Cancelar</Button>
            <Button onClick={handleAsignar} disabled={asignarMutation.isPending || !areaToAdd}>
              {asignarMutation.isPending ? '...' : 'Asignar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
