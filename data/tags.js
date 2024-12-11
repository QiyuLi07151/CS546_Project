import { tags } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from '../helpers.js'

const tagsCollection = await tags();

export const getTotalDataNumberForTagName = async (tagName) => {
  const items = await tagsCollection.findOne(
    { TagName: tagName }
  );
  return items.RelativeItem.length;
};

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

export const getAllTags = async () => {
  let allTags = await tagsCollection.find({}, {_id: 1, TagName: 1}).toArray();
  if(!allTags){
    throw 'Error fetching tags';
  }
  return allTags;
};

export const addItemToTags = async (itemId, tagName) => {
  const newTagId = new ObjectId();
  try {
    const document = await tagsCollection.findOne({ TagName: tagName });
    if (document) {
      await tagsCollection.updateOne(
        { TagName: tagName },
        {
          $inc: { RelativeItemCount: 1 },
          $push: { RelativeItem: { ItemId: itemId, UpvoteCount: 0, UpvoteUsers: [] } }
        },
        { returnDocument: 'after' }
      );
    } else {
      const newDoc = {
        _id: newTagId,
        TagName: tagName,
        RelativeItem: [{ ItemId: itemId, UpvoteCount: 0, UpvoteUsers: [] }],
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
      { TagName: tagName },
      { projection: { "RelativeItem": 1, _id: 0 } }
    );
    if (!items) throw "tagName not found.";
    if(items.RelativeItem.length === 0) throw "No item with that tagName.";
    items.RelativeItem.sort((a,b) => b.UpvoteCount - a.UpvoteCount);
    return items.RelativeItem;
  } catch (error) {
    throw error;
  }
};

export const getTagsByName = async (tagName) => {
  // Query the tags collection for soft matching
  const tags = await tagsCollection
    .find({ TagName: { $regex: tagName, $options: "i" } }) // Case-insensitive match
    .toArray();

  if (tags.length === 0) {
    throw new Error(`No tags found matching the name "${tagName}"`);
  }

  // Convert ObjectId to string for consistency
  return tags.map((tag) => {
    tag._id = tag._id.toString();
    return tag;
  });
};
