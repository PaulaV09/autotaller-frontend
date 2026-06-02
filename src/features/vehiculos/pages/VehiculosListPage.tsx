import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'
import { PaginationControls } from '@/components/common/PaginationControls'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'
import { usePagination } from '@/hooks/usePagination'
import { useVehiculosList } from '../hooks/useVehiculos'
import { TIPO_COMBUSTIBLE_LABEL, TIPO_TRANSMISION_LABEL } from '@/lib/constants'
import type { VehiculoDto } from '@/types/vehiculo.types'

interface VehiculosListPageProps {
  basePath: string
}

function hasDocumentAlert(v: VehiculoDto): boolean {
  const check = (fecha: string | null) => {
    if (!fecha) return false
    return differenceInDays(parseISO(fecha), new Date()) <= 30
  }
  return check(v.fechaVencimientoSOAT) || check(v.fechaVencimientoTecnomecanica)
}

export function VehiculosListPage({ basePath }: VehiculosListPageProps) {
  const navigate = useNavigate()
  const [vin, setVin] = useState('')
  const { page, pageSize, goToPage, changePageSize } = usePagination()

  const { data, isLoading } = useVehiculosList({
    pageNumber: page,
    pageSize,
    vin: vin || undefined,
  })

  const columns: Column<VehiculoDto>[] = [
    {
      key: 'placa',
      header: 'Placa',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium">{r.placa}</span>
          {hasDocumentAlert(r) && (
            <AlertTriangle className="size-3.5 text-yellow-500" aria-label="Documento próximo a vencer" />
          )}
        </div>
      ),
    },
    { key: 'vin', header: 'VIN', cell: (r) => <span className="font-mono text-xs">{r.vin}</span> },
    { key: 'anio', header: 'Año', cell: (r) => r.anio },
    { key: 'km', header: 'Kilometraje', cell: (r) => `${r.kilometraje.toLocaleString('es-CO')} km` },
    {
      key: 'combustible',
      header: 'Combustible',
      cell: (r) => TIPO_COMBUSTIBLE_LABEL[r.tipoCombustible],
    },
    {
      key: 'transmision',
      header: 'Transmisión',
      cell: (r) => TIPO_TRANSMISION_LABEL[r.tipoTransmision],
    },
    {
      key: 'activo',
      header: 'Estado',
      cell: (r) => (
        <Badge variant={r.activo ? 'default' : 'secondary'}>
          {r.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Vehículos"
        description="Vehículos registrados en el sistema"
      />

      <div className="mb-4 flex gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por VIN..."
            className="pl-9"
            value={vin}
            onChange={(e) => { setVin(e.target.value); goToPage(1) }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        onRowClick={(r) => navigate(`${basePath}/vehiculos/${r.id}`)}
        emptyTitle="No hay vehículos"
        emptyDescription="Los vehículos se registran al crear un cliente."
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
