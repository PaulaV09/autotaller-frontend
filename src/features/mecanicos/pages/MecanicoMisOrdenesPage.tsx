import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'
import { OrdenAreaBadge } from '@/components/common/StatusBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useMisOrdenes } from '@/features/ordenes/hooks/useOrdenes'
import { useAreasServicio } from '@/features/catalogos/hooks/useCatalogos'
import { formatCurrency } from '@/lib/utils'
import { EstadoOrdenArea } from '@/types/enums'
import { ESTADO_ORDEN_AREA_LABEL } from '@/lib/constants'
import type { OrdenServicioAreaDto } from '@/types/orden.types'

export function MecanicoMisOrdenesPage() {
  const navigate = useNavigate()
  const [estado, setEstado] = useState<EstadoOrdenArea | undefined>()
  const { data: ordenes, isLoading } = useMisOrdenes(estado)
  const { data: areasServicio } = useAreasServicio()

  const columns: Column<OrdenServicioAreaDto>[] = [
    { key: 'id', header: '#', cell: (r) => <span className="font-mono font-medium">#{r.id}</span> },
    {
      key: 'area',
      header: 'Área',
      cell: (r) => areasServicio?.find((a) => a.id === r.areaServicioId)?.nombre ?? `#${r.areaServicioId}`,
    },
    {
      key: 'estado',
      header: 'Estado',
      cell: (r) => <OrdenAreaBadge estado={r.estado} />,
    },
    {
      key: 'diagnostico',
      header: 'Diagnóstico',
      cell: (r) => (
        <span className="line-clamp-1 max-w-xs text-sm text-muted-foreground">{r.diagnostico || '—'}</span>
      ),
    },
    {
      key: 'costo',
      header: 'Costo estimado',
      cell: (r) => formatCurrency(r.costoManoObraEstimado),
    },
  ]

  // Estados relevantes para el mecánico (excluye finales del panel)
  const estadosRelevantes = [
    EstadoOrdenArea.Diagnostico,
    EstadoOrdenArea.EsperandoAprobacionJefeTaller,
    EstadoOrdenArea.EsperandoAprobacionCliente,
    EstadoOrdenArea.Aprobada,
    EstadoOrdenArea.EnProceso,
    EstadoOrdenArea.Completada,
  ]

  return (
    <div>
      <PageHeader
        title="Mis órdenes asignadas"
        description="Órdenes de área que tienes asignadas"
      />

      <div className="mb-4">
        <Select
          value={estado !== undefined ? String(estado) : 'all'}
          onValueChange={(v) => setEstado(v === 'all' ? undefined : (Number(v) as EstadoOrdenArea))}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {estadosRelevantes.map((e) => (
              <SelectItem key={e} value={String(e)}>
                {ESTADO_ORDEN_AREA_LABEL[e]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={ordenes ?? []}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        onRowClick={(r) => navigate(`/mecanico/mis-ordenes/${r.id}`)}
        emptyTitle="No tienes órdenes asignadas"
        emptyDescription="El Jefe de Taller te asignará órdenes cuando haya trabajo disponible."
      />
    </div>
  )
}
