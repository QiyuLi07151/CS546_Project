import { ObjectId } from "mongodb";

export const isProvided = (input) => {
    if(input) 
        return true;
    return false;
};

export const isValidString = (input) => {
    if(typeof input !== 'string' || input.trim().length === 0)
        return false;
    return true;
};

export const isValidObjectId = (input) => {
    if(!ObjectId.isValid(input))
        return false;
    return true;
};