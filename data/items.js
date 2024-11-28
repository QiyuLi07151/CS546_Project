import { items } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const itemCollection = await items();

export const getAllItems = async () => {
    let itemList = await itemCollection
        .find({})
        .toArray();
    itemList = itemList.map((item) => {
        item._id = item._id.toString();
        return item;
    });
    return itemList;
};