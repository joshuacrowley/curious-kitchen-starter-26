import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export const CATEGORIES = [
  { value: "Produce", label: "🥦 Produce" },
  { value: "Dairy & Eggs", label: "🥛 Dairy & Eggs" },
  { value: "Meat & Fish", label: "🥩 Meat & Fish" },
  { value: "Bakery", label: "🍞 Bakery" },
  { value: "Pantry", label: "🥫 Pantry" },
  { value: "Frozen", label: "🧊 Frozen" },
  { value: "Beverages", label: "🧃 Beverages" },
  { value: "Snacks", label: "🍿 Snacks" },
  { value: "Household", label: "🧹 Household" },
  { value: "Other", label: "📦 Other" },
]

interface AddItemBarProps {
  onAdd?: (name: string, category: string) => void
}

export function AddItemBar({ onAdd }: AddItemBarProps) {
  const [value, setValue] = React.useState("")
  const [category, setCategory] = React.useState("Produce")

  function handleAdd() {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd?.(trimmed, category)
    setValue("")
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-2 py-3 sm:flex-nowrap">
        <Input
          placeholder="Add an item…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 min-w-0"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-auto shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleAdd} className="shrink-0">
          <PlusIcon data-icon="inline-start" />
          Add
        </Button>
      </CardContent>
    </Card>
  )
}
