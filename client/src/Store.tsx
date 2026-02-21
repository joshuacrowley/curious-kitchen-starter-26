import {createMergeableStore, type Row} from 'tinybase/with-schemas';
import * as UiReact from 'tinybase/ui-react/with-schemas';
import {type NoValuesSchema} from 'tinybase/with-schemas';
import {createLocalPersister} from 'tinybase/persisters/persister-browser/with-schemas';
import {SERVER} from './config';
import ReconnectingWebSocket from 'reconnecting-websocket';
import {createWsSynchronizer} from 'tinybase/synchronizers/synchronizer-ws-client/with-schemas';
import {useCreateSynchronizer} from 'tinybase/ui-react';

const SHOPPING_SCHEMA = {
  shoppingItems: {
    name: {type: 'string', default: ''},
    category: {type: 'string', default: 'Other'},
    checked: {type: 'boolean', default: false},
  },
} as const;

type Schemas = [typeof SHOPPING_SCHEMA, NoValuesSchema];

const {
  useAddRowCallback,
  useCreateMergeableStore,
  useCreatePersister,
  useDelRowCallback,
  useProvideStore,
  useRow,
  useSetCellCallback,
  useSortedRowIds,
} = UiReact as UiReact.WithSchemas<Schemas>;

export type ShoppingItemRow = Row<typeof SHOPPING_SCHEMA, 'shoppingItems'>;

export {
  useAddRowCallback,
  useDelRowCallback,
  useRow,
  useSetCellCallback,
  useSortedRowIds,
};

export const STORE_ID = 'shoppingItems';

export const Store = ({onReady}: {onReady?: () => void}) => {
  const store = useCreateMergeableStore(() =>
    createMergeableStore()
      .setTablesSchema(SHOPPING_SCHEMA)
      .setDefaultContent([{shoppingItems: {}}, {}]),
  );

  useProvideStore(STORE_ID, store);

  useCreatePersister(
    store,
    (store) => createLocalPersister(store, STORE_ID),
    [],
    async (persister) => {
      await persister.load();
      await persister.startAutoSave();
      onReady?.();
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useCreateSynchronizer(store as any, async () => {
    const serverPathId = location.pathname;
    const synchronizer = await createWsSynchronizer(
      store,
      new ReconnectingWebSocket(SERVER + serverPathId),
    );
    await synchronizer.startSync();

    synchronizer.getWebSocket().addEventListener('open', () => {
      synchronizer.load().then(() => {
        synchronizer.save();
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return synchronizer as any;
  });

  return null;
};
