import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const items = getCollectionFn('items');
export const users = getCollectionFn('users');
export const tags = getCollectionFn('tags');
export const ads = getCollectionFn('ads');
