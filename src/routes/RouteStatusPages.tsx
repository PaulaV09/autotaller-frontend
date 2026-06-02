export function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      <p className="text-4xl font-bold">404</p>
      <p className="text-muted-foreground">Página no encontrada</p>
    </div>
  )
}

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <p className="text-4xl font-bold">403</p>
      <p className="text-muted-foreground">No tienes permiso para acceder a esta sección</p>
    </div>
  )
}
