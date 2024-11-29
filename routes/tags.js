import { Router } from "express";
const router = Router();
import * as tagData from "../data/tags.js";
import { ObjectId } from "mongodb";
import * as validation from "../helpers.js";

router.get("/:tagId", async (req, res) => {
    let tagId = req.params.tagId;
    try {
        validation.isProvided(tagId);
        tagId = validation.isValidString(tagId);
        validation.isValidObjectId(tagId);
        
        // console.log(tagId);
        
        const tag = await tagData.getTagById(tagId);
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