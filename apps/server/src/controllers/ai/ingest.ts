import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { _scrapingJob } from '../../services/scraping-job/index.js';
import { _item } from '../../services/item/index.js';
import { _searchItem } from '../../services/search-item/index.js';
import { ai } from '../../lib/ai.js';
import { _aiSearchItem } from '../../services/ai-search-item/index.js';
import { EVENTS, eventEmitter } from '../../config/event-emitter.js';

type AiJobStatus = 'pending' | 'processing' | 'success';

type ReqBody = {
  job_id: string;
  product_id_list: string[];
  status: AiJobStatus;
};

export const ingest = async (req: Request<unknown, unknown, ReqBody, unknown>, res: Response) => {
  try {
    const { product_id_list: searchItemIds, job_id: jobId, status } = req.body;
    let scrapingJob = await prisma.scrapingJob.findUnique({ where: { externalId: jobId } });

    if (searchItemIds) {
      await Promise.all(
        searchItemIds.map(async (searchItemId) => {
          try {
            const existingItem = await _item.findByExternalId(searchItemId);
            if (!!existingItem) return;

            const searchItem = await ai.getProduct(searchItemId);

            if (!searchItem) return;
            return await _aiSearchItem.ingest(searchItem, scrapingJob);
          } catch (error) {
            console.error('Failed to fetch item', error);
          }
        }),
      );
    }

    if (status === 'success') {
      scrapingJob = await _scrapingJob.updateStatus(scrapingJob, 'COMPLETED');
      eventEmitter.emit(EVENTS.SCRAPING_JOB_STATUS_UPDATED, { status: 'COMPLETED', searchId: scrapingJob.searchId });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
