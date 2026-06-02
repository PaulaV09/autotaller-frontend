import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  backPath?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, backPath, action }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-start justify-between gap-4 pb-6">
      <div className="flex items-start gap-3">
        {backPath && (
          <Button
            variant="ghost"
            size="icon"
            className="mt-0.5 shrink-0"
            onClick={() => navigate(backPath)}
          >
            <ArrowLeft className="size-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
