import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Edit, UserRoundCog } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'
import { OrdenGeneralBadge, InspeccionBadge } from '@/components/common/StatusBadge'
import { VehicleDocumentAlert } from '../components/VehicleDocumentAlert'
import { CambiarPropietarioDialog } from '../components/CambiarPropietarioDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useVehiculo, useVehiculoPropietarios, useVehiculoHistorial } from '../hooks/useVehiculos'
import { TIPO_COMBUSTIBLE_LABEL, TIPO_TRANSMISION_LABEL } from '@/lib/constants'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { PropietarioHistorialDto } from '@/types/vehiculo.types'
import { useAuth } from '@/hooks/useAuth'

interface VehiculoDetallePageProps {
  basePath: string
}

export function VehiculoDetallePage({ basePath }: VehiculoDetallePageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const vehiculoId = Number(id)
  const [cambiarPropietarioOpen, setCambiarPropietarioOpen] = useState(false)

  const { data: vehiculo, isLoading } = useVehiculo(vehiculoId)
  const { data: propietarios } = useVehiculoPropietarios(vehiculoId)
  const { data: historial } = useVehiculoHistorial(vehiculoId)

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!vehiculo) return <p className="text-muted-foreground">Vehículo no encontrado</p>

  const propietarioActual = propietarios?.find((p) => p.esPropietarioActual)

  const propietarioColumns: Column<PropietarioHistorialDto>[] = [
    { key: 'nombre', header: 'Cliente', cell: (r) => <span className="font-medium">{r.nombreCliente}</span> },
    { key: 'doc', header: 'Documento', cell: (r) => r.numeroDocumento },
    { key: 'inicio', header: 'Desde', cell: (r) => formatDate(r.fechaInicio) },
    { key: 'fin', header: 'Hasta', cell: (r) => formatDate(r.fechaFin) },
    {
      key: 'actual',
      header: 'Estado',
      cell: (r) => (
        <Badge variant={r.esPropietarioActual ? 'default' : 'secondary'}>
          {r.esPropietarioActual ? 'Actual' : 'Anterior'}
        </Badge>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={vehiculo.placa}
        description={`VIN: ${vehiculo.vin} · Año: ${vehiculo.anio}`}
        backPath={`${basePath}/vehiculos`}
        action={
          <div className="flex gap-2">
            {hasRole('Recepcionista', 'SuperAdministrador') && (
              <Button
                variant="outline"
                onClick={() => setCambiarPropietarioOpen(true)}
              >
                <UserRoundCog className="mr-2 size-4" />
                Cambiar propietario
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate(`${basePath}/vehiculos/${vehiculoId}/editar`)}
            >
              <Edit className="mr-2 size-4" />
              Editar
            </Button>
          </div>
        }
      />

      {/* Alertas de documentos */}
      <div className="mb-5 grid gap-2 sm:grid-cols-2">
        <VehicleDocumentAlert label="SOAT" fecha={vehiculo.fechaVencimientoSOAT} />
        <VehicleDocumentAlert label="Revisión Tecnomecánica" fecha={vehiculo.fechaVencimientoTecnomecanica} />
      </div>

      {/* Datos técnicos */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Datos técnicos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
          <div><span className="font-medium">Combustible:</span> {TIPO_COMBUSTIBLE_LABEL[vehiculo.tipoCombustible]}</div>
          <div><span className="font-medium">Transmisión:</span> {TIPO_TRANSMISION_LABEL[vehiculo.tipoTransmision]}</div>
          <div><span className="font-medium">Kilometraje:</span> {vehiculo.kilometraje.toLocaleString('es-CO')} km</div>
          {vehiculo.color && <div><span className="font-medium">Color:</span> {vehiculo.color}</div>}
          {vehiculo.cilindraje && <div><span className="font-medium">Cilindraje:</span> {vehiculo.cilindraje} cc</div>}
          {vehiculo.numeroMotor && <div><span className="font-medium">Motor:</span> {vehiculo.numeroMotor}</div>}
          {vehiculo.numeroChasis && <div><span className="font-medium">Chasis:</span> {vehiculo.numeroChasis}</div>}
          {vehiculo.paisOrigen && <div><span className="font-medium">País origen:</span> {vehiculo.paisOrigen}</div>}
          {vehiculo.numeroLlave && <div><span className="font-medium">Llave:</span> {vehiculo.numeroLlave}</div>}
          {vehiculo.capacidadCombustibleLitros && (
            <div>
              <span className="font-medium">Capacidad combustible:</span>{' '}
              {vehiculo.capacidadCombustibleLitros} L
            </div>
          )}
          <div>
            <span className="font-medium">Importado:</span>{' '}
            <Badge variant={vehiculo.esImportado ? 'default' : 'secondary'}>
              {vehiculo.esImportado ? 'Sí' : 'No'}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Propietario actual:</span>{' '}
            {propietarioActual?.nombreCliente ?? '—'}
          </div>
        </CardContent>
      </Card>

      {/* Historial */}
      {historial && (
        <div className="mb-4 text-sm text-muted-foreground">
          Total gastado en este vehículo: <span className="font-medium text-foreground">{formatCurrency(historial.totalGastado)}</span>
        </div>
      )}

      <Tabs defaultValue="propietarios">
        <TabsList>
          <TabsTrigger value="propietarios">Propietarios ({propietarios?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="inspecciones">Inspecciones ({historial?.inspecciones.length ?? 0})</TabsTrigger>
          <TabsTrigger value="ordenes">Órdenes ({historial?.ordenes.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="propietarios" className="mt-4">
          <DataTable
            columns={propietarioColumns}
            data={propietarios ?? []}
            getRowKey={(r) => `${r.clienteId}-${r.fechaInicio}`}
            emptyTitle="Sin historial"
          />
        </TabsContent>

        <TabsContent value="inspecciones" className="mt-4">
          <DataTable
            columns={[
              { key: 'fecha', header: 'Fecha', cell: (r) => formatDate(r.fechaInspeccion) },
              { key: 'km', header: 'Kilometraje', cell: (r) => `${r.kilometrajeActual.toLocaleString('es-CO')} km` },
              { key: 'estado', header: 'Estado', cell: (r) => <InspeccionBadge estado={r.estado} /> },
              { key: 'obs', header: 'Observaciones', cell: (r) => <span className="text-sm text-muted-foreground truncate max-w-xs block">{r.observacionesGenerales}</span> },
            ]}
            data={historial?.inspecciones ?? []}
            getRowKey={(r) => r.id}
            emptyTitle="Sin inspecciones"
          />
        </TabsContent>

        <TabsContent value="ordenes" className="mt-4">
          <DataTable
            columns={[
              { key: 'id', header: '#', cell: (r) => `#${r.id}` },
              { key: 'estado', header: 'Estado', cell: (r) => <OrdenGeneralBadge estado={r.estado} /> },
              { key: 'fecha', header: 'Ingreso', cell: (r) => formatDate(r.fechaIngreso) },
              { key: 'cierre', header: 'Cierre', cell: (r) => formatDate(r.fechaCierre) },
              { key: 'total', header: 'Total', cell: (r) => r.totalFacturado != null ? formatCurrency(r.totalFacturado) : '—' },
            ]}
            data={historial?.ordenes ?? []}
            getRowKey={(r) => r.id}
            onRowClick={(r) => navigate(`/taller/ordenes/${r.id}`)}
            emptyTitle="Sin órdenes"
          />
        </TabsContent>
      </Tabs>

      <CambiarPropietarioDialog
        vehiculoId={vehiculoId}
        propietarioActualId={propietarioActual?.clienteId}
        open={cambiarPropietarioOpen}
        onOpenChange={setCambiarPropietarioOpen}
      />
    </div>
  )
}
