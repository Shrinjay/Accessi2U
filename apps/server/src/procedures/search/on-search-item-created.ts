import { observable } from '@trpc/server/observable';
import { procedure } from '../procedure.js';
import { ISearchItem } from '../../services/ai-search-item/to-isearchitem.js';
import { EVENTS, SearchItemCreatedEventPayload, eventEmitter } from '../../config/event-emitter.js';
import * as Yup from 'yup';

const schema = Yup.object({
  searchId: Yup.number().required(),
});

export const onSearchItemCreated = procedure.input(schema).subscription(({ input }) => {
  return observable<ISearchItem>((emit) => {
    const handleSearchItemCreated = ({ searchItem, searchId }: SearchItemCreatedEventPayload) => {
      if (searchId !== input.searchId) return;
      emit.next(searchItem);
    };

    eventEmitter.on(EVENTS.SEARCH_ITEM_CREATED, handleSearchItemCreated);

    return () => {
      eventEmitter.off(EVENTS.SEARCH_ITEM_CREATED, handleSearchItemCreated);
    };
  });
});
