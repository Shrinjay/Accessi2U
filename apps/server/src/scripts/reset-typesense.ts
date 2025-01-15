import { generateSchema } from '../typesense/schema.js';

const main = async () => {
  const collection = await generateSchema();
  console.log('Schema created: ', collection);
};

main()
  .then(() => console.log('Done'))
  .catch((e) => console.error(e))
  .finally(() => process.exit());
