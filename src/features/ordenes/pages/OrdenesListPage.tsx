import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'
import { PaginationControls } from '@/components/common/PaginationControls'
import { OrdenGeneralBadge } from '@/components/common/StatusBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOrdenesGeneralesList } from '../hooks/useOrdenes'
import { usePagination } from '@/hooks/usePagination'
import { formatDate } from '@/lib/utils'
import { EstadoOrdenGeneral } from '@/types/enums'
import { ESTADO_ORDEN_GENERAL_LABEL } from '@/lib/constants'
import type { OrdenServicioGeneralDto } from '@/types/orden.types'

interface OrdenesListPageProps {
  basePath: string
}

export function OrdenesListPage({ basePath }: OrdenesListPageProps) {
  const navigate = useNavigate()
  const [estado, setEstado] = useState<EstadoOrdenGeneral | undefined>()
  const { page, pageSize, goToPage, changePageSize } = usePagination()

  const { data, isLoading } = useOrdenesGeneralesList({
    pageNumber: page,
    pageSize,
    estado,
  })

  const columns: Column<OrdenServicioGeneralDto>[] = [
    { key: 'id', header: '#', cell: (r) => <span className="font-mono font-medium">#{r.id}</span> },
    {
      key: 'estado',
      header: 'Estado',
      cell: (r) => <OrdenGeneralBadge estado={r.estado} />,
    },
    {
      key: 'cliente',
      header: 'Cliente',
      cell: (r) => `Cliente #${r.clienteId}`,
    },
    {
      key: 'vehiculo',
      header: 'Vehículo',
      cell: (r) => `Vehículo #${r.vehiculoId}`,
    },
    {
      key: 'ingreso',
      header: 'Ingreso',
      cell: (r) => formatDate(r.fechaIngreso),
    },
    {
      key: 'entrega',
      header: 'Entrega est.',
      cell: (r) => formatDate(r.fechaEstimadaEntrega),
    },
    {
      key: 'cierre',
      header: 'Cierre',
      cell: (r) => formatDate(r.fechaCierre),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Órdenes de servicio"
        description="Órdenes generales activas e historial"
      />

      <div className="mb-4 flex gap-3">
        <Select
          value={estado !== undefined ? String(estado) : 'all'}
          onValueChange={(v) => {
            setEstado(v === 'all' ? undefined : (Number(v) as EstadoOrdenGeneral))
            goToPage(1)
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {Object.entries(EstadoOrdenGeneral)
              .filter(([, v]) => typeof v === 'number')
              .map(([, v]) => (
                <SelectItem key={v} value={String(v)}>
                  {ESTADO_ORDEN_GENERAL_LABEL[v as EstadoOrdenGeneral]}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        onRowClick={(r) => navigate(`${basePath}/ordenes/${r.id}`)}
        emptyTitle="No hay órdenes"
        emptyDescription="Las órdenes se crean a partir de una inspección."
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
