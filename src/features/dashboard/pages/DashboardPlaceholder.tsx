interface Props {
  role: string
  description: string
}

export function DashboardPlaceholder({ role, description }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">{role}</h1>
      <p className="text-muted-foreground">{description}</p>
      <p className="mt-4 text-sm text-muted-foreground">
        Este panel se construirá en las siguientes fases.
      </p>
    </div>
  )
}
