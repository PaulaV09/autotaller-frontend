import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'
import type { FacturaDto } from '@/types/factura.types'
import type { RepuestoDto, ProveedorDto, OrdenCompraResumenDto } from '@/types/repuesto.types'
import type { SolicitudRepuestoOrdenAreaDto } from '@/types/inventario.types'
import type { UsuarioDto } from '@/types/auth.types'
import type { AuditoriaDto, ErrorSistemaDto } from '@/types/auditoria.types'
import type {
  AreaServicio,
  CategoriaRepuesto,
  MetodoPago,
  TipoServicio,
} from '@/types/catalogo.types'
import { facturasService } from '@/api/services/facturas.service'
import { repuestosService } from '@/api/services/repuestos.service'
import { proveedoresService } from '@/api/services/proveedores.service'
import { inventarioService } from '@/api/services/inventario.service'
import { ordenesCompraService } from '@/api/services/ordenes-compra.service'
import { usuariosService } from '@/api/services/usuarios.service'
import { auditoriasService } from '@/api/services/auditorias.service'
import { configuracionService } from '@/api/services/configuracion.service'
import { reportesService } from '@/api/services/reportes.service'
import { portalService } from '@/api/services/portal.service'
import { authService } from '@/api/services/auth.service'
import { catalogosService } from '@/api/services/catalogos.service'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  ESTADO_APROBACION_LABEL,
  ESTADO_ORDEN_AREA_LABEL,
  ESTADO_ORDEN_COMPRA_LABEL,
  ESTADO_ORDEN_GENERAL_LABEL,
  ESTADO_PAGO_FACTURA_LABEL,
  ESTADO_SOLICITUD_REPUESTO_LABEL,
} from '@/lib/constants'
import { EstadoAprobacion, EstadoOrdenArea, EstadoPagoFactura } from '@/types/enums'
import type { PortalOrdenAreaDetalleDto, PortalOrdenResumenDto, PortalVehiculoResumenDto } from '@/types/portal.types'

function money(value: number) {
  return formatCurrency(value)
}

export function FacturasPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['facturas', 'page'],
    queryFn: () => facturasService.list({ pageNumber: 1, pageSize: 50 }),
  })

  const columns: Column<FacturaDto>[] = [
    { key: 'numero', header: 'Factura', cell: (r) => <span className="font-mono">{r.numeroFactura}</span> },
    { key: 'orden', header: 'Orden', cell: (r) => `#${r.ordenServicioGeneralId}` },
    { key: 'fecha', header: 'Fecha', cell: (r) => formatDate(r.fechaEmision) },
    { key: 'total', header: 'Total', cell: (r) => money(r.total) },
    {
      key: 'estado',
      header: 'Estado',
      cell: (r) => <Badge variant="secondary">{ESTADO_PAGO_FACTURA_LABEL[r.estadoPago]}</Badge>,
    },
  ]

  return (
    <div>
      <PageHeader title="Facturas" description="Facturas emitidas y estado de pago" />
      <DataTable columns={columns} data={data?.items ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin facturas" />
    </div>
  )
}

export function RepuestosPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['repuestos', 'page'],
    queryFn: () => repuestosService.list({ pageNumber: 1, pageSize: 50 }),
  })

  const columns: Column<RepuestoDto>[] = [
    { key: 'codigo', header: 'Código', cell: (r) => <span className="font-mono">{r.codigo}</span> },
    { key: 'descripcion', header: 'Descripción', cell: (r) => r.descripcion },
    { key: 'bodega', header: 'Bodega', cell: (r) => r.stockBodega },
    { key: 'almacen', header: 'Almacén', cell: (r) => r.stockAlmacen },
    { key: 'reservado', header: 'Reservado', cell: (r) => r.stockReservado },
    { key: 'obra', header: 'En obra', cell: (r) => r.stockEnObra },
    { key: 'precio', header: 'Precio', cell: (r) => money(r.precioUnitario) },
  ]

  return (
    <div>
      <PageHeader title="Repuestos" description="Catálogo y existencias de repuestos" />
      <DataTable columns={columns} data={data?.items ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin repuestos" />
    </div>
  )
}

