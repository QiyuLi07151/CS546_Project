

import { dbConnection, closeConnection } from "./config/mongoConnection.js"
import { getItemsByTag } from "./data/tags.js";

try {
    console.log(await getItemsByTag("itemtag3"));
} catch (error) {
    console.error(error);
}
closeConnection();
