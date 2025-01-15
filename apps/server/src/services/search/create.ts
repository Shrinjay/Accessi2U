/*
  When we initiate a search, we need to be able to create a search object in the database
  Then, whenever we need to load more results, we can pass that to the scrape method
  Whenever we need more results, we can pass that to another method which gets more results
*/

import { Search, User } from 'database';
import { prisma } from '../../config/prisma.js';
import { _search } from './index.js';

export const MIN_HITS = 15;

export const create = async ({ query }: Partial<Search>, user?: User) => {
  // We can do a vector search against the product DB and use that to get the most relevant products
  // Then we need to set some boundaries for what is enough and what requires more
  // if we search more, we should have another method here called _search.scrape that actually triggers scraping
  const search = await prisma.search.create({
    data: {
      query,
      ...(user && { user: { connect: { id: user.id } } }),
    },
  });

  const searchHits = await _search.searchFromTypesense(search);
  const numHits = searchHits.length;

  if (numHits < MIN_HITS) {
    try {
      await _search.scrape(search);
    } catch (error) {
      console.error('Error scraping search', error);
    }
  }

  return { ...search, results: searchHits };
};
