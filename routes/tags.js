import { Router } from "express";
const router = Router();
import * as tagData from "../data/tags.js";
import * as itemData from "../data//items.js";

import { ObjectId } from "mongodb";
import * as validation from "../helpers.js";


router.get("/:tagId", async (req, res) => {

  try {
    //pre check
    let tagId = req.params.tagId;
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

export default router;