import { ObjectId } from "mongodb";

export const isProvided = (input) => {
    if(!input) 
        throw "Input is not provided.";
};

export const isValidString = (input) => {
    if(typeof input !== 'string' || input.trim().length === 0)
        throw "Input is not a valid string.";
    
    return input.trim();
};

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
            if(key === 'ownerId')
                isValidObjectId(data[key]);
            if(key === 'itemTags'){
                isValidArray(data[key]);
                for(let i=0;i<data[key].length;i++){
                    data[key][i] = data[key][i].toLowerCase();
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