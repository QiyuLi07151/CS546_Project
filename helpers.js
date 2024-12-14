import { ObjectId } from "mongodb";
import { getTotalDataNumber } from "./data/items.js";
import { getTotalDataNumberForTagName } from "./data/tags.js";

export const isProvided = (input) => {
    if(!input) 
        throw "Input is not provided.";
    return true;
};

export const isValidString = (input) => {
    if(typeof input !== 'string' || input.trim().length === 0)
        throw "Input is not a valid string.";
    
    return input.trim();
};

function isIntegerString(str) {
    return /^-?\d+$/.test(str);
}

export const isValidObjectId = (input) => {
    if(!ObjectId.isValid(input))
        throw "Input is not a valid ObjectId.";
};

export const isValidNumber = (input) => {
    if(typeof input !== 'number' || isNaN(input))
        throw "Input is not a valid number.";
};

export const isValidArray = (input) => {
    if(typeof input !== 'object' || !Array.isArray(input) || input.length === 0){
        throw "Input is not a valid Array.";
    }
};

export const isValidBoolean = (input) => {
    if(typeof input !== 'boolean')
        throw "Input is not a valid Boolean.";
};

export const isValidAddItemFuncData = (data) => {
    try {
        for(let key in data){
            isProvided(data[key]);
            if(key === 'ownerId'|| key === 'itemName' || key === 'itemDesc' || key === 'itemImg'){
                data[key] = isValidString(data[key]);
            }
            // if(key === 'ownerId')
            //     isValidObjectId(data[key]);
            if(key === 'itemTags'){
                isValidArray(data[key]);
                for(let i=0;i<data[key].length;i++){
                    const value = data[key][i];
                    data[key][i] = isValidString(value).toLowerCase();
                }
            }
            if(key === 'itemPrice')
                isValidNumber(data[key]);
            if(key === 'itemStatus')
                isValidBoolean(data[key]);
        }
    } catch (error) {
        throw error;
    }
};

// prevent page > totalPage, and prevent page < 1;
export const isPageValid = async (page) => {
    if(!page || !isIntegerString(page.trim()) || parseInt(page.trim()) < 1){
        return 1;
    }
    page = parseInt(page.trim());
    const total = await getTotalDataNumber();
    const totalPage = Math.ceil(total / 5);
    if(totalPage === 0){
        return 1;
    }
    if(page > totalPage){
        return totalPage;
    }
    return page;
};

export const isPageValidForTagName = async (tagName, page) => {
    if(!page || !isIntegerString(page.trim()) || parseInt(page.trim()) < 1){
        return 1;
    }
    page = parseInt(page.trim());
    const total = await getTotalDataNumberForTagName(tagName);
    const totalPage = Math.ceil(total / 5);
    if(totalPage === 0){
        return 1;
    }
    if(page > totalPage){
        return totalPage;
    }
    return page;
};