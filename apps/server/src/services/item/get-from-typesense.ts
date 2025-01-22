import { Item } from 'database';
import { typesense } from '../../config/typesense.js';
import { TYPESENSE_COLLECTION_NAME } from '../../config/env.js';
import { SearchResponseHit } from 'typesense/lib/Typesense/Documents.js';
import { ISearchItem } from '../ai-search-item/to-isearchitem.js';

export const getFromTypesense = async (item: Item) => {
  const results = await typesense
    .collections(TYPESENSE_COLLECTION_NAME)
    .documents()
    .search({
      q: '*',
      // query_by: 'id',
      filter_by: `id:${item.externalId}`,
    });

  const hits: SearchResponseHit<ISearchItem>[] = results.hits as SearchResponseHit<ISearchItem>[];
  const iSearchItems = hits.map((hit) => hit.document);

  return iSearchItems;
};
