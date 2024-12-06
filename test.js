//tagName should be case-insensitive
//export const addItem = async (ownerId, itemName, itemDesc, itemTags, itemPrice, itemImg, itemStatus)

import { addRatingAndReview } from "./data/items.js";
import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "./config/mongoConnection.js"
try {
    await addRatingAndReview("674ac2376e64c2824c712fe1","675230f6fe0574b58eda357f", 3, "itemReview");
} catch (error) {
    console.error(error);
}
closeConnection();