export function ProveedoresPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['proveedores', 'page'],
    queryFn: () => proveedoresService.list({ pageNumber: 1, pageSize: 50 }),
  })

  const columns: Column<ProveedorDto>[] = [
    { key: 'nombre', header: 'Proveedor', cell: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: 'telefono', header: 'Teléfono', cell: (r) => r.telefono },
    { key: 'correo', header: 'Correo', cell: (r) => r.correo },
    { key: 'estado', header: 'Estado', cell: (r) => <Badge variant={r.activo ? 'default' : 'secondary'}>{r.activo ? 'Activo' : 'Inactivo'}</Badge> },
  ]

  return (
    <div>
      <PageHeader title="Proveedores" description="Directorio de proveedores de repuestos" />
      <DataTable columns={columns} data={data?.items ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin proveedores" />
    </div>
  )
}

export function InventarioSolicitudesPage() {
  const qc = useQueryClient()
  const { hasRole } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['inventario', 'solicitudes'],
    queryFn: () => inventarioService.getSolicitudes(),
  })
  const avanzar = useMutation({
    mutationFn: ({ id, action }: { id: number; action: 'bodega' | 'almacen' | 'mecanico' }) => {
      const body = { observacion: 'Procesado desde panel operativo' }
      if (action === 'bodega') return inventarioService.enviarABodega(id, body)
      if (action === 'almacen') return inventarioService.entregarAAlmacen(id, body)
      return inventarioService.entregarAMecanico(id, body)
    },
    onSuccess: () => {
      toast.success('Solicitud actualizada')
      qc.invalidateQueries({ queryKey: ['inventario', 'solicitudes'] })
    },
    onError: () => toast.error('No se pudo avanzar la solicitud'),
  })

  const columns: Column<SolicitudRepuestoOrdenAreaDto>[] = [
    { key: 'id', header: '#', cell: (r) => `#${r.id}` },
    { key: 'area', header: 'Orden área', cell: (r) => `#${r.ordenServicioAreaId}` },
    { key: 'fecha', header: 'Solicitud', cell: (r) => formatDate(r.fechaSolicitud) },
    { key: 'estado', header: 'Estado', cell: (r) => <Badge variant="secondary">{ESTADO_SOLICITUD_REPUESTO_LABEL[r.estado]}</Badge> },
    {
      key: 'acciones',
      header: '',
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          {hasRole('JefeAlmacen', 'SuperAdministrador') && r.estado === 1 && (
            <Button size="sm" variant="outline" onClick={() => avanzar.mutate({ id: r.id, action: 'bodega' })}>Enviar a bodega</Button>
          )}
          {hasRole('JefeBodega', 'SuperAdministrador') && r.estado === 2 && (
            <Button size="sm" variant="outline" onClick={() => avanzar.mutate({ id: r.id, action: 'almacen' })}>Entregar a almacén</Button>
          )}
          {hasRole('JefeAlmacen', 'SuperAdministrador') && r.estado === 3 && (
            <Button size="sm" variant="outline" onClick={() => avanzar.mutate({ id: r.id, action: 'mecanico' })}>Entregar a mecánico</Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Solicitudes de repuestos" description="Flujo almacén, bodega y entrega a mecánico" />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin solicitudes" />
    </div>
  )
}

export function OrdenesCompraPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['ordenes-compra', 'page'],
    queryFn: () => ordenesCompraService.list({ pageNumber: 1, pageSize: 50 }),
  })

  const columns: Column<OrdenCompraResumenDto>[] = [
    { key: 'id', header: '#', cell: (r) => `#${r.id}` },
    { key: 'proveedor', header: 'Proveedor', cell: (r) => r.nombreProveedor },
    { key: 'fecha', header: 'Creación', cell: (r) => formatDate(r.fechaCreacion) },
    { key: 'estado', header: 'Estado', cell: (r) => <Badge variant="secondary">{ESTADO_ORDEN_COMPRA_LABEL[r.estado]}</Badge> },
    { key: 'items', header: 'Items', cell: (r) => r.totalRepuestos },
  ]

  return (
    <div>
      <PageHeader title="Órdenes de compra" description="Compras a proveedores" />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin órdenes de compra" />
    </div>
  )
}

