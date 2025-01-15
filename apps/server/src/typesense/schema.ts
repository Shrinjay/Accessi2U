import { typesense } from '../config/typesense.js';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js';

const baseSearchItemSchema: Omit<CollectionCreateSchema, 'name'> = {
  default_sorting_field: 'createdAt',
  fields: [
    {
      name: 'id',
      type: 'string',
      facet: true,
    },
    {
      name: 'createdAt',
      type: 'int64',
      facet: false,
      sort: true,
    },
    {
      name: 'productUrl',
      type: 'string',
      facet: false,
    },
    {
      name: 'productPrice',
      type: 'float',
      facet: false,
    },
    {
      name: 'productPriceCurrency',
      type: 'string',
      facet: false,
    },
    {
      name: 'productDescription',
      type: 'string',
      facet: false,
    },
    {
      name: 'vendorName',
      type: 'string',
      facet: false,
    },
    {
      name: 'productName',
      type: 'string',
      facet: false,
    },
    {
      name: 'productColor',
      type: 'string[]',
      facet: false,
    },
    {
      name: 'productImageUrl',
      type: 'string',
      facet: false,
    },
    {
      name: 'embedding',
      type: 'float[]',
      facet: false,
      embed: {
        from: ['productName', 'productDescription'],
        model_config: {
          model_name: 'ts/all-MiniLM-L12-v2',
        },
      },
    },
  ],
};

export const generateSchema = async () => {
  const searchItemSchema = { ...baseSearchItemSchema, name: `search_items_${Date.now()}` };
  const collection = await typesense.collections().create(searchItemSchema);

  return collection;
};
