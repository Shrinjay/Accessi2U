import { create } from './create.js';
import { fetchMore } from './fetch-more.js';
import { get } from './get.js';
import { scrape } from './scrape.js';
import { searchFromTypesense } from './search-from-typesense.js';

export const _search = {
  create,
  get,
  scrape,
  searchFromTypesense,
  fetchMore,
};
