---
name: notion-database-setup
description: Help the user plan their meal plan datbase setup
---

# Notion Meal Planning Database Setup

Creates a complete three-database meal planning system in Notion with relations, sample data, and sensible defaults. The three databases are **Recipes**, **Meal Planning**, and **Shopping List**.

## Step 1: Ask upfront questions

Before creating anything, ask the user these questions. Use `AskQuestion` in focused batches. See [references/questions.md](references/questions.md) for the full question bank — pick the ones most likely to shape the schema (don't ask all of them).

Minimum you need to know:
- Which meals do they plan? (just dinners, or breakfast/lunch/dinner/snacks)
- Do they plan a full week at a time or day by day?
- Do they shop at one store or multiple? Do they want items grouped by aisle/category?
- Do they want to track calories/macros or keep it simple?
- Do they want to share this with anyone (e.g. a partner)?

Once you have answers, propose the schema and confirm before building.

## Step 2: Create the three databases (in order)

Create in this dependency order — **Recipes first**, then Meal Planning, then Shopping List — because relations point from child to parent.

### Database 1: Recipes

```
Properties:
- Name           title
- Cuisine        select   [Italian, Mexican, Indian, Japanese, Thai, Chinese, Mediterranean, Australian, American, Other]
- Meal type      multi_select  [Breakfast, Lunch, Dinner, Snack]
- Prep time (min) number
- Link           url       (source URL or cookbook reference)
- Notes          text      (substitutions, serving suggestions)
```

Adjust `Meal type` options based on which meals the user plans.

Optional (based on answers):
- `Rating` select [⭐, ⭐⭐, ⭐⭐⭐, ⭐⭐⭐⭐, ⭐⭐⭐⭐⭐] — if they want to rate recipes
- `Servings` number — if portions matter
- `Total time (min)` number — if they want cook time too

### Database 2: Meal Planning

```
Properties:
- Name           title
- Day            select   [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
- Meal           select   [Breakfast, Lunch, Dinner, Snack]
- Week           date     (set to the Monday of the week being planned)
- Recipe         relation → Recipes
- Recipe / Link  url      (optional override link)
- Prep           checkbox (true if this meal needs advance prep)
- Notes          text
```

### Database 3: Shopping List

```
Properties:
- Name           title
- Category       select   [Produce, Meat & Fish, Dairy, Pantry, Frozen, Bakery, Other]
- Quantity       text     (e.g. "500g", "1 bunch", "2 cans")
- Bought         checkbox
- Recipe         relation → Recipes
- Meal plan entry relation → Meal Planning
```

Optional (based on answers):
- `Store` select — if they shop at multiple stores
- `Aisle` text — if they want aisle-level grouping
- `Price` number — if tracking budget

## Step 3: Add relations

After all three databases are created, add the relation properties using `notion-update-data-source` with the `collection://` IDs from the create responses.

- `Meal Planning → Recipe`: single relation to Recipes (`dual_property: false` unless "show all meal plan entries for this recipe" is useful)
- `Shopping List → Recipe`: single relation to Recipes
- `Shopping List → Meal plan entry`: single relation to Meal Planning

## Step 4: Add sample data

Seed realistic data for the coming week. Suggested minimums:
- **Recipes**: 5–8 entries covering a mix of meal types
- **Meal Planning**: 7–10 entries spanning Mon–Fri (or full week if requested), with relations to Recipes
- **Shopping List**: 8–12 items tied back to the meal plan entries and recipes

Use today's date as the anchor. Set `Week` on Meal Planning entries to the nearest upcoming Monday.

## Step 5: Confirm what was built

After creating everything, summarise:
- Links to each database
- Which properties were included (and any that were skipped)
- What sample data was added
- Which views are available by default (table), and suggest manual steps for any additional views (calendar by week, board by day, shopping list grouped by category) since view configuration is not supported via MCP
