import { Search } from 'database';
import { prisma } from '../../config/prisma.js';
import { _search } from './index.js';

export const get = async ({ id }: Partial<Search>) => {
  const search = await prisma.search.findUnique({
    where: { id },
    include: { scrapingJobs: true },
  });

  const results = await _search.searchFromTypesense(search);

  // If one job is in progress, the entire search is in progress
  const isInProgress = search.scrapingJobs.some((job) => job.status === 'IN_PROGRESS');
  const status = isInProgress ? 'IN_PROGRESS' : 'COMPLETE';

  return { ...search, results, status };
};
