import { Button } from "@/components/ui/button"

interface SummaryBarProps {
  total: number
  checked: number
  onClearChecked?: () => void
}

export function SummaryBar({ total, checked, onClearChecked }: SummaryBarProps) {
  if (total === 0) return null

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">
        <strong className="text-foreground font-semibold">{checked}</strong>
        {" of "}
        <strong className="text-foreground font-semibold">{total}</strong>
        {" item"}{total !== 1 ? "s" : ""} checked
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onClearChecked}
        className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/60"
      >
        Remove checked
      </Button>
    </div>
  )
}
