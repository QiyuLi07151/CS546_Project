import { ads } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import res from "express/lib/response.js";

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
        throw ('error: All fields are required.');
    }
    const newItemId = new ObjectId();
    const newAd = {
        _id: newItemId,
        Image: Image,
        ItemName: ItemName,
        Title: Title,
        Description: Description,
    };
    const response = await adsCollection.insertOne(newAd);
    if (!response.acknowledged || !response.insertedId) {
        throw 'Could not add advertisement';
    }
    return await getAdById(newAd.insertedId.toString());
};