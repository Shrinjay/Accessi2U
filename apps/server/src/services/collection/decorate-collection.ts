import { Collection, CollectionItem, Item } from 'database';
import { CollectionWithItem } from '../../procedures/user/on-collection-created.js';
import { _item } from '../item/index.js';
import { ISearchItem } from '../ai-search-item/to-isearchitem.js';

type DecoratedCollection = Collection & {
  items: (CollectionItem & { item: Item })[];
  collectionImgs: string[];
  count: number;
  searchItems: ISearchItem[];
};

export const decorateCollection = async (collection: CollectionWithItem): Promise<DecoratedCollection> => {
  const items = collection.items.map((collectionItem) => collectionItem.item);
  const nestedSearchItems = await Promise.all(items.map(_item.getFromTypesense));
  const searchItems = nestedSearchItems.flat();

  const collectionImgs = searchItems.map((searchItem) => searchItem.productImageUrl);
  const count = collection.items.length;

  return {
    ...collection,
    collectionImgs,
    count,
    searchItems,
  };
};
