import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: string
  title?: string
  description?: string
  className?: string
}

export function EmptyState({
  icon = "🛒",
  title,
  description = "Your list is empty. Add something above!",
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center py-12 text-center", className)}>
      <span className="text-5xl mb-3" role="img" aria-label="empty">
        {icon}
      </span>
      {title && (
        <p className="text-base font-medium text-foreground mb-1">{title}</p>
      )}
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
