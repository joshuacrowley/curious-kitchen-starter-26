# Curious Kitchen — Starter Kit

This is the starter kit for the **Curious Kitchen** workshop. It's a collaborative shopping list app built with TinyBase, React, TypeScript, Tailwind CSS v4, and shadcn/ui. Items are grouped by category, synced in real time across clients via WebSockets, and persisted locally in the browser.

Use this as your starting point during the workshop — the core plumbing is already in place so you can focus on building features.

## Getting Started

The project has two directories: `client` (the React app) and `server` (the Cloudflare Durable Objects WebSocket server).

Start the server first, then the client in a separate terminal:

```bash
# Terminal 1 – server
cd server
npm install
npm run dev
```

```bash
# Terminal 2 – client
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or whichever port Vite chooses). PNPM, Yarn, and Bun also work.

## Structure

```
ck-starter-26/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── shopping-list/   # Feature components
│   │   │   └── ui/              # Reusable UI primitives
│   │   ├── stories/             # Storybook example stories
│   │   ├── App.tsx              # Root application component
│   │   ├── Store.tsx            # TinyBase store setup
│   │   ├── config.ts            # Server URL and other config
│   │   └── index.tsx            # App entry point
│   ├── .storybook/              # Storybook configuration
│   └── index.html
└── server/
    ├── index.ts                 # Cloudflare Durable Objects server
    └── wrangler.toml            # Cloudflare Workers config
```

### Client

The `client` directory is a React + Vite + TypeScript app styled with Tailwind CSS v4 and shadcn/ui (Radix UI primitives).

#### Shopping List Components (`src/components/shopping-list/`)

These are the feature-specific components that make up the app UI. Each has a corresponding `.stories.tsx` file for Storybook.

- **`add-item-bar`** - Input bar for adding a new item with a name and category
- **`category-section`** - Groups items under a collapsible category heading
- **`shopping-item`** - A single list item with a checkbox and delete button
- **`summary-bar`** - Shows total vs. checked item counts and a "clear checked" action
- **`empty-state`** - Displayed when the list has no items
- **`page-header`** - Top-level header showing the list title and current week

#### UI Primitives (`src/components/ui/`)

Reusable building blocks (shadcn/ui style) with their own Storybook stories:

- **`badge`**, **`button`**, **`card`**, **`checkbox`**, **`input`**, **`label`**, **`select`**

#### Key Files

- **`src/Store.tsx`** - Creates the TinyBase `MergeableStore` with a typed `shoppingItems` schema (`name`, `category`, `checked`), wires up LocalStorage persistence, and connects the WebSocket synchronizer
- **`src/App.tsx`** - Reads the store, groups items by category, and renders the full shopping list UI
- **`src/config.ts`** - Server WebSocket URL (change this to point at your deployed server)

#### How It Works

**State management** uses TinyBase with a schema-validated `shoppingItems` table:

| Field      | Type    | Default |
|------------|---------|---------|
| `name`     | string  | `""`    |
| `category` | string  | `"Other"` |
| `checked`  | boolean | `false` |

**Persistence** — LocalStorage is used to save and restore the list automatically on page reload.

**Real-time sync** — A WebSocket synchronizer connects to the Cloudflare Durable Objects server. The URL path acts as the room ID, so anyone sharing the same URL sees live updates. The `MergeableStore` resolves conflicts using CRDTs, so all clients converge to the same state even with concurrent edits.

**React integration** — TinyBase hooks (`useTable`, `useAddRowCallback`, `useDelRowCallback`, `useSetCellCallback`) subscribe to store changes and re-render automatically.

#### Storybook

Each component has stories for visual development and testing:

```bash
cd client
npm run storybook   # opens at http://localhost:6006
```

### Server

The `server` directory is a Cloudflare Workers app using **Durable Objects** to handle WebSocket connections and sync state between clients.

#### Key Files

- **`index.ts`** - Defines the `TinyBaseDurableObject` class, which extends `WsServerDurableObject` and keeps a `MergeableStore` backed by Durable Object SQL storage
- **`wrangler.toml`** - Cloudflare Workers configuration including Durable Object bindings

#### How It Works

Each unique URL path maps to a single Durable Object instance. That instance:

- Accepts WebSocket connections from clients
- Maintains authoritative state in Durable Object SQL storage
- Broadcasts changes to all connected clients in the room
- Persists data across deployments automatically

To deploy to Cloudflare, configure your account details in `wrangler.toml` and run `npx wrangler deploy` from the `server` directory.

## Learn More

- [TinyBase Documentation](https://tinybase.org)
- [TinyBase Examples](https://tinybase.org/demos/)
- [shadcn/ui](https://ui.shadcn.com)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Storybook](https://storybook.js.org)
