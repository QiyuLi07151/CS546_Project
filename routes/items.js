import { Router } from "express";
const router = Router();
import * as itemData from "../data/items.js";
import * as userData from '../data/users.js'
import { ObjectId } from "mongodb";
import * as validation from "../helpers.js";

router.get("/", async (req, res) => {
    try {
        const itemList = await itemData.getAllItems();
        return res.json(itemList);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.get("/:itemId", async (req, res) => {
    let itemId = req.params.itemId;
    try {
        validation.isProvided(itemId);
        itemId = validation.isValidString(itemId);
        validation.isValidObjectId(itemId);
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const _item = await itemData.getItemById(itemId);
        return res.json(_item);
    } catch (e) {
        return res.status(404).json({ error: e });
    }
});

/* XIAO
Completed
/item/tag/ : id
Method : get
@param Id(String)
@return Array[ Object{} ]
*/
router.get("/tag/:tagId", async (req, res) => {
    try {
        // pre check
        let tagId = req.params.tagId;
        validation.isProvided(tagId);
        tagId = validation.isValidString(tagId);
        validation.isValidObjectId(tagId);

        // get items by tagId
        const items = await itemData.getAllItemsByTag(tagId);

        // return
        return res.status(200).json(items);
    } catch (error) {
        const errorMessage = error.message || error;

        if (errorMessage.includes("No tag found with the given tag")) {
            return res.status(404).json({ error: "No tag found with the given tag" });
        } else {
            return res.status(400).json({ error: errorMessage });
        }
    }
});


router.get("/user/:userId", async (req, res) => {
    try {
        // pre check
        let userId = req.params.userId;
        validation.isProvided(userId);
        userId = validation.isValidString(userId);
        validation.isValidObjectId(userId);

        // get user by userId
        const user = await userData.getUserById(userId);

        // get items data
        const itemIds = user.Wishlist;
        const items = await itemData.getItemByIds(itemIds);

        // return
        return res.status(200).json(items);
    } catch (error) {
        const errorMessage = error.message || error;

        if (errorMessage.includes("No user found with the given userId")) {
            return res.status(404).json({ error: "No user found with the given userId" });
        } else {
            return res.status(400).json({ error: errorMessage });
        }
    }
});

export default router;