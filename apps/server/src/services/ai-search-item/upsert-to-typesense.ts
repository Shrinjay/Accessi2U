import { TYPESENSE_COLLECTION_NAME } from '../../config/env.js';
import { typesense } from '../../config/typesense.js';
import { _aiSearchItem } from './index.js';
import { AiSearchItem } from './to-isearchitem.js';

export const upsertToTypesense = async (searchItem: AiSearchItem) => {
  const iSearchItem = _aiSearchItem.toISearchItem(searchItem);
  await typesense.collections(TYPESENSE_COLLECTION_NAME).documents().upsert(iSearchItem);

  return iSearchItem;
};
