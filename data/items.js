import { items } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

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
};