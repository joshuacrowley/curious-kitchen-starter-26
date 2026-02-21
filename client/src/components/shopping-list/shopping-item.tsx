import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface ShoppingItemProps {
  id: string
  name: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  onDelete?: () => void
}

export function ShoppingItem({
  id,
  name,
  checked = false,
  onCheckedChange,
  onDelete,
}: ShoppingItemProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors",
        checked && "bg-muted/30"
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(val: boolean | 'indeterminate') => onCheckedChange?.(val === true)}
      />
      <label
        htmlFor={id}
        className={cn(
          "flex-1 text-sm cursor-pointer select-none",
          checked && "line-through text-muted-foreground"
        )}
      >
        {name}
      </label>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onDelete}
        className="text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10"
        aria-label={`Remove ${name}`}
      >
        <XIcon />
      </Button>
    </li>
  )
}
