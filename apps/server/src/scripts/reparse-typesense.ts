import { ai } from '../lib/ai.js';
import { prisma } from '../config/prisma.js';
import { _aiSearchItem } from '../services/ai-search-item/index.js';

const main = async () => {
  const items = await prisma.item.findMany();
  const aiItems = await Promise.all(items.map((item) => ai.getProduct(item.externalId)));

  await Promise.all(aiItems.map(_aiSearchItem.upsertToTypesense));
};

main()
  .then(() => {
    console.log('Items re-parsed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to re-parse items', error);
    process.exit(1);
  });
