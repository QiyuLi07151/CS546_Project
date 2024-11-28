import { items } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { isProvided, isValidString } from "../helpers.js";

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
    if(!isProvided(itemId))
        throw new Error("Input is not provided!");
    if(!isValidString(itemId))
        throw new Error("Input is not a valid string!");
    itemId = itemId.trim();
    let _item = await itemCollection
        .findOne({_id: new ObjectId(itemId)})
    if(!_item) throw new Error("No such itemId exists!")
    return _item;
};