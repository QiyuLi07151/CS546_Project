import { ads } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const adsCollection = await ads();

export const getAd = async (adNum) => {
    const limit = adNum > 0 ? adNum : 3;
    let adList = await adsCollection
        .find({})
        .sort({ _id: -1 })
        .limit(limit)
        .toArray();
    adList = adList.map((ad) => {
        ad._id = ad._id.toString();
        return ad;
    });
    return adList;
};

export const getAdById = async (adId) => {
    let ad = await adsCollection
        .findOne({_id: new ObjectId(adId)})
    if(!ad) throw new Error("Advertisement not found.")
    return ad;
};

export const addAd = async (Image, ItemName, Title, Description) => {
    if (!Image || !ItemName || !Title || !Description) {
        return res.status(400).json({ error: "All fields are required." });
    }
    const newAd = await adsCollection.insertOne({
        Image,
        ItemName,
        Title,
        Description
    });
    if (!newAd.acknowledged || !newAd.insertedId) {
        throw 'Could not add advertisement';
    }
    return await getAdById(newAd.insertedId.toString());
};