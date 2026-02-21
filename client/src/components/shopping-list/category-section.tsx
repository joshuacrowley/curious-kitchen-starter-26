import * as React from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const CATEGORY_COLORS: Record<string, string> = {
  "Produce": "#38a169",
  "Dairy & Eggs": "#3182ce",
  "Meat & Fish": "#e53e3e",
  "Bakery": "#d69e2e",
  "Pantry": "#dd6b20",
  "Frozen": "#00b5d8",
  "Beverages": "#805ad5",
  "Snacks": "#ed8936",
  "Household": "#718096",
  "Other": "#a0aec0",
}

interface CategorySectionProps {
  name: string
  children: React.ReactNode
  className?: string
}

export function CategorySection({ name, children, className }: CategorySectionProps) {
  const color = CATEGORY_COLORS[name] ?? "#a0aec0"

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 px-1">
        <span
          className="size-2.5 rounded-full shrink-0"
          style={{ background: color }}
        />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {name}
        </span>
      </div>
      <Card className="py-0 overflow-hidden">
        <ul>{children}</ul>
      </Card>
    </div>
  )
}
