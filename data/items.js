import { items, tags } from "../config/mongoCollections.js";
import { ObjectId, ReturnDocument } from "mongodb";
import * as tagData from './tags.js'
import { addItemToTags } from "./tags.js";

const itemCollection = await items();

export const getTotalDataNumber = async () => {
    return await itemCollection.countDocuments({});
}

export const getAllItems = async (page) => {
    const limit = 5;
    const skip = (page - 1) * limit;
    let itemList = await itemCollection
        .find({})
        .sort({Avg_rating: -1})
        .skip(skip)
        .limit(limit)
        .toArray();
    itemList = itemList.map((item) => {
        item._id = item._id.toString();
        return item;
    });
    return itemList;
};

export const getItemById = async (itemId) => {
    let _item = await itemCollection
        .findOne({_id: new ObjectId(itemId)})
    if(!_item) throw new Error("item not found.")
    return _item;
};

export const getItemByIds = async (itemIds) => {
    const itemsData = [];

    for(let id of itemIds){
        let item = await getItemById(id.toString());
        itemsData.push(item);
    }
    
    return itemsData;
};


export const getAllItemsByTag = async (tagId) => {
    const tag = await tagData.getTagById(tagId);
    
    const itemIds = tag.relativeProduct;
    
    const itemsData = getItemByIds(itemIds);
    
    return itemsData;
};

export const getItemByName = async (itemName) => {
    const items = await itemCollection
        .find({ Name: { $regex: itemName, $options: "i" } }) // Case-insensitive match
        .toArray();

    if (items.length === 0) {
        throw new Error(`No items found matching the name "${itemName}"`);
    }

    // Convert ObjectId to string for consistency
    return items.map((item) => {
        item._id = item._id.toString();
        return item;
    });
};

//tagName should be case-insensitive
export const addItem = async (ownerId, itemName, itemDesc, itemTags, itemPrice, itemImg, itemStatus) => {
    const newItemId = new ObjectId();
    const newItem = {
        _id: newItemId,
        OwnerId: new ObjectId(ownerId),
        Name: itemName,
        Description: itemDesc,
        Tags: itemTags,
        Price: itemPrice,
        Image: itemImg,
        Status: itemStatus,
        Reviews: [],
        WishedBy: [],
        Avg_rating: 0,
        Sum_rating: 0
    };
    try {
        const insertInfo = await itemCollection.insertOne(
            newItem
        );
    } catch (error) {
        throw error;
    }
    try {
        for(let tagName of itemTags){
            await addItemToTags(newItemId, tagName);
        }
    } catch (error) {
        throw error;
    }
};

export const addRatingAndReview = async (userId, itemId, rating, review) => {
    try {
        const updateInfo = await itemCollection.findOneAndUpdate(
            {_id: new ObjectId(itemId)},
            [
                {
                    $set: {
                        Avg_rating: {
                            $round: [
                                {
                                    $divide: [
                                        {$add: ["$Sum_rating",rating]},
                                        {$add: [{$size: "$Reviews"}, 1]}
                                    ]
                                },
                                1
                            ]
                        },
                        Sum_rating: { $add: ["$Sum_rating", rating] },
                        Reviews: { 
                            $concatArrays: [
                                "$Reviews",
                                [{ UserId: new ObjectId(userId), Review: review, Rating: rating }]
                            ]
                        },
                    }
                }
            ],
            {returnDocument: 'after'}
        );
        if(!updateInfo) throw "item not found..";
        console.log(updateInfo);
    } catch (error) {
        throw error;
    }
};