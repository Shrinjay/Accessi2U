import { observable } from '@trpc/server/observable';
import { procedure } from '../procedure.js';
import { EVENTS, ScrapingJobStatusUpdatedEventPayload, eventEmitter } from '../../config/event-emitter.js';
import * as Yup from 'yup';
import { ScrapingJobStatus } from 'database';

const schema = Yup.object({
  searchId: Yup.number().required(),
});

export const onSearchStatusUpdated = procedure.input(schema).subscription(({ input }) => {
  return observable<ScrapingJobStatus>((emit) => {
    const handleSearchItemCreated = async ({ searchId, status }: ScrapingJobStatusUpdatedEventPayload) => {
      if (searchId !== input.searchId) return;
      emit.next(status);
    };

    eventEmitter.on(EVENTS.SCRAPING_JOB_STATUS_UPDATED, handleSearchItemCreated);

    return () => {
      eventEmitter.off(EVENTS.SCRAPING_JOB_STATUS_UPDATED, handleSearchItemCreated);
    };
  });
});
