---
name: meal-plan-canvas
description: Design a three-part meal-planning data model (Recipes, Meal Planning, Shopping List) and showcase it in a Cursor canvas with seeded sample data. Use when the user wants to plan, mock up, or visualize a meal-planning database without Notion, or when they ask for a meal-plan canvas.
disable-model-invocation: true
---

# Meal Plan Canvas

Designs a three-part meal-planning data model — **Recipes**, **Meal Planning**, and **Shopping List** — and renders it as a single Cursor canvas with seeded sample data. The canvas is the deliverable and the data source that the `canvas-to-tinybase` skill later reads to build a TinyBase store.

## Step 1: Ask upfront questions

Before designing anything, ask the user a focused batch of questions with `AskQuestion`. Pick the few most likely to shape the schema — don't ask all of them:

- Which meals do they plan? (just dinners, or breakfast/lunch/dinner/snacks)
- Do they plan a full week at a time or day by day?
- Do they shop at one store or multiple? Group items by aisle/category?
- Do they want to track calories/macros, ratings, servings — or keep it simple?
- Any cuisines or dietary constraints to bias the sample recipes?

Once you have answers, briefly confirm the proposed schema before building the canvas.

## Step 2: Design the schema

Three tables. Adjust options based on the user's answers (e.g. trim `mealType` to just `Dinner`).

**recipes**
- `name` string (title)
- `cuisine` string — e.g. Italian, Mexican, Indian, Japanese, Thai, Mediterranean, Australian, American, Other
- `mealType` string — comma-separated from `Breakfast,Lunch,Dinner,Snack`
- `prepTime` number (minutes)
- `link` string (source URL, optional)
- `notes` string (substitutions, serving tips)
- Optional: `rating` number (1–5), `servings` number, `totalTime` number

**mealPlan**
- `name` string (title)
- `day` string — Monday…Sunday
- `meal` string — Breakfast/Lunch/Dinner/Snack
- `week` string — ISO date of that week's Monday, e.g. `"2026-06-15"`
- `recipeId` string — FK to a `recipes` row id
- `prep` boolean — needs advance prep
- `notes` string

**shoppingList**
- `name` string (title)
- `category` string — Produce, Meat & Fish, Dairy, Pantry, Frozen, Bakery, Other
- `quantity` string — e.g. "500g", "1 bunch", "2 cans"
- `bought` boolean
- `recipeId` string — FK to a `recipes` row id (optional)
- `mealPlanId` string — FK to a `mealPlan` row id (optional)
- Optional: `store` string, `aisle` string, `price` number

## Step 3: Build the canvas

Read and follow the `canvas` skill (`~/.cursor/skills-cursor/canvas/SKILL.md`) for the full workflow, file location, and design rules. Then:

1. **Embed the data as plain typed const arrays** near the top of the canvas file, using the exact table names and FK convention above. The `canvas-to-tinybase` skill reads these consts directly, so keep them clean and literal — no computed values, no spreads:

   ```tsx
   // --- meal plan data (source for canvas-to-tinybase) ---
   const recipes = [
     {id: 'r1', name: 'Spaghetti Bolognese', cuisine: 'Italian', mealType: 'Dinner', prepTime: 30, link: '', notes: ''},
     // ...
   ];
   const mealPlan = [
     {id: 'm1', name: 'Mon Dinner', day: 'Monday', meal: 'Dinner', week: '2026-06-15', recipeId: 'r1', prep: false, notes: ''},
     // ...
   ];
   const shoppingList = [
     {id: 's1', name: 'Beef mince', category: 'Meat & Fish', quantity: '500g', bought: false, recipeId: 'r1', mealPlanId: 'm1'},
     // ...
   ];
   ```

2. **Seed realistic data**: 5–8 recipes across the planned meal types, 7–10 meal-plan entries spanning the week, and 8–12 shopping items tied back to recipes/meal-plan entries via the FK ids. Use the nearest upcoming Monday for `week`.

3. **Show one section per table** as a labelled table. Resolve FK cells to the linked record's **name** (look it up in the source array) — never display a raw id. Omit any optional column that has no data rather than rendering empty cells.

4. Give the canvas clear visual hierarchy: the weekly meal plan is the primary view; recipes and shopping list are supporting tables.

## Step 4: Confirm and hand off

After writing the canvas, link it with a markdown link to the `.canvas.tsx` path (per the canvas skill) and summarise:
- Which tables and columns were included (and any optional ones skipped)
- How much sample data was seeded
- That running the `canvas-to-tinybase` skill next will turn this canvas into a live TinyBase store with CRUD
