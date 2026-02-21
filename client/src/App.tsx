import {StrictMode, useState} from 'react';
import {Provider, useStore, useTable} from 'tinybase/ui-react';
import {Inspector} from 'tinybase/ui-react-inspector';
import {
  Store,
  useAddRowCallback,
  useDelRowCallback,
  useSetCellCallback,
  STORE_ID,
} from './Store';
import {AddItemBar} from './components/shopping-list/add-item-bar';
import {CategorySection} from './components/shopping-list/category-section';
import {ShoppingItem} from './components/shopping-list/shopping-item';
import {SummaryBar} from './components/shopping-list/summary-bar';
import {EmptyState} from './components/shopping-list/empty-state';
import {PageHeader} from './components/shopping-list/page-header';

function getWeekOf() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(new Date().setDate(diff));
  return monday.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

type ItemRow = {name: string; category: string; checked: boolean};

function ShoppingItemRow({
  id,
  name,
  checked,
}: {
  id: string;
  name: string;
  checked: boolean;
}) {
  const delRow = useDelRowCallback('shoppingItems', id, STORE_ID);
  const setChecked = useSetCellCallback(
    'shoppingItems',
    id,
    'checked',
    (val: boolean) => val,
    [],
    STORE_ID,
  );

  return (
    <ShoppingItem
      id={id}
      name={name}
      checked={checked}
      onCheckedChange={setChecked}
      onDelete={delRow}
    />
  );
}

function ShoppingListApp() {
  const rawTable = useTable('shoppingItems', STORE_ID) as Record<string, ItemRow>;
  const store = useStore(STORE_ID);

  const addRow = useAddRowCallback(
    'shoppingItems',
    ({name, category}: {name: string; category: string}) => ({
      name,
      category,
      checked: false,
    }),
    [],
    STORE_ID,
  );

  const handleAdd = (name: string, category: string) => {
    addRow({name, category});
  };

  const handleClearChecked = () => {
    if (!store) return;
    Object.entries(rawTable ?? {})
      .filter(([, row]) => row.checked)
      .forEach(([id]) => store.delRow('shoppingItems', id));
  };

  const rowEntries = Object.entries(rawTable ?? {});
  const total = rowEntries.length;
  const checkedCount = rowEntries.filter(([, row]) => row.checked).length;

  const byCategory = rowEntries.reduce<
    Record<string, Array<[string, ItemRow]>>
  >((acc, [id, row]) => {
    const cat = row.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push([id, row]);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <PageHeader title="Shopping List" subtitle={`Week of ${getWeekOf()}`} />
        <AddItemBar onAdd={handleAdd} />
        {total === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="space-y-4">
              {Object.entries(byCategory).map(([category, items]) => (
                <CategorySection key={category} name={category}>
                  {items.map(([id, row]) => (
                    <ShoppingItemRow
                      key={id}
                      id={id}
                      name={row.name}
                      checked={row.checked}
                    />
                  ))}
                </CategorySection>
              ))}
            </div>
            <SummaryBar
              total={total}
              checked={checkedCount}
              onClearChecked={handleClearChecked}
            />
          </>
        )}
      </div>
      <Inspector />
    </div>
  );
}

export const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <StrictMode>
      <Provider>
        <Store onReady={() => setLoading(false)} />
        {!loading && <ShoppingListApp />}
      </Provider>
    </StrictMode>
  );
};
