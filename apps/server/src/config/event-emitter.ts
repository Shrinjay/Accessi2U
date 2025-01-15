import EventEmitter from 'events';
import { ISearchItem } from '../services/ai-search-item/to-isearchitem.js';
import { Collection, ScrapingJobStatus, User } from 'database';
import { _user } from '../services/user/index.js';
import { CollectionWithItem } from '../procedures/user/on-collection-created.js';

export enum EVENTS {
  SEARCH_ITEM_CREATED = 'SEARCH_ITEM_CREATED',
  SCRAPING_JOB_STATUS_UPDATED = 'SCRAPING_JOB_STATUS_UPDATED',
  COLLECTION_CREATED_EXTERNAL = 'COLLECTION_CREATED_EXTERNAL',
  COLLECTION_CREATED = 'COLLECTION_CREATED',
}

export type SearchItemCreatedEventPayload = { searchItem: ISearchItem; searchId: number };
export type ScrapingJobStatusUpdatedEventPayload = { status: ScrapingJobStatus; searchId: number };

export const eventEmitter = new EventEmitter();

export type CollectionCreatedPayload = { collection: Collection; user: User };
export type CollectionCreatedExternalPayload = { collections: CollectionWithItem[]; user: User };

eventEmitter.on(EVENTS.COLLECTION_CREATED, async ({ user }: CollectionCreatedPayload) => {
  const nextCollections = await _user.getCollections(user);
  const payload: CollectionCreatedExternalPayload = { collections: nextCollections, user };

  eventEmitter.emit(EVENTS.COLLECTION_CREATED_EXTERNAL, payload);
});
