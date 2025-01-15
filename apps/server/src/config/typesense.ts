import * as Typesense from 'typesense';
import { TYPESENSE_API_KEY, TYPESENSE_HOST } from './env.js';

const typesense = new Typesense.Client({
  nodes: [
    {
      host: TYPESENSE_HOST as string,
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: TYPESENSE_API_KEY as string,
});

export { typesense };
