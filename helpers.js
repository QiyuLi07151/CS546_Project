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