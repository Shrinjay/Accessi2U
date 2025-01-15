import { ScrapingJob, ScrapingJobStatus, Search } from 'database';
import { prisma } from '../../config/prisma.js';

export const createFromExternal = async ({ externalId }: Partial<ScrapingJob>, search: Search) => {
  return await prisma.scrapingJob.create({
    data: {
      externalId: externalId as string,
      search: { connect: { id: search.id } },
      status: ScrapingJobStatus.IN_PROGRESS,
    },
  });
};
