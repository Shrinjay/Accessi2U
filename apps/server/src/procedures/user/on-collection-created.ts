import { observable } from '@trpc/server/observable';
import { procedure } from '../procedure.js';
import { Collection, CollectionItem, Item } from 'database';
import { CollectionCreatedExternalPayload, EVENTS, eventEmitter } from '../../config/event-emitter.js';

export type CollectionWithItem = Collection & { items: (CollectionItem & { item: Item })[] };

export const onCollectionCreated = procedure.subscription(({ ctx }) => {
  return observable<CollectionWithItem[]>((emit) => {
    const handleCollectionCreated = ({ collections, user }: CollectionCreatedExternalPayload) => {
      if (user.id !== ctx.user.id) return;

      emit.next(collections);
    };

    eventEmitter.on(EVENTS.COLLECTION_CREATED_EXTERNAL, handleCollectionCreated);

    return () => {
      eventEmitter.off(EVENTS.COLLECTION_CREATED_EXTERNAL, handleCollectionCreated);
    };
  });
});
