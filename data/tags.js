import { tags } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from '../helpers.js'

const tagsCollection = await tags();
const usersCollection = await users();

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
  let allTags = await tagsCollection.find({}, { _id: 1, TagName: 1 }).toArray();
  if (!allTags) {
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
    if (items.RelativeItem.length === 0) throw "No item with that tagName.";
    items.RelativeItem.sort((a, b) => b.UpvoteCount - a.UpvoteCount);
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

export const checkUserUpvoted = async (userId, itemId, tagId) => {
  const tag = await tagsCollection.findOne(
    { _id: new ObjectId(tagId), "RelativeItem.ItemId": new ObjectId(itemId) }
  );
  if (!tag) return false;
  const item = tag.RelativeItem.find(item => item.ItemId.equals(new ObjectId(itemId)));
  return item && item.UpvoteUsers.some(user => user.equals(new ObjectId(userId)));
};

export const upvoteTags = async (userId, itemId, tagId) => {
  const hasUpvoted = await checkUserUpvoted(userId, itemId, tagId);
  if (!hasUpvoted) {
    const tagResult = await tagsCollection.updateOne(
      { _id: new ObjectId(tagId), "RelativeItem.ItemId": new ObjectId(itemId) },
      {
        $inc: { "RelativeItem.$.UpvoteCount": 1 },
        $addToSet: { "RelativeItem.$.UpvoteUsers": new ObjectId(userId) },
      }
    );

    if (tagResult.modifiedCount === 0) {
      throw 'Failed to upvote tag';
    }

    let newTag = await tagsCollection.findOne(
      { _id: new ObjectId(tagId), "RelativeItem.ItemId": new ObjectId(itemId) }
    );
    if (!newTag) return false;
    let item = newTag.RelativeItem.find(item => item.ItemId.equals(new ObjectId(itemId)));

    const userResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { UpvoteTags: { ItemId: new ObjectId(itemId), TagId: new ObjectId(tagId) } } }
    );

    if (userResult.modifiedCount === 0) {
      throw 'Failed to update user\'s upvoted tags';
    }

    return { message: item, hasUpvoted: !hasUpvoted };
  }
  if (hasUpvoted) {
    const tagResult = await tagsCollection.updateOne(
      { _id: new ObjectId(tagId), "RelativeItem.ItemId": new ObjectId(itemId) },
      {
        $inc: { "RelativeItem.$.UpvoteCount": -1 },
        $pull: { "RelativeItem.$.UpvoteUsers": new ObjectId(userId) }
      }
    );

    if (tagResult.modifiedCount === 0) {
      throw 'Failed to remove upvote tag';
    }

    let newTag = await tagsCollection.findOne(
      { _id: new ObjectId(tagId), "RelativeItem.ItemId": new ObjectId(itemId) }
    );
    if (!newTag) return false;
    let item = newTag.RelativeItem.find(item => item.ItemId.equals(new ObjectId(itemId)));

    const userResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { UpvoteTags: { ItemId: new ObjectId(itemId), TagId: new ObjectId(tagId) } } }
    );

    if (userResult.modifiedCount === 0) {
      throw 'Failed to update user\'s upvoted tags';
    }

    return { message: item, hasUpvoted: !hasUpvoted };
  }
};

export const currentUpvote = async (userId, itemId, tagId) => {
  const hasUpvoted = await checkUserUpvoted(userId, itemId, tagId);
  let newTag = await tagsCollection.findOne(
    { _id: new ObjectId(tagId), "RelativeItem.ItemId": new ObjectId(itemId) }
  );
  if (!newTag) return false;
  let item = newTag.RelativeItem.find(item => item.ItemId.equals(new ObjectId(itemId)));
  return { message: item, hasUpvoted: hasUpvoted };
};

