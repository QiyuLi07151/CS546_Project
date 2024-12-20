import { Router } from "express";
const router = Router();
import * as itemData from "../data/items.js";
import * as userData from '../data/users.js'
import { ObjectId } from "mongodb";
import * as validation from "../helpers.js";
import xss from 'xss'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", async (req, res) => {
    try {
        let page = req.query.page ? req.query.page : "1";
        page = await validation.isPageValid(req.query.page);
        validation.isProvided(page);
        const itemList = await itemData.getAllItems(page);
        return res.status(200).json(itemList);
    } catch (error) {
        const errorMessage = error.message || error;
        if (errorMessage.includes("No items found matching the name")) {
            return res.status(404).json({ error: "No items found matching the name" });
        } else {
            return res.status(400).json({ error: errorMessage });
        }
    }
});

router.get("/itemId", async (req, res) => {
    let itemId = req.query.itemId;
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

router.patch("/addTagToItem", async (req, res) => {
    let tagName = req.body.tagName, itemId = req.body.itemId;
    try {
        validation.isProvided(tagName);
        validation.isProvided(itemId);
        itemId = validation.isValidString(itemId);
        tagName = validation.isValidString(tagName);
        validation.isValidObjectId(itemId);
    } catch (error) {
        return res.status(400).json({ error: error });
    }
    tagName = xss(tagName);
    try {
        await itemData.addTagToItem(tagName, itemId);
        return res.status(200).json();
    } catch (error) {
        return res.status(404).json({ error: error });
    }
});

//ownerId, itemName, itemDesc, itemTags, itemPrice, itemImg, itemStatus
router.post("/addItem", async (req, res) => {

    
    const data = req.body;
    let {
        ownerId,
        itemName,
        itemDesc,
        itemTags,
        itemPrice,
        itemImg,

        itemStatus
    } = data;
    /*if (!req.files || !req.files.itemImg) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }*/
    itemTags = itemTags.split(',').map(tag => xss(tag.trim().toLowerCase()));
    //let itemImgFile = req.files.itemImg;
    itemPrice = parseFloat(itemPrice);
    itemStatus = itemStatus === "true";
    //const uploadPath = path.join(__dirname, '../public/images', itemImgFile.name);
    //await itemImgFile.mv(uploadPath);
    itemDesc = xss(itemDesc);
    //const itemImg = '/public/images/' + itemImgFile.name;
    const newData = {ownerId, itemName, itemDesc, itemTags, itemPrice, itemImg, itemStatus};
    if (!newData || Object.keys(newData).length === 0)
        return res.status(400).json({ error: 'There are no fields in the request body.' });
    try {
        validation.isValidAddItemFuncData(newData);
    } catch (error) {
        return res.status(400).json({ error: error });
    }

    // let user = req.session.user;
    try {
        validation.isProvided(ownerId);
        validation.isProvided(itemName);
        validation.isProvided(itemDesc);
        if (itemDesc.length > 50) {
            throw "Item description should be less than 50 characters.";
        }
        validation.isProvided(itemTags);
        validation.isProvided(itemPrice);
        validation.isProvided(itemImg);
        validation.isProvided(itemStatus);
    } catch (error) {
        return res.status(400).json({ error: error });
    }
    itemName = xss(itemName);
    itemDesc = xss(itemDesc);
    for (let itemTag of itemTags) {
        itemTag = xss(itemTag);
    }
    // itemImg = xss(itemImg);
    try {
        await itemData.addItem(
            ownerId,
            itemName,
            itemDesc,
            itemTags,
            itemPrice,
            itemImg,
            itemStatus);
        return res.json();
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router.patch("/modifyReviewAndRating", async (req, res) => {
    const data = req.body;
    let {
        userId,
        itemId,
        review,
        rating
    } = data;
    try {
        validation.isProvided(userId);
        validation.isProvided(itemId);
        validation.isProvided(rating);
        userId = validation.isValidString(userId);
        itemId = validation.isValidString(itemId);
        rating = validation.isValidString(rating);
        validation.isValidObjectId(userId);
        validation.isValidObjectId(itemId);
        validation.isValidNumber(parseInt(rating));
        if (parseInt(rating) > 5)
            throw "Rating could more than 5.";
    } catch (error) {
        return res.status(400).json({ error: error });
    }
    review = xss(review);
    try {
        const item = await itemData.isPresentRatingAndReview(userId, itemId);
        if (!item) return res.status(404).json({ error: "not found" });
        await itemData.deleteRatingAndReview(userId, itemId);
        const updateItem = await itemData.addRatingAndReview(userId, itemId, parseInt(rating), review);
        return res.status(200).json(updateItem);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router.delete("/deleteReviewAndRating", async (req, res) => {
    const data = req.body;
    let {
        userId,
        itemId
    } = data;
    try {
        validation.isProvided(userId);
        validation.isProvided(itemId);
        userId = validation.isValidString(userId);
        itemId = validation.isValidString(itemId);
        validation.isValidObjectId(userId);
        validation.isValidObjectId(itemId);
    } catch (error) {
        return res.status(400).json({ error: error });
    }
    try {
        const item = await itemData.deleteRatingAndReview(userId, itemId);
        if (!item) return res.status(404).json({ error: "not Found" });
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router.patch("/addReviewAndRating", async (req, res) => {
    const data = req.body;
    let {
        userId,
        itemId,
        review,
        rating
    } = data;
    try {
        validation.isProvided(userId);
        validation.isProvided(itemId);
        validation.isProvided(rating);
        userId = validation.isValidString(userId);
        itemId = validation.isValidString(itemId);
        rating = validation.isValidString(rating);
        validation.isValidObjectId(userId);
        validation.isValidObjectId(itemId);
        validation.isValidNumber(parseInt(rating));
        if (parseInt(rating) > 5)
            throw "Rating could more than 5.";
    } catch (error) {
        return res.status(400).json({ error: error });
    }
    review = xss(review);
    try {
        const item = await itemData.addRatingAndReview(userId, itemId, parseInt(rating), review);
        if (!item) return res.status(400).json({ error: "You have left a review, do you want to modify it?" });
        return res.json(item);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

/* XIAO
Completed
/item/tag/ : id
Method : get
@param Id(String)
@return Array[ Object{} ]
*/
// router.get("/tag/tagId", async (req, res) => {
//     try {
//         // pre check
//         let tagId = req.query.tagId;
//         validation.isProvided(tagId);
//         tagId = validation.isValidString(tagId);
//         validation.isValidObjectId(tagId);

//         // get items by tagId
//         const items = await itemData.getAllItemsByTag(tagId);

//         // return
//         return res.status(200).json(items);
//     } catch (error) {
//         const errorMessage = error.message || error;

//         if (errorMessage.includes("No tag found with the given tag")) {
//             return res.status(404).json({ error: "No tag found with the given tag" });
//         } else {
//             return res.status(400).json({ error: errorMessage });
//         }
//     }
// });


/* XIAO
Completed
/item/user/:userId
Method : get
@param Id(String)
@return Array[ Object{} ]
*/
router.get("/user", async (req, res) => {
    try {
        // pre check
        let userId = req.query.userId;
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

/*
XIAO
In progress
/item/:name
@param name(String)
@return Array[ Object{} ]
*/
router.post("/name", async (req, res) => {
    try {
        // pre check
        let itemName = req.body.name;
        validation.isProvided(itemName);
        itemName = validation.isValidString(itemName);
        itemName = xss(itemName);
        // get item by itemName

        // const items = await itemData.getItemByName(itemName);

        const page = parseInt(req.query.page) || 1;
        const limit = 5;

        const result = await itemData.searchItemsByName(itemName, page, limit);

        return res.status(200).json(result);
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