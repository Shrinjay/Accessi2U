import { Search } from 'database';
import { _search } from './index.js';
import { prisma } from '../../config/prisma.js';
import { MIN_HITS } from './create.js';

export const fetchMore = async (search: Search) => {
  const items = await prisma.searchItem.findMany({
    where: { searchId: search.id },
    include: { item: true },
  });
  const excludeItemIds = items.map((item) => item.item.externalId);

  const searchHits = await _search.searchFromTypesense(search, excludeItemIds);
  const numHits = searchHits.length;

  if (numHits < MIN_HITS) {
    try {
      await _search.scrape(search);
    } catch (error) {
      console.error('Error scraping search', error);
    }
  }

  return searchHits;
};
