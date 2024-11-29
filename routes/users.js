import { Router } from "express";
const router = Router();
import * as userData from "../data/users.js";
import { ObjectId } from "mongodb";
import * as validation from "../helpers.js";

router.get("/:userId", async (req, res) => {
  
  try {
    //pre check
    let userId = req.params.userId;
    validation.isProvided(userId);
    userId = validation.isValidString(userId);
    validation.isValidObjectId(userId);

    // get user 
    const user = await userData.getUserById(userId);

    // return
    return res.status(200).json(user);
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