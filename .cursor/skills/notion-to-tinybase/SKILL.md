---
name: notion-to-tinybase
description: Mirror Notion databases into a TinyBase store schema with seeded data and a full CRUD tabbed UI. Use when the user wants to import, sync, or mirror Notion database schemas into TinyBase, or when setting up a TinyBase app that maps to an existing Notion workspace structure.
---

# Notion → TinyBase

Mirrors one or more Notion databases into a TinyBase store schema, seeds the store with current Notion data, and builds a tabbed CRUD UI — one tab per table.

## Workflow

### 1. Fetch Notion data

For each Notion database URL provided:
- Fetch the database schema (properties, types, select options, relations)
- Fetch all row entries so you have the full current dataset to seed with

### 2. Map schema to TinyBase

TinyBase cells are primitive (`string`, `boolean`, `number`). Map Notion property types:

| Notion type | TinyBase type | Notes |
|---|---|---|
| title, text, url, email, phone | `string` | Direct |
| number | `number` | Direct |
| checkbox | `boolean` | Direct |
| select | `string` | Store the option name |
| multi_select | `string` | Comma-separated: `"Breakfast,Dinner"` |
| date | `string` | ISO date string: `"2026-02-23"` |
| relation | `string` | FK cell storing the linked row's local ID (e.g. `recipeId`) |

### 3. Update Store.tsx

- Replace the existing schema constant with `APP_SCHEMA` covering all tables
- **Change `STORE_ID`** to a new key (e.g. `'mealApp'`) — this avoids collisions with old persisted data in localStorage
- Seed all tables via `setDefaultContent` — this baseline is overridden by the persister's `load()` on subsequent visits, so user edits are always preserved
- Export all hooks needed for CRUD: `useAddRowCallback`, `useDelRowCallback`, `useSetCellCallback`, `useRow`, `useSortedRowIds`, and **`useTable`** (required to populate FK picker dropdowns in add forms)
- Export a typed `Row` type per table

### 4. Build CRUD UI in App.tsx

Tab structure — one tab per Notion database.

Each tab contains:
- A `<table>` listing all rows with a **Delete** button per row
- Inline **checkbox toggles** for boolean cells (`bought`, `prep`, etc.)
- FK cells display the **linked record's name** resolved via `useRow('otherTable', row.fkId, STORE_ID)` — not a raw ID
- An **add-row form** below the table with appropriate inputs for each cell type

**Critical implementation rules:**

1. **Each row and each add form must be its own React component.** TinyBase hooks (`useAddRowCallback`, `useRow`, `useDelRowCallback`, etc.) must be called at the component level — not inside callbacks or render loops.

2. **Radix UI `SelectItem` cannot have `value=""`**. For optional FK dropdowns, use `value="__none__"` on the "— none —" option and convert it back to `""` when writing to the store:
   ```tsx
   <Select
     value={form.recipeId || '__none__'}
     onValueChange={(v) => setForm(f => ({...f, recipeId: v === '__none__' ? '' : v}))}
   >
     <SelectItem value="__none__">— none —</SelectItem>
     {recipeOptions.map(([id, r]) => <SelectItem key={id} value={id}>{r.name}</SelectItem>)}
   </Select>
   ```

3. **FK dropdowns in add forms** read from other tables via `useTable('recipes', STORE_ID)` — convert the result to `Object.entries(table)` for rendering.

## See also

- [references/prompt-template.md](references/prompt-template.md) — copy-paste prompt for starting a fresh implementation
