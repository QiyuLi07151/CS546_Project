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
        return res.status(500).json({error: e});
    }
});

router.get("/:itemId", async (req, res) => {
    let itemId = req.params.itemId;
    if(!validation.isProvided(itemId))
        return res.status(400).json({error: "Input is not provided."});
    if(!validation.isValidString(itemId)){
        return res.status(400).json({error: "Input is not a valid type."});
    }
    itemId = itemId.trim();
    if(!validation.isValidObjectId(itemId)){
        return res.status(400).json({error: "Input is not a valid ObjectId."})
    }
    try {
        const _item = await itemData.getItemById(itemId);
        return res.json(_item);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

export default router;