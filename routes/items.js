import { Router } from "express";
const router = Router();
import * as itemData from "../data/items.js";
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

export default router;