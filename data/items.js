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


export const getAllItemsByTag = async (tagId) => {
    const tag = await tagData.getTagById(tagId);
    
    const itemIds = tag.relativeProduct;
    // console.log(itemIds);
    
    const itemsData = [];

    for(let id of itemIds){
        let item = await getItemById(id.toString());
        itemsData.push(item);
    }
    // console.log(itemsData);
    
    return itemsData;
};