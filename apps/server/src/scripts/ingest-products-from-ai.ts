import { _aiSearchItem } from '../services/ai-search-item/index.js';
import { ai } from '../lib/ai.js';
import { asyncBatch } from './helpers.js';

const main = async () => {
  const items = await ai.listProducts();
  console.log(`Ingesting ${items.length} items`);
  await asyncBatch(items, 10, (item) => _aiSearchItem.ingest(item), 100);
};

main()
  .then(() => {
    console.log('Items ingested successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to ingest items', error);
    process.exit(1);
  });
