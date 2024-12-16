import { users } from "../config/mongoCollections.js";
import { items } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from '../helpers.js'

const usersCollection = await users();
const itemsCollection = await items();

export const getUserById = async (userId) => {
  // determine user exists in database
  let user = await usersCollection.findOne({ "_id": new ObjectId(userId) });
  // console.log(user);

  if (!user) {
    throw new Error("No user found with the given userId");
  }

  //return result
  return user;
};

export const getUserByName = async (userName) => {
  let user = await usersCollection.findOne({
    // "Name": userName 
    $expr: {
      $eq: [{ $toLower: "$Name" }, userName.toLowerCase()]
    }
  });

  return user;
};

export const addUser = async (username, password, isOwner) => {
  const Name = username;
  const Password = password;
  const IsOwner = isOwner;

  const newUser = {
    Name,
    Password,
    IsOwner: IsOwner || false,
    Wishlist: [],
    ownedItems: IsOwner ? [] : null
  };

  const insertInfo = await usersCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add user';
  }

  return await getUserById(insertInfo.insertedId.toString());
};

export const checkUserFavorite = async (userId, itemId) => {
  const user = await usersCollection.findOne(
    { _id: new ObjectId(userId) }
  );
  if (!user) return false;
  const itemObjectId = new ObjectId(itemId);
  return user.Wishlist.some(id => id.toString() === itemObjectId.toString());
};

export const updateFavoriteItem = async (userId, itemId) => {
  const hasFavorited = await checkUserFavorite(userId, itemId);
  if (!hasFavorited) {
    const userResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { Wishlist: new ObjectId(itemId) } }
    );

    if (userResult.modifiedCount === 0) {
      throw 'Failed to add item to favorites';
    }

    const itemResult = await itemsCollection.updateOne(
      { _id: new ObjectId(itemId) },
      { $addToSet: { WishedBy: new ObjectId(userId) } }
    );

    if (itemResult.modifiedCount === 0) {
      throw 'Failed to add user to item\'s WishedBy list';
    }

    return { hasFavorited: !hasFavorited };
  }
  if (hasFavorited) {
    const userResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { Wishlist: new ObjectId(itemId) } }
    );

    if (userResult.modifiedCount === 0) {
      throw 'Failed to remove item from favorites';
    }

    const itemResult = await itemsCollection.updateOne(
      { _id: new ObjectId(itemId) },
      { $pull: { WishedBy: new ObjectId(userId) } }
    );

    if (itemResult.modifiedCount === 0) {
      throw 'Failed to remove user from item\'s WishedBy list';
    }

    return { hasFavorited: !hasFavorited };
  }
};

export const currentFavorite = async (userId, itemId) => {
  const hasFavorited = await checkUserFavorite(userId, itemId);
  return { hasFavorited: hasFavorited };
};