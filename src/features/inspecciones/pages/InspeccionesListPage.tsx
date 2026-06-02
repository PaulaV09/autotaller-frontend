import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'
import { PaginationControls } from '@/components/common/PaginationControls'
import { InspeccionBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useInspeccionesList } from '../hooks/useInspecciones'
import { usePagination } from '@/hooks/usePagination'
import { formatDate } from '@/lib/utils'
import { EstadoInspeccion } from '@/types/enums'
import type { InspeccionVehiculoDto } from '@/types/inspeccion.types'

interface InspeccionesListPageProps {
  basePath: string
}

export function InspeccionesListPage({ basePath }: InspeccionesListPageProps) {
  const navigate = useNavigate()
  const [estado, setEstado] = useState<EstadoInspeccion | undefined>()
  const { page, pageSize, goToPage, changePageSize } = usePagination()

  const { data, isLoading } = useInspeccionesList({
    pageNumber: page,
    pageSize,
    estado,
  })

  const columns: Column<InspeccionVehiculoDto>[] = [
    { key: 'id', header: '#', cell: (r) => `#${r.id}` },
    {
      key: 'fecha',
      header: 'Fecha',
      cell: (r) => formatDate(r.fechaInspeccion),
    },
    {
      key: 'vehiculo',
      header: 'Vehículo',
      cell: (r) => `ID #${r.vehiculoId}`,
    },
    {
      key: 'km',
      header: 'Kilometraje',
      cell: (r) => `${r.kilometrajeActual.toLocaleString('es-CO')} km`,
    },
    {
      key: 'estado',
      header: 'Estado',
      cell: (r) => <InspeccionBadge estado={r.estado} />,
    },
    {
      key: 'obs',
      header: 'Observaciones',
      cell: (r) => (
        <span className="block max-w-xs truncate text-sm text-muted-foreground">
          {r.observacionesGenerales}
        </span>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Inspecciones"
        description="Registro de inspecciones de vehículos"
        action={
          <Button onClick={() => navigate(`${basePath}/inspecciones/nueva`)}>
            <Plus className="mr-2 size-4" />
            Nueva inspección
          </Button>
        }
      />

      <div className="mb-4 flex gap-3">
        <Select
          value={estado !== undefined ? String(estado) : 'all'}
          onValueChange={(v) => {
            setEstado(v === 'all' ? undefined : (Number(v) as EstadoInspeccion))
            goToPage(1)
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value={String(EstadoInspeccion.Completada)}>Completada</SelectItem>
            <SelectItem value={String(EstadoInspeccion.DerivadaAOrden)}>Derivada a orden</SelectItem>
            <SelectItem value={String(EstadoInspeccion.Cancelada)}>Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        onRowClick={(r) => navigate(`${basePath}/inspecciones/${r.id}`)}
        emptyTitle="No hay inspecciones"
        emptyDescription="Crea la primera inspección con el botón de arriba."
      />

      <PaginationControls
        currentPage={page}
        totalCount={data?.totalCount ?? 0}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
      />
    </div>
  )
}
