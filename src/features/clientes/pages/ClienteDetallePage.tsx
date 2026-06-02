import { useParams, useNavigate } from 'react-router-dom'
import { Edit, Car, Wrench, FileText, BarChart3, AlertTriangle } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'
import { OrdenGeneralBadge, PagoBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  useCliente,
  useClienteVehiculos,
  useClienteOrdenes,
  useClienteFacturas,
  useClienteEstadisticas,
} from '../hooks/useClientes'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { ClienteVehiculoResumenDto } from '@/types/cliente.types'
import type { OrdenServicioGeneralDto } from '@/types/orden.types'
import type { FacturaDto } from '@/types/factura.types'

interface ClienteDetallePageProps {
  basePath: string
}

function DocumentAlert({ fecha, label }: { fecha: string | null; label: string }) {
  if (!fecha) return null
  const days = differenceInDays(parseISO(fecha), new Date())
  if (days > 30) return null
  return (
    <div className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${days < 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
      <AlertTriangle className="size-3" />
      {label}: {days < 0 ? `vencido hace ${Math.abs(days)} días` : `vence en ${days} días`}
    </div>
  )
}

export function ClienteDetallePage({ basePath }: ClienteDetallePageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const clienteId = Number(id)

  const { data: cliente, isLoading } = useCliente(clienteId)
  const { data: vehiculos } = useClienteVehiculos(clienteId)
  const { data: ordenes } = useClienteOrdenes(clienteId)
  const { data: facturas } = useClienteFacturas(clienteId)
  const { data: stats } = useClienteEstadisticas(clienteId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!cliente) return <p className="text-muted-foreground">Cliente no encontrado</p>

  const vehiculoColumns: Column<ClienteVehiculoResumenDto>[] = [
    { key: 'placa', header: 'Placa', cell: (r) => <span className="font-mono font-medium">{r.placa}</span> },
    { key: 'anio', header: 'Año', cell: (r) => r.anio },
    {
      key: 'doc',
      header: 'Documentos',
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          <DocumentAlert fecha={r.fechaVencimientoSOAT} label="SOAT" />
          <DocumentAlert fecha={r.fechaVencimientoTecnomecanica} label="Tecno." />
          {!r.fechaVencimientoSOAT && !r.fechaVencimientoTecnomecanica && (
            <span className="text-muted-foreground text-xs">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'propietario',
      header: 'Propiedad',
      cell: (r) => (
        <Badge variant={r.esPropietarioActual ? 'default' : 'secondary'}>
          {r.esPropietarioActual ? 'Actual' : 'Anterior'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      header: '',
      cell: (r) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); navigate(`${basePath}/vehiculos/${r.id}`) }}
        >
          Ver
        </Button>
      ),
    },
  ]

  const ordenColumns: Column<OrdenServicioGeneralDto>[] = [
    { key: 'id', header: '#', cell: (r) => `#${r.id}` },
    { key: 'estado', header: 'Estado', cell: (r) => <OrdenGeneralBadge estado={r.estado} /> },
    { key: 'fecha', header: 'Ingreso', cell: (r) => formatDate(r.fechaIngreso) },
    { key: 'cierre', header: 'Cierre', cell: (r) => formatDate(r.fechaCierre) },
    { key: 'tipo', header: 'Tipo servicio', cell: (r) => `Tipo ${r.tipoServicioId}` },
  ]

  const facturaColumns: Column<FacturaDto>[] = [
    { key: 'numero', header: 'Número', cell: (r) => <span className="font-mono">{r.numeroFactura}</span> },
    { key: 'fecha', header: 'Fecha', cell: (r) => formatDate(r.fechaEmision) },
    { key: 'total', header: 'Total', cell: (r) => formatCurrency(r.total) },
    { key: 'estado', header: 'Estado', cell: (r) => <PagoBadge estado={r.estadoPago} /> },
  ]

  return (
    <div>
      <PageHeader
        title={cliente.nombre}
        description={`${cliente.numeroDocumento} · ${cliente.correo}`}
        backPath={`${basePath}/clientes`}
        action={
          <Button variant="outline" onClick={() => navigate(`${basePath}/clientes/${clienteId}/editar`)}>
            <Edit className="mr-2 size-4" />
            Editar
          </Button>
        }
      />

      {/* Stats cards */}
      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Total órdenes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalOrdenes}</p>
              <p className="text-xs text-muted-foreground">{stats.ordenesActivas} activas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Total facturado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalFacturado)}</p>
              <p className="text-xs text-muted-foreground">Pagado: {formatCurrency(stats.totalPagado)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Saldo pendiente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${stats.saldoPendiente > 0 ? 'text-destructive' : ''}`}>
                {formatCurrency(stats.saldoPendiente)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground">Última visita</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatDate(stats.ultimaVisita)}</p>
              <p className="text-xs text-muted-foreground">{stats.totalVehiculos} vehículo(s)</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="vehiculos">
        <TabsList>
          <TabsTrigger value="vehiculos">
            <Car className="mr-1.5 size-3.5" />
            Vehículos ({vehiculos?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="ordenes">
            <Wrench className="mr-1.5 size-3.5" />
            Órdenes ({ordenes?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="facturas">
            <FileText className="mr-1.5 size-3.5" />
            Facturas ({facturas?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="info">
            <BarChart3 className="mr-1.5 size-3.5" />
            Información
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehiculos" className="mt-4">
          <DataTable
            columns={vehiculoColumns}
            data={vehiculos ?? []}
            getRowKey={(r) => r.id}
            emptyTitle="Sin vehículos"
            emptyDescription="Este cliente no tiene vehículos registrados."
          />
        </TabsContent>

        <TabsContent value="ordenes" className="mt-4">
          <DataTable
            columns={ordenColumns}
            data={ordenes ?? []}
            getRowKey={(r) => r.id}
            onRowClick={(r) => navigate(`/taller/ordenes/${r.id}`)}
            emptyTitle="Sin órdenes"
            emptyDescription="Este cliente no tiene órdenes de servicio."
          />
        </TabsContent>

        <TabsContent value="facturas" className="mt-4">
          <DataTable
            columns={facturaColumns}
            data={facturas ?? []}
            getRowKey={(r) => r.id}
            emptyTitle="Sin facturas"
            emptyDescription="Este cliente no tiene facturas generadas."
          />
        </TabsContent>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardContent className="grid gap-3 pt-4 text-sm sm:grid-cols-2">
              <div><span className="font-medium">Teléfono:</span> {cliente.telefono}</div>
              {cliente.telefonoAlternativo && (
                <div><span className="font-medium">Tel. alternativo:</span> {cliente.telefonoAlternativo}</div>
              )}
              {cliente.direccion && (
                <div><span className="font-medium">Dirección:</span> {cliente.direccion}</div>
              )}
              {cliente.ciudad && (
                <div><span className="font-medium">Ciudad:</span> {cliente.ciudad}</div>
              )}
              {cliente.fechaNacimiento && (
                <div><span className="font-medium">Nacimiento:</span> {formatDate(cliente.fechaNacimiento)}</div>
              )}
              <div>
                <span className="font-medium">Estado:</span>{' '}
                <Badge variant={cliente.activo ? 'default' : 'secondary'}>
                  {cliente.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
