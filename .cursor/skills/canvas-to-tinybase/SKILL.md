---
name: canvas-to-tinybase
description: Read a meal-plan Cursor canvas and turn its embedded data into a TinyBase store schema with seeded data and a full CRUD tabbed UI — one tab per table. Use when the user wants to convert, import, or sync a canvas (e.g. one made by the meal-plan-canvas skill) into a live TinyBase app.
disable-model-invocation: true
---

# Canvas → TinyBase

Reads the data embedded in a meal-plan canvas (`.canvas.tsx`), mirrors it into a TinyBase store schema, seeds the store with that data, and builds a tabbed CRUD UI — one tab per table.

## Workflow

### 1. Read the canvas

- Find the relevant canvas under `~/.cursor/projects/<workspace>/canvases/`. If the user named one, use it; otherwise list that directory and pick the meal-plan canvas (ask if ambiguous).
- Read the file and extract the source const arrays (`recipes`, `mealPlan`, `shoppingList`, or whatever the canvas defines). Each array is one table; each object key is one cell. These arrays are the full dataset to seed with.

### 2. Map canvas data to a TinyBase schema

TinyBase cells are primitive (`string`, `boolean`, `number`). Infer each cell type from the canvas values:

| Canvas value | TinyBase type | Notes |
|---|---|---|
| string (name, cuisine, url, notes, ISO date) | `string` | Direct; dates stay ISO strings like `"2026-06-15"` |
| number (prepTime, rating, price) | `number` | Direct |
| boolean (bought, prep) | `boolean` | Direct |
| comma-joined options (`"Breakfast,Dinner"`) | `string` | Keep the joined string |
| FK id (`recipeId`, `mealPlanId`) | `string` | Stays a string holding the linked row's id |

Use the object `id` field as the TinyBase row id; do not store `id` as a cell.

### 3. Update Store.tsx

- Replace the existing schema constant with one `APP_SCHEMA` covering all tables, each cell with a sensible `default`.
- **Change `STORE_ID`** to a new key (e.g. `'mealApp'`) so old persisted data in localStorage doesn't collide with the new schema.
- Seed every table via `.setDefaultContent(...)` using the canvas arrays — keyed by each row's `id`. This baseline is overridden by the persister's `load()` on later visits, so user edits are preserved.
- Export the hooks needed for CRUD: `useAddRowCallback`, `useDelRowCallback`, `useSetCellCallback`, `useRow`, `useSortedRowIds`, and **`useTable`** (needed to populate FK picker dropdowns in add forms).
- Export a typed `Row` type per table.

### 4. Build the CRUD UI in App.tsx

One tab per table. Each tab contains:
- A `<table>` listing all rows with a **Delete** button per row.
- Inline **checkbox toggles** for boolean cells (`bought`, `prep`).
- FK cells display the **linked record's name**, resolved via `useRow('recipes', row.recipeId, STORE_ID)` — never a raw id.
- An **add-row form** below the table with inputs matched to each cell type.

**Critical implementation rules:**

1. **Each row and each add form must be its own React component.** TinyBase hooks (`useAddRowCallback`, `useRow`, `useDelRowCallback`, etc.) must be called at the component level — not inside callbacks or render loops.

2. **Radix UI `SelectItem` cannot have `value=""`**. For optional FK dropdowns, use `value="__none__"` for the "— none —" option and convert it back to `""` when writing to the store:
   ```tsx
   <Select
     value={form.recipeId || '__none__'}
     onValueChange={(v) => setForm(f => ({...f, recipeId: v === '__none__' ? '' : v}))}
   >
     <SelectItem value="__none__">— none —</SelectItem>
     {recipeOptions.map(([id, r]) => <SelectItem key={id} value={id}>{r.name}</SelectItem>)}
   </Select>
   ```

3. **FK dropdowns in add forms** read from other tables via `useTable('recipes', STORE_ID)` — convert the result with `Object.entries(table)` for rendering.

### 5. Verify

- Confirm the app type-checks and the seeded rows render across all tabs.
- Confirm FK columns show names, checkboxes toggle, and add/delete work per table.
