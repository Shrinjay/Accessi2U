/**
 * How should scraping even work?
 * Given a Search to the scrape method, we will call the AI layer and this will return a list of Job IDs
 * For each Job ID we'll create a ScrapingJob
 * Ideally, we get a webhook from the AI layer when each job is completed. This webhook should actually contain the
 * ID of the created product in the database so we can look it up directly
 * That way we can use a subscription on the frontend and push updates as each one is resolved
 * Yeah that makes sense
 */

import { Search } from 'database';
import { ai } from '../../lib/ai.js';
import { _scrapingJob } from '../scraping-job/index.js';
import { EVENTS, eventEmitter } from '../../config/event-emitter.js';

export const scrape = async (search: Search) => {
  const { jobId: externalId } = await ai.scrape(search.query);
  const job = await _scrapingJob.createFromExternal({ externalId }, search);

  eventEmitter.emit(EVENTS.SCRAPING_JOB_STATUS_UPDATED, { status: 'IN_PROGRESS', searchId: search.id });
  return job;
};
