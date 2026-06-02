import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'
import { PaginationControls } from '@/components/common/PaginationControls'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useClientesList, useDeleteCliente } from '../hooks/useClientes'
import { usePagination } from '@/hooks/usePagination'
import type { ClienteDto } from '@/types/cliente.types'
import { useAuth } from '@/hooks/useAuth'

interface ClientesListPageProps {
  basePath: string // e.g. '/recepcion' | '/admin'
}

export function ClientesListPage({ basePath }: ClientesListPageProps) {
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { page, pageSize, goToPage, changePageSize } = usePagination()

  const { data, isLoading } = useClientesList({ pageNumber: page, pageSize, nombre: nombre || undefined, correo: correo || undefined })
  const deleteMutation = useDeleteCliente()

  const columns: Column<ClienteDto>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      cell: (row) => <span className="font-medium">{row.nombre}</span>,
    },
    {
      key: 'documento',
      header: 'Documento',
      cell: (row) => `${row.numeroDocumento}`,
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      cell: (row) => row.telefono,
    },
    {
      key: 'correo',
      header: 'Correo',
      cell: (row) => row.correo,
    },
    {
      key: 'activo',
      header: 'Estado',
      cell: (row) => (
        <Badge variant={row.activo ? 'default' : 'secondary'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      header: '',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`${basePath}/clientes/${row.id}/editar`)}
          >
            Editar
          </Button>
          {hasRole('SuperAdministrador') && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteId(row.id)}
            >
              Eliminar
            </Button>
          )}
        </div>
      ),
      className: 'w-[140px]',
    },
  ]

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success('Cliente eliminado')
      setDeleteId(null)
    } catch {
      toast.error('No se puede eliminar: el cliente tiene órdenes activas')
      setDeleteId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gestión de clientes registrados en el sistema"
        action={
          <Button onClick={() => navigate(`${basePath}/clientes/nuevo`)}>
            <Plus className="mr-2 size-4" />
            Nuevo cliente
          </Button>
        }
      />

      {/* Filtros */}
      <div className="mb-4 flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            className="pl-9"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); goToPage(1) }}
          />
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por correo..."
            className="pl-9"
            value={correo}
            onChange={(e) => { setCorreo(e.target.value); goToPage(1) }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        onRowClick={(r) => navigate(`${basePath}/clientes/${r.id}`)}
        emptyTitle="No hay clientes"
        emptyDescription="Registra el primer cliente con el botón de arriba."
      />

      <PaginationControls
        currentPage={page}
        totalCount={data?.totalCount ?? 0}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar cliente"
        description="Esta acción no se puede deshacer. El cliente será desactivado del sistema."
        confirmLabel="Eliminar"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
