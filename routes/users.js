import { Router } from "express";
const router = Router();
import bcrypt from 'bcryptjs'
import session from 'express-session'
import * as userData from "../data/users.js";
import * as itemData from "../data/items.js"
import { ObjectId } from "mongodb";
import * as validation from "../helpers.js";

/*
XIAO
Completed
/user/ : id
Method : get
@param Id(String)
@return JSON Object{}
*/
router.get("/userId", async (req, res) => {

  try {
    //pre check
    let userId = req.query.userId;
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

router.post('/login', async (req, res) => {
  const { Name, Password } = req.body;
  try {
    const user = await userData.getUserByName(Name);

    if (!user) {
      throw 'Invalid username or password';
    }

    const isValidPassword = await bcrypt.compare(Password, user.Password);

    if (!isValidPassword) {
      throw 'Invalid username or password';
    }

    req.session.user = user
    res.status(200).json({ message: 'Login Successful' });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post('/register', async (req, res) => {
  const { Name, Password, IsOwner } = req.body;

  try {
    const user = await userData.getUserByName(Name);

    if (user) {
      throw 'User already exists';
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await userData.addUser(Name, hashedPassword, IsOwner);

    res.status(200).json({ message: 'User Registration Successful' });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post("/updateFavoriteItem", async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    validation.isProvided(userId);
    validation.isProvided(itemId);
    userId = validation.isValidString(userId);
    validation.isValidObjectId(userId);
    itemId = validation.isValidString(itemId);
    validation.isValidObjectId(itemId);
    const result = await userData.updateFavoriteItem(userId, itemId);
    if(!result) return res.status(404).json({error: "Either userId or itemId not found."});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

router.get("/userId/wishlist", async (req, res) => {
  try {
    let userId = req.query.userId;
    validation.isProvided(userId);
    userId = validation.isValidString(userId);
    validation.isValidObjectId(userId);
 
    const user = await userData.getUserById(userId);

    const wishlistItems = [];
    for (const itemId of user.Wishlist) {
        const item = await itemData.getItemById(itemId);
        if (item) {
            wishlistItems.push(item);
        }
    }

    res.json(wishlistItems);

  } catch (e) {
    res.status(400).json({ error: e });
  }
});

export default router;