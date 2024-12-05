//tagName should be case-insensitive
//export const addItem = async (ownerId, itemName, itemDesc, itemTags, itemPrice, itemImg, itemStatus)

import { addItem } from "./data/items.js";
import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "./config/mongoConnection.js"
try {
    await addItem(new ObjectId(), "itemName", "itemDesc", ["itemTag"], 10, "itemImg", true);
} catch (error) {
    console.error(error);
}
closeConnection();
