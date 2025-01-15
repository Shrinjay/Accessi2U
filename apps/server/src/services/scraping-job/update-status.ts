import { ScrapingJob, ScrapingJobStatus } from 'database';
import { prisma } from '../../config/prisma.js';

export const updateStatus = async (scrapingJob: ScrapingJob, status: ScrapingJobStatus) => {
  return await prisma.scrapingJob.update({
    where: { id: scrapingJob.id },
    data: { status },
  });
};
