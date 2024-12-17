import { items } from "../config/mongoCollections.js";
import { ObjectId, ReturnDocument } from "mongodb";
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
        .sort({ Avg_rating: -1 })
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
        .findOne({ _id: new ObjectId(itemId) })
    if (!_item) throw new Error("item not found.")
    return _item;
};

export const getItemByIds = async (itemIds, page) => {
    const items = [];
    await fetchItems(items, itemIds);
    return items;
};

async function fetchItems(items, itemIds) {
    for (const element of itemIds) {
        const item = await getItemById(element);
        items.push(item);
    }
}


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
        Sum_rating: 0,
    };
    try {
        const insertInfo = await itemCollection.insertOne(
            newItem
        );
    } catch (error) {
        throw error;
    }
    try {
        for (let tagName of itemTags) {
            await addItemToTags(newItemId, tagName);
        }
    } catch (error) {
        throw error;
    }
};

export const deleteRatingAndReview = async (userId, itemId) => {
    try {
        const isPresent = await isPresentRatingAndReview(userId, itemId);
        if (!isPresent) return null;
        const item = await itemCollection.findOneAndUpdate(
            {
                _id: new ObjectId(itemId),
            },
            [
                {
                    $set: {
                        Reviews: {
                            $filter: {
                                input: "$Reviews",
                                as: "review",
                                cond: {
                                    $ne: [
                                        "$$review.UserId", new ObjectId(userId)
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $set: {
                        Sum_rating: {
                            $sum: "$Reviews.Rating"
                        },
                        Avg_rating: {
                            $cond: [
                                { $gt: [{ $size: "$Reviews" }, 0] },
                                { $round: [{ $avg: "$Reviews.Rating" }, 1] },
                                0
                            ]
                        }
                    }
                }
            ],
            {
                returnDocument: "after"
            }
        );
        return item;
    } catch (error) {
        throw error;
    }
};


export const isPresentRatingAndReview = async (userId, itemId) => {
    try {
        const item = await itemCollection.findOne({
            _id: new ObjectId(itemId),
            Reviews: { $elemMatch: { UserId: new ObjectId(userId) } }
        });
        if (item) return true;
        return false;
    } catch (error) {
        throw error;
    }
}

export const addRatingAndReview = async (userId, itemId, rating, review) => {
    try {
        const isPresent = await isPresentRatingAndReview(userId, itemId);
        if (!isPresent) {
            const updateInfo = await itemCollection.findOneAndUpdate(
                { _id: new ObjectId(itemId) },
                [
                    {
                        $set: {
                            Avg_rating: {
                                $round: [
                                    {
                                        $divide: [
                                            { $add: ["$Sum_rating", rating] },
                                            { $add: [{ $size: "$Reviews" }, 1] }
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
                { returnDocument: 'after' }
            );
            return updateInfo;
        } else {
            return null;
        }

    } catch (error) {
        throw error;
    }
};

export const addTagToItem = async (tagName, itemId) => {
    try {
        const item = await itemCollection
            .findOne(
                { _id: new ObjectId(itemId) },
                { projection: { Tags: 1, _id: 0 } }
            );
        if (!item) throw "item not found.";
        if (item.Tags.includes(tagName)) {
            throw "tagName already exists.";
        }
        const updateInfo = await itemCollection.findOneAndUpdate(
            { _id: new ObjectId(itemId) },
            { $push: { Tags: tagName } },
            { returnDocument: 'after' }
        );
        await addItemToTags(itemId, tagName);
    } catch (error) {
        throw error;
    }
};


export const searchItemsByName = async (itemName, page = 1, limit = 5) => {
    if (!itemName || typeof itemName !== 'string') {
        throw new Error("Invalid itemName. It must be a non-empty string.");
    }
    if (typeof page !== 'number' || page < 1) {
        throw new Error("Invalid page. It must be a positive integer.");
    }
    if (typeof limit !== 'number' || limit < 1) {
        throw new Error("Invalid limit. It must be a positive integer.");
    }
    const skip = (page - 1) * limit;
    const itemCollection = await items();
    const itemsList = await itemCollection
        .find({ Name: { $regex: itemName, $options: "i" } })
        .skip(skip)
        .limit(limit)
        .toArray();
    const totalItems = await itemCollection.countDocuments({
        Name: { $regex: itemName, $options: "i" },
    });
    const totalPages = Math.ceil(totalItems / limit);
    const formattedItems = itemsList.map(item => ({
        ...item,
        _id: item._id.toString(),
    }));
    return {
        items: formattedItems,
        totalPages,
        currentPage: page
    };
};