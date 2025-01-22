import { ingest } from './ingest.js';
import { toISearchItem } from './to-isearchitem.js';
import { upsertToTypesense } from './upsert-to-typesense.js';

export const _aiSearchItem = {
  toISearchItem,
  upsertToTypesense,
  ingest,
};