export function UsuariosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['usuarios'], queryFn: usuariosService.list })
  const columns: Column<UsuarioDto>[] = [
    { key: 'nombre', header: 'Nombre', cell: (r) => <span className="font-medium">{r.nombre}</span> },
    { key: 'correo', header: 'Correo', cell: (r) => r.correo },
    { key: 'roles', header: 'Roles', cell: (r) => r.roles.join(', ') },
    { key: 'estado', header: 'Estado', cell: (r) => <Badge variant={r.activo ? 'default' : 'secondary'}>{r.activo ? 'Activo' : 'Inactivo'}</Badge> },
  ]
  return (
    <div>
      <PageHeader title="Usuarios" description="Usuarios, roles y estado de acceso" />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin usuarios" />
    </div>
  )
}

export function ReportesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['reportes', 'resumen'], queryFn: reportesService.getResumen })
  const { data: alertas } = useQuery({ queryKey: ['reportes', 'alertas'], queryFn: () => reportesService.getAlertasInventario(5) })
  if (isLoading) return <Skeleton className="h-64 w-full" />
  return (
    <div>
      <PageHeader title="Reportes" description="Resumen operativo y alertas" />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Órdenes totales" value={data?.ordenes.total ?? 0} detail={`${data?.ordenes.enProceso ?? 0} en proceso`} />
        <MetricCard title="Facturado" value={money(data?.ingresos.totalFacturado ?? 0)} detail={`Cobrado: ${money(data?.ingresos.totalCobrado ?? 0)}`} />
        <MetricCard title="Saldo pendiente" value={money(data?.ingresos.saldoPendiente ?? 0)} detail={`${data?.ingresos.facturasPendientes ?? 0} facturas pendientes`} />
      </div>
      <Card className="mt-4">
        <CardHeader><CardTitle className="text-sm">Alertas de inventario</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {(alertas ?? []).map((a) => (
            <div key={a.id} className="flex justify-between rounded-md border p-2 text-sm">
              <span>{a.codigo} - {a.descripcion}</span>
              <Badge variant="secondary">Disponible: {a.disponible}</Badge>
            </div>
          ))}
          {(alertas ?? []).length === 0 && <p className="text-sm text-muted-foreground">Sin alertas críticas.</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export function OperationalDashboardPage({ title, description }: { title: string; description: string }) {
  const { data, isLoading } = useQuery({ queryKey: ['reportes', 'dashboard'], queryFn: reportesService.getResumen })
  const { data: alertas } = useQuery({ queryKey: ['reportes', 'dashboard-alertas'], queryFn: () => reportesService.getAlertasInventario(5) })
  const { data: solicitudes } = useQuery({ queryKey: ['inventario', 'dashboard-solicitudes'], queryFn: () => inventarioService.getSolicitudes() })

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Órdenes activas" value={data?.ordenes.enProceso ?? 0} detail={`${data?.ordenes.esperandoAprobacion ?? 0} por aprobar`} />
        <MetricCard title="Facturas pendientes" value={data?.ingresos.facturasPendientes ?? 0} detail={money(data?.ingresos.saldoPendiente ?? 0)} />
        <MetricCard title="Solicitudes repuestos" value={solicitudes?.length ?? 0} detail="Flujo almacén y bodega" />
        <MetricCard title="Alertas inventario" value={alertas?.length ?? 0} detail="Stock bajo o crítico" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Ingresos</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Total facturado</span><span className="font-medium">{money(data?.ingresos.totalFacturado ?? 0)}</span></div>
            <div className="flex justify-between"><span>Total cobrado</span><span className="font-medium">{money(data?.ingresos.totalCobrado ?? 0)}</span></div>
            <div className="flex justify-between"><span>Pendiente</span><span className="font-medium">{money(data?.ingresos.saldoPendiente ?? 0)}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Inventario crítico</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(alertas ?? []).slice(0, 5).map((a) => (
              <div key={a.id} className="flex justify-between rounded-md border p-2 text-sm">
                <span>{a.codigo} - {a.descripcion}</span>
                <Badge variant="secondary">{a.disponible}</Badge>
              </div>
            ))}
            {(alertas ?? []).length === 0 && <p className="text-sm text-muted-foreground">Sin alertas críticas.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, detail }: { title: string; value: React.ReactNode; detail?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">{title}</CardTitle></CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
      </CardContent>
    </Card>
  )
}

function CatalogList<T extends { id: number }>({
  title,
  data,
  isLoading,
  columns,
}: {
  title: string
  data: T[] | undefined
  isLoading?: boolean
  columns: Column<T>[]
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin registros" />
      </CardContent>
    </Card>
  )
}

export function CatalogosPage() {
  const { data: areas, isLoading: loadingAreas } = useQuery({ queryKey: ['catalogos', 'areas-servicio'], queryFn: catalogosService.getAreasServicio })
  const { data: tipos, isLoading: loadingTipos } = useQuery({ queryKey: ['catalogos', 'tipos-servicio'], queryFn: catalogosService.getTiposServicio })
  const { data: categorias, isLoading: loadingCategorias } = useQuery({ queryKey: ['catalogos', 'categorias-repuesto'], queryFn: catalogosService.getCategoriasRepuesto })
  const { data: metodos, isLoading: loadingMetodos } = useQuery({ queryKey: ['catalogos', 'metodos-pago'], queryFn: catalogosService.getMetodosPago })

  return (
    <div className="space-y-4">
      <PageHeader title="Catálogos" description="Parámetros operativos usados por órdenes, inventario y facturación" />
      <div className="grid gap-4 xl:grid-cols-2">
        <CatalogList<AreaServicio>
          title="Áreas de servicio"
          data={areas}
          isLoading={loadingAreas}
          columns={[
            { key: 'nombre', header: 'Nombre', cell: (r) => r.nombre },
            { key: 'descripcion', header: 'Descripción', cell: (r) => r.descripcion },
          ]}
        />
        <CatalogList<TipoServicio>
          title="Tipos de servicio"
          data={tipos}
          isLoading={loadingTipos}
          columns={[
            { key: 'nombre', header: 'Nombre', cell: (r) => r.nombre },
            { key: 'dias', header: 'Días base', cell: (r) => r.diasEstimadosBase },
          ]}
        />
        <CatalogList<CategoriaRepuesto>
          title="Categorías de repuesto"
          data={categorias}
          isLoading={loadingCategorias}
          columns={[
            { key: 'nombre', header: 'Nombre', cell: (r) => r.nombre },
            { key: 'descripcion', header: 'Descripción', cell: (r) => r.descripcion },
          ]}
        />
        <CatalogList<MetodoPago>
          title="Métodos de pago"
          data={metodos}
          isLoading={loadingMetodos}
          columns={[
            { key: 'nombre', header: 'Nombre', cell: (r) => r.nombre },
            { key: 'estado', header: 'Estado', cell: (r) => <Badge variant={r.activo ? 'default' : 'secondary'}>{r.activo ? 'Activo' : 'Inactivo'}</Badge> },
          ]}
        />
      </div>
    </div>
  )
}

export function ConfiguracionPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['configuracion'], queryFn: configuracionService.get })
  const [iva, setIva] = useState('')
  const update = useMutation({
    mutationFn: () => configuracionService.update({
      nombreTaller: data!.nombreTaller,
      nit: data!.nit,
      direccion: data!.direccion,
      ciudad: data!.ciudad,
      telefono: data!.telefono,
      correo: data!.correo,
      porcentajeIva: Number(iva || data!.porcentajeIva),
      prefijoFactura: data!.prefijoFactura,
      resolucionDIAN: data!.resolucionDIAN,
    }),
    onSuccess: () => {
      toast.success('Configuración actualizada')
      qc.invalidateQueries({ queryKey: ['configuracion'] })
    },
  })
  if (isLoading || !data) return <Skeleton className="h-64 w-full" />
  return (
    <div className="max-w-xl">
      <PageHeader title="Configuración" description="Parámetros globales del taller" />
      <Card>
        <CardContent className="space-y-4 pt-4">
          <div><span className="font-medium">Taller:</span> {data.nombreTaller}</div>
          <div><span className="font-medium">Factura:</span> {data.prefijoFactura}-{String(data.numeroConsecutivoActual).padStart(6, '0')}</div>
          <div className="space-y-1">
            <Label>IVA (%)</Label>
            <Input value={iva} onChange={(e) => setIva(e.target.value)} placeholder={String(data.porcentajeIva)} type="number" />
          </div>
          <Button onClick={() => update.mutate()} disabled={update.isPending}>{update.isPending ? 'Guardando...' : 'Guardar IVA'}</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function AuditoriasPage() {
  const { data, isLoading } = useQuery({ queryKey: ['auditorias'], queryFn: () => auditoriasService.list({ pageNumber: 1, pageSize: 50 }) })
  const { data: errores } = useQuery({ queryKey: ['auditorias', 'errores'], queryFn: () => auditoriasService.getErrores({ pageNumber: 1, pageSize: 20 }) })
  const columns: Column<AuditoriaDto>[] = [
    { key: 'fecha', header: 'Fecha', cell: (r) => formatDate(r.fechaHora) },
    { key: 'entidad', header: 'Entidad', cell: (r) => r.entidad },
    { key: 'accion', header: 'Acción', cell: (r) => r.descripcion },
  ]
  const errorColumns: Column<ErrorSistemaDto>[] = [
    { key: 'fecha', header: 'Fecha', cell: (r) => formatDate(r.fecha) },
    { key: 'ruta', header: 'Ruta', cell: (r) => r.ruta },
    { key: 'mensaje', header: 'Mensaje', cell: (r) => r.mensaje },
  ]
  return (
    <div className="space-y-6">
      <PageHeader title="Auditorías" description="Cambios y errores del sistema" />
      <DataTable columns={columns} data={data?.items ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin auditorías" />
      <DataTable columns={errorColumns} data={errores?.items ?? []} getRowKey={(r) => r.id} emptyTitle="Sin errores registrados" />
    </div>
  )
}

export function PortalDashboardPage() {
  const { data: ordenes } = useQuery({ queryKey: ['portal', 'ordenes'], queryFn: () => portalService.getOrdenes() })
  const { data: vehiculos } = useQuery({ queryKey: ['portal', 'vehiculos'], queryFn: portalService.getVehiculos })
  const { data: facturas } = useQuery({ queryKey: ['portal', 'facturas'], queryFn: portalService.getFacturas })
  return (
    <div>
      <PageHeader title="Portal cliente" description="Tus vehículos, órdenes y facturas" />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Vehículos" value={vehiculos?.length ?? 0} />
        <MetricCard title="Órdenes" value={ordenes?.length ?? 0} />
        <MetricCard title="Facturas" value={facturas?.length ?? 0} />
      </div>
    </div>
  )
}

export function PortalVehiculosPage() {
  const { data, isLoading } = useQuery({ queryKey: ['portal', 'vehiculos'], queryFn: portalService.getVehiculos })
  const columns: Column<PortalVehiculoResumenDto>[] = [
    { key: 'placa', header: 'Placa', cell: (r) => <span className="font-mono">{r.placa}</span> },
    { key: 'vin', header: 'VIN', cell: (r) => r.vin },
    { key: 'anio', header: 'Año', cell: (r) => r.anio },
    { key: 'desde', header: 'Propietario desde', cell: (r) => formatDate(r.fechaInicioPropietario) },
  ]
  return <><PageHeader title="Mis vehículos" description="Vehículos registrados a tu nombre" /><DataTable columns={columns} data={data ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin vehículos" /></>
}

export function PortalOrdenesPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({ queryKey: ['portal', 'ordenes'], queryFn: () => portalService.getOrdenes() })
  const columns: Column<PortalOrdenResumenDto>[] = [
    { key: 'id', header: '#', cell: (r) => `#${r.id}` },
    { key: 'vehiculo', header: 'Vehículo', cell: (r) => `#${r.vehiculoId}` },
    { key: 'ingreso', header: 'Ingreso', cell: (r) => formatDate(r.fechaIngreso) },
    { key: 'estado', header: 'Estado', cell: (r) => <Badge variant="secondary">{ESTADO_ORDEN_GENERAL_LABEL[r.estado]}</Badge> },
  ]
  return <><PageHeader title="Mis órdenes" description="Órdenes activas e historial" /><DataTable columns={columns} data={data ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin órdenes" onRowClick={(r) => navigate(`/portal/ordenes/${r.id}`)} /></>
}

export function PortalOrdenDetallePage() {
  const qc = useQueryClient()
  const { id } = useParams()
  const ordenId = Number(id)
  const { data: orden, isLoading: loadingOrden } = useQuery({ queryKey: ['portal', 'orden', ordenId], queryFn: () => portalService.getOrden(ordenId), enabled: ordenId > 0 })
  const { data: areas, isLoading: loadingAreas } = useQuery({ queryKey: ['portal', 'orden', ordenId, 'areas'], queryFn: () => portalService.getOrdenAreas(ordenId), enabled: ordenId > 0 })
  const aprobar = useMutation({
    mutationFn: (area: PortalOrdenAreaDetalleDto) => portalService.aprobarArea(area.id, {
      trabajosAprobados: area.trabajosPropuestos.filter((t) => t.estadoAprobacion === EstadoAprobacion.Pendiente).map((t) => t.id),
      repuestosAprobados: area.repuestosPropuestos.filter((r) => r.estadoAprobacion === EstadoAprobacion.Pendiente).map((r) => r.id),
      comentarioCliente: 'Aprobado desde portal del cliente',
      firmaDigitalUrl: null,
    }),
    onSuccess: () => {
      toast.success('Propuesta aprobada')
      qc.invalidateQueries({ queryKey: ['portal', 'orden', ordenId, 'areas'] })
    },
    onError: () => toast.error('No se pudo aprobar la propuesta'),
  })
  const rechazar = useMutation({
    mutationFn: (areaId: number) => portalService.rechazarArea(areaId, { comentarioCliente: 'Rechazado desde portal del cliente' }),
    onSuccess: () => {
      toast.success('Propuesta rechazada')
      qc.invalidateQueries({ queryKey: ['portal', 'orden', ordenId, 'areas'] })
    },
    onError: () => toast.error('No se pudo rechazar la propuesta'),
  })

  if (loadingOrden) return <Skeleton className="h-64 w-full" />

  return (
    <div className="space-y-4">
      <PageHeader title={`Orden #${orden?.id ?? ordenId}`} description={orden ? `${ESTADO_ORDEN_GENERAL_LABEL[orden.estado]} · ingreso ${formatDate(orden.fechaIngreso)}` : 'Detalle de orden'} />
      {loadingAreas ? <Skeleton className="h-40 w-full" /> : (areas ?? []).map((area) => {
        const pendiente = area.estado === EstadoOrdenArea.EsperandoAprobacionCliente
        const total = area.costoManoObraEstimado +
          area.repuestosPropuestos.reduce((acc, r) => acc + r.precioUnitario * r.cantidadSolicitada, 0)
        return (
          <Card key={area.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                <span>Área #{area.areaServicioId}</span>
                <Badge variant="secondary">{ESTADO_ORDEN_AREA_LABEL[area.estado]}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{area.diagnostico || 'Sin diagnóstico registrado.'}</p>
              <div className="grid gap-4 lg:grid-cols-2">
                <ProposalList title="Trabajos propuestos" items={area.trabajosPropuestos.map((t) => ({
                  id: t.id,
                  label: t.descripcion,
                  amount: t.costoEstimadoManoObra,
                  status: ESTADO_APROBACION_LABEL[t.estadoAprobacion],
                }))} />
                <ProposalList title="Repuestos propuestos" items={area.repuestosPropuestos.map((r) => ({
                  id: r.id,
                  label: `Repuesto #${r.repuestoId} x ${r.cantidadSolicitada}`,
                  amount: r.precioUnitario * r.cantidadSolicitada,
                  status: ESTADO_APROBACION_LABEL[r.estadoAprobacion],
                }))} />
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="font-medium">Total propuesto: {money(total)}</span>
                {pendiente && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => rechazar.mutate(area.id)} disabled={rechazar.isPending}>Rechazar</Button>
                    <Button onClick={() => aprobar.mutate(area)} disabled={aprobar.isPending}>Aprobar</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
      {!loadingAreas && (areas ?? []).length === 0 && <Card><CardContent className="pt-4 text-sm text-muted-foreground">Esta orden no tiene áreas visibles para el portal.</CardContent></Card>}
    </div>
  )
}

function ProposalList({ title, items }: { title: string; items: { id: number; label: string; amount: number; status: string }[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{title}</p>
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
          <span>{item.label}</span>
          <span className="text-right">
            <span className="block font-medium">{money(item.amount)}</span>
            <span className="text-xs text-muted-foreground">{item.status}</span>
          </span>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-muted-foreground">Sin items propuestos.</p>}
    </div>
  )
}

export function PortalFacturasPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['portal', 'facturas'], queryFn: portalService.getFacturas })
  const pagar = useMutation({
    mutationFn: (factura: FacturaDto) => portalService.pagarFactura(factura.id, {
      metodoPagoId: 1,
      monto: factura.total,
      referencia: `PORTAL-${Date.now()}`,
    }),
    onSuccess: () => {
      toast.success('Pago registrado')
      qc.invalidateQueries({ queryKey: ['portal', 'facturas'] })
    },
    onError: () => toast.error('No se pudo registrar el pago'),
  })
  const columns: Column<FacturaDto>[] = [
    { key: 'numero', header: 'Factura', cell: (r) => r.numeroFactura },
    { key: 'fecha', header: 'Fecha', cell: (r) => formatDate(r.fechaEmision) },
    { key: 'total', header: 'Total', cell: (r) => money(r.total) },
    { key: 'estado', header: 'Estado', cell: (r) => ESTADO_PAGO_FACTURA_LABEL[r.estadoPago] },
    { key: 'pagar', header: '', cell: (r) => r.estadoPago === EstadoPagoFactura.PagadaCompleta ? <Badge variant="secondary">Pagada</Badge> : <Button size="sm" variant="outline" onClick={() => pagar.mutate(r)}>Pagar</Button> },
  ]
  return <><PageHeader title="Mis facturas" description="Facturas y pagos" /><DataTable columns={columns} data={data ?? []} isLoading={isLoading} getRowKey={(r) => r.id} emptyTitle="Sin facturas" /></>
}

export function PortalPerfilPage() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const cambiar = useMutation({
    mutationFn: () => authService.cambiarPassword({ oldPassword, newPassword }),
    onSuccess: () => {
      toast.success('Contraseña actualizada')
      setOldPassword('')
      setNewPassword('')
    },
    onError: () => toast.error('No se pudo cambiar la contraseña'),
  })
  return (
    <div className="max-w-md">
      <PageHeader title="Mi perfil" description="Actualiza tu contraseña" />
      <Card>
        <CardContent className="space-y-3 pt-4">
          <div className="space-y-1"><Label>Contraseña actual</Label><Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
          <div className="space-y-1"><Label>Nueva contraseña</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
          <Button onClick={() => cambiar.mutate()} disabled={cambiar.isPending || newPassword.length < 8}>Cambiar contraseña</Button>
        </CardContent>
      </Card>
    </div>
  )
}
