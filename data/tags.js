import { tags } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation  from '../helpers.js'

const tagsCollection = await tags();

export const getTagById = async (tagId) => {
    // determine user exists in database
    let tag = await tagsCollection.findOne({ "_id": new ObjectId(tagId) });
    console.log(tag);

    
    if (!tag) {
      throw new Error("No tag found with the given tagId");
    }
     
    //return result
    return tag;
};

// export const getAllItemsByTag = async (tagId) => {
//     // determine user exists in database
//     let tag = await tagsCollection.findOne({ "_id": new ObjectId(tagId) });
//     console.log(tag);

    
//     if (!user) {
//       throw new Error("No tag found with the given tagId");
//     }
     
//     //return result
//     return user;
// };
