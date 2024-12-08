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
  let tagName = req.body.tagName;
  try {
    validation.isProvided(tagName);
    tagName = validation.isValidString(tagName);
  } catch (error) {
    return res.status(400).json({error: error});
  }
  try {
    const items = await tagData.getItemsByTag(tagName);
    return res.json(items);
  } catch (error) {
    return res.status(404).json({error: error});
  }
});


router.post("/tags", async (req, res) => {
  let tagName = req.body.tagName;
  try {
    validation.isProvided(tagName);
    tagName = validation.isValidString(tagName);
  } catch (error) {
    return res.status(400).json({error: error});
  }
  try {
    const tags =  await tagData.getTagsByName(tagName);
    return res.status(200).json(tags);
  } catch (error) {
    return res.status(404).json({error: error});
  }
});



export default router;