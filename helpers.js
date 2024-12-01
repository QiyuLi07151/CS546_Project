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