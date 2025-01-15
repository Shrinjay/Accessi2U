import { addToCollection } from './add-to-collection.js';
import { addUserToCollection } from './add-user-to-collection.js';
import { createCollection } from './create-collection.js';
import { getCollection } from './get-collection.js';
import { removeFromCollection } from './remove-from-collection.js';
import { removeUserFromCollection } from './remove-user-from-collection.js';
import { canAccess } from './can-access.js';
import { searchCollection } from './search-collection.js';
import { decorateCollection } from './decorate-collection.js';

export const _collection = {
  getCollection,
  createCollection,
  addToCollection,
  removeFromCollection,
  addUserToCollection,
  removeUserFromCollection,
  canAccess,
  searchCollection,
  decorateCollection,
};
