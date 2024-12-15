import { Router } from "express";
const router = Router();
import * as tagData from "../data/tags.js";
import * as itemData from "../data/items.js";
import { ObjectId } from "mongodb";
import * as validation from "../helpers.js";

/*
XIAO
Completed
/tagId
Method : get
@param body:Id(String)
@return JSON Object{}
*/
router.get("/tagId", async (req, res) => {

  try {
    //pre check
    let tagId = req.body.tagId;
    validation.isProvided(tagId);
    tagId = validation.isValidString(tagId);
    validation.isValidObjectId(tagId);

    // get tag data
    const tag = await tagData.getTagById(tagId);

    // return
    return res.status(200).json(tag);
  } catch (error) {
    const errorMessage = error.message || error;

    if (errorMessage.includes("No tag found with the given tag")) {
      return res.status(404).json({ error: "No tag found with the given tag" });
    } else {
      return res.status(400).json({ error: errorMessage });
    }
  }
});

router.get("/tagName", async (req, res) => {
  let tagName = req.query.tagName;
  let page = req.query.page ? req.query.page : "1";
  try {
    validation.isProvided(tagName);
    tagName = validation.isValidString(tagName);
    page = await validation.isPageValidForTagName(tagName, page);

  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    const itemIds = await tagData.getItemsByTag(tagName);
    const ids = itemIds.map(item => item.ItemId);
    const items = await itemData.getItemByIds(ids, page);
    return res.json(items);
  } catch (error) {
    return res.status(404).json({ error: error });
  }
});


router.post("/tags", async (req, res) => {
  let tagName = req.body.tagName;
  try {
    validation.isProvided(tagName);
    tagName = validation.isValidString(tagName);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    const tags = await tagData.getTagsByName(tagName);
    return res.status(200).json(tags);
  } catch (error) {
    return res.status(404).json({ error: error });
  }
});

router.get("/allTags", async (req, res) => {
  let allTags = await tagData.getAllTags();
  if (allTags.length == 0) {
    return res.status(404).json({ error: "No Tags Yet" });
  } else {
    return res.status(200).json(allTags);
  }
});

router.post("/upvoteTags", async (req, res) => {
  const { userId, itemId, tagId } = req.body;
  try {
    validation.isProvided(userId);
    validation.isProvided(itemId);
    validation.isProvided(tagId);
    validation.isValidString(userId);
    validation.isValidString(itemId);
    validation.isValidString(tagId);
    // validation.isValidObjectId(userId);
    // validation.isValidObjectId(itemId);
    // validation.isValidObjectId(tagId);
    const result = await tagData.upvoteTags(userId, itemId, tagId);
    if (!result) return res.status(404).json({ error: "Either userId, itemId, tagId not found." });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

router.post("/currentUpvote", async (req, res) => {
  const { userId, itemId, tagId } = req.body;
  try {
    validation.isProvided(userId);
    validation.isProvided(itemId);
    validation.isProvided(tagId);
    validation.isValidString(userId);
    validation.isValidString(itemId);
    validation.isValidString(tagId);
    // validation.isValidObjectId(userId);
    // validation.isValidObjectId(itemId);
    // validation.isValidObjectId(tagId);
    const result = await tagData.currentUpvote(userId, itemId, tagId);
    if (!result) return res.status(404).json({ error: "Either userId, itemId, tagId not found." });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

export default router;