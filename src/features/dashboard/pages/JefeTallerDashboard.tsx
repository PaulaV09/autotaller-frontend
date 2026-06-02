import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ClipboardList, Wrench, Clock, CheckCircle2 } from 'lucide-react'

interface ResumenOrdenes {
  pendientes: number
  enDiagnostico: number
  esperandoAprobacion: number
  enProceso: number
  completadas: number
  canceladas: number
  facturadas: number
  total: number
}

interface ResumenIngresos {
  totalFacturado: number
  totalCobrado: number
  saldoPendiente: number
  facturasPendientes: number
}

interface Resumen {
  ordenes: ResumenOrdenes
  ingresos: ResumenIngresos
}

function useResumen() {
  return useQuery({
    queryKey: ['reportes', 'resumen'],
    queryFn: () =>
      apiClient.get<Resumen>(ENDPOINTS.reportes.resumen).then((r) => r.data),
    refetchInterval: 60_000,
  })
}

export function JefeTallerDashboard() {
  const navigate = useNavigate()
  const { data, isLoading } = useResumen()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  const ordenes = data?.ordenes
  const ingresos = data?.ingresos

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel Jefe de Taller</h1>
        <p className="text-muted-foreground">Resumen operativo en tiempo real</p>
      </div>

      {/* KPIs de órdenes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => navigate('/taller/inspecciones/nueva')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
              <ClipboardList className="size-4" />
              Nueva inspección
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="sm">Iniciar inspección</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
              <Clock className="size-4 text-orange-500" />
              Esperando aprobación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{ordenes?.esperandoAprobacion ?? 0}</p>
            <p className="text-xs text-muted-foreground">órdenes pendientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
              <Wrench className="size-4 text-blue-500" />
              En proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{ordenes?.enProceso ?? 0}</p>
            <p className="text-xs text-muted-foreground">órdenes activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
              <CheckCircle2 className="size-4 text-green-500" />
              Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{ordenes?.completadas ?? 0}</p>
            <p className="text-xs text-muted-foreground">pendientes de facturar</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de estados */}
      {ordenes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Distribución de órdenes por estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Pendiente', count: ordenes.pendientes, color: 'bg-yellow-500' },
                { label: 'En diagnóstico', count: ordenes.enDiagnostico, color: 'bg-blue-500' },
                { label: 'Esp. aprobación', count: ordenes.esperandoAprobacion, color: 'bg-orange-500' },
                { label: 'En proceso', count: ordenes.enProceso, color: 'bg-indigo-500' },
                { label: 'Completadas', count: ordenes.completadas, color: 'bg-green-500' },
                { label: 'Facturadas', count: ordenes.facturadas, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`size-3 rounded-full shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">{item.label}</p>
                  </div>
                  <span className="text-sm font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ingresos */}
      {ingresos && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Total facturado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(ingresos.totalFacturado)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Total cobrado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(ingresos.totalCobrado)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Saldo pendiente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${ingresos.saldoPendiente > 0 ? 'text-destructive' : ''}`}>
                {formatCurrency(ingresos.saldoPendiente)}
              </p>
              <p className="text-xs text-muted-foreground">{ingresos.facturasPendientes} facturas sin pago</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Accesos rápidos */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => navigate('/taller/inspecciones')}>
          Ver inspecciones
        </Button>
        <Button variant="outline" onClick={() => navigate('/taller/ordenes')}>
          Ver todas las órdenes
        </Button>
        <Button variant="outline" onClick={() => navigate('/taller/mecanicos')}>
          Gestionar mecánicos
        </Button>
      </div>
    </div>
  )
}
