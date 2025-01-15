import { Search } from 'database';
import { typesense } from '../../config/typesense.js';
import { MAX_VECTOR_DISTANCE, TYPESENSE_COLLECTION_NAME } from '../../config/env.js';
import { SearchResponse, SearchResponseHit } from 'typesense/lib/Typesense/Documents.js';
import { ISearchItem } from '../ai-search-item/to-isearchitem.js';
import { _item } from '../item/index.js';
import { _searchItem } from '../search-item/index.js';

export const searchFromTypesense = async (search: Search, excludeIds: string[] = []): Promise<ISearchItem[]> => {
  const { query } = search;
  const results = await typesense.multiSearch.perform({
    searches: [
      {
        collection: TYPESENSE_COLLECTION_NAME,
        q: query,
        query_by: 'embedding',
        exclude_fields: 'embedding',
        ...(excludeIds.length && { filter_by: `id:!=[${excludeIds.join(',')}]` }),
      },
    ],
  });

  const searchResults: SearchResponse<ISearchItem> = results.results?.[0];
  const hits = searchResults.hits.filter((hit: any) => hit.vector_distance <= parseFloat(MAX_VECTOR_DISTANCE));
  const documents = hits.map((hit) => hit.document);

  // Upsert items then create search items asynchronously
  documents.map(async (hit) =>
    _item.upsert({ externalId: hit.id }).then((item) => _searchItem.create({ searchId: search.id, itemId: item.id })),
  );

  return documents;
};
