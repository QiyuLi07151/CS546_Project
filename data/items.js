import { items } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as tagData from './tags.js'


const itemCollection = await items();

export const getAllItems = async () => {
    let itemList = await itemCollection
        .find({})
        .sort({Avg_rating: -1})
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
    if(!_item) throw new Error("Item not found.")
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