import { Router } from "express";
const router = Router();
import * as itemData from "../data/items.js";
import * as userData from '../data/users.js'
import { ObjectId } from "mongodb";
import * as validation from "../helpers.js";

router.get("/", async (req, res) => {
    try {
        let page = req.query.page? req.query.page: "1";
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
        return res.status(400).json({error: error});
    }
    try {
        await itemData.addTagToItem(tagName, itemId);
        return res.status(200).json();
    } catch (error) {
        return res.status(404).json({error: error});
    }
});

//ownerId, itemName, itemDesc, itemTags, itemPrice, itemImg, itemStatus
router.post("/addItem", async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0)
        return res.status(400).json({ error: 'There are no fields in the request body.' });
    try {
        validation.isValidAddItemFuncData(data);
    } catch (error) {
        return res.status(400).json({ error: error });
    }
    let {
        ownerId,
        itemName,
        itemDesc,
        itemTags,
        itemPrice,
        itemImg,
        itemStatus
    } = data;
    try {
        validation.isProvided(ownerId);
        validation.isProvided(itemName);
        validation.isProvided(itemDesc);
        if(itemDesc.length > 150){
            throw "Item description should be less than 150 characters.";
        }
        validation.isProvided(itemTags);
        validation.isProvided(itemPrice);
        validation.isProvided(itemImg);
        validation.isProvided(itemStatus);
    } catch (error) {
        return res.status(400).json({ error: error });
    }
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

router.patch("/addComment", async (req, res) => {
    const data = req.body;
    let {
        itemId,
        comment
    } = data;
    try {
        validation.isProvided(itemId);
        validation.isProvided(comment);
        itemId = validation.isValidString(itemId);
        comment = validation.isValidString(comment);
        validation.isValidObjectId(itemId);
    } catch (error) {
        return res.status(400).json({error: error});
    }
    try {
        const updateInfo = await itemData.addComment(itemId, comment);
        if(!updateInfo) return res.status(404).json({error: "not Found"});
        return res.status(200).json(updateInfo);
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error"});
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
        if(parseInt(rating) > 5)
            throw "Rating could more than 5.";
    } catch (error) {
        return res.status(400).json({ error: error });
    }
    try {
        const item = await itemData.isPresentRatingAndReview(userId, itemId);
        if(!item) return res.status(404).json({error: "not found"});
        await itemData.deleteRatingAndReview(userId, itemId);
        const updateItem = await itemData.addRatingAndReview(userId, itemId, parseInt(rating), review);
        return res.status(200).json(updateItem);
    } catch (error) {
        return res.status(500).json({error: error});
    }
});

router.patch("/deleteReviewAndRating", async (req, res) => {
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
        return res.status(400).json({error: error});
    }
    try {
        const item = await itemData.deleteRatingAndReview(userId, itemId);
        if(!item) return res.status(404).json({error: "not Found"});
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({error: error});
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
        if(parseInt(rating) > 5)
            throw "Rating could more than 5.";
    } catch (error) {
        return res.status(400).json({ error: error });
    }
    try {
        const item = await itemData.addRatingAndReview(userId, itemId, parseInt(rating), review);
        if(!item) return res.status(400).json({error: "You have left a review, do you want to modify it?"});
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
        let itemName = req.query.name;
        validation.isProvided(itemName);
        itemName = validation.isValidString(itemName);

        // get item by itemName
        const items = await userData.getItemByName(itemName);



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