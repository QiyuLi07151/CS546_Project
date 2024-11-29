import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation  from '../helpers.js'

const usersCollection = await users();

export const getUserById = async (userId) => {
    // determine user exists in database
    let user = await usersCollection.findOne({ "_id": new ObjectId(userId) });
    console.log(user);
    
    if (!user) {
      throw new Error("No user found with the given userId");
    }
    
    //return result
    return user;
};

