import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from '../helpers.js'

const usersCollection = await users();

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
  let user = await usersCollection.findOne({ "Name": userName });

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

