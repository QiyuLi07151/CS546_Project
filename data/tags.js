import { tags } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation  from '../helpers.js'

const tagsCollection = await tags();

export const getTagById = async (tagId) => {
    // determine user exists in database
    let tag = await tagsCollection.findOne({ "_id": new ObjectId(tagId) });
    // console.log(tag);

    
    if (!tag) {
      throw new Error("No tag found with the given tagId");
    }
     
    //return result
    return tag;
};

export const addItemToTags = async (itemId, tagName) => {
  const newTagId = new ObjectId();
  try {
      const document = await tagsCollection.findOne({TagName: tagName});
      if(document){
          await tagsCollection.updateOne(
              {TagName: tagName},
              {
                  $inc: {RelativeItemCount: 1},
                  $push: {RelativeItem: {ItemId: itemId, UpvoteCount: 0, UpvoteUsers: []}}
              },
              {returnDocument: 'after'}
          );
      }else{
          const newDoc = {
              _id: newTagId,
              TagName: tagName,
              RelativeItem: [{ItemId: itemId, UpvoteCount: 0, UpvoteUsers: []}],
              RelativeItemCount: 1
          };
          await tagsCollection.insertOne(
              newDoc
          );
      }
  } catch (error) {
      throw error;
  }
};

export const getItemsByTag = async (tagName) => {
  try {
    const items = await tagsCollection.findOne(
      {TagName: tagName},
      {projection: {"RelativeItem.ItemId": 1, _id: 0}}
    );
    if(!items) throw "tagName not found.";
    return items.RelativeItem;
  } catch (error) {
    throw error;
  }
};