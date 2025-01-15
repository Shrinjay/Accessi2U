import { ScrapingJob } from 'database';
import { _item } from '../item/index.js';
import { _searchItem } from '../search-item/index.js';
import { _aiSearchItem } from './index.js';
import { AiSearchItem } from './to-isearchitem.js';
import { EVENTS, eventEmitter } from '../../config/event-emitter.js';

export const ingest = async (searchItem: AiSearchItem, scrapingJob?: ScrapingJob) => {
  const iSearchItem = await _aiSearchItem.upsertToTypesense(searchItem);
  const item = await _item.upsert({ externalId: iSearchItem.id });

  if (scrapingJob) {
    await _searchItem.create({ searchId: scrapingJob.id, itemId: item.id });

    eventEmitter.emit(EVENTS.SEARCH_ITEM_CREATED, { searchItem: iSearchItem, searchId: scrapingJob.searchId });
  }
};
