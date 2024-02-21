// here we will write the logic to generate the new Ids for the deployments that we will have for this puropse 
import crypto from "crypto";

const MAX_LENGTH = 10;

// using the generate function here for this purpose 
export const generateId = () => {
    const id = crypto.randomBytes(MAX_LENGTH).toString("hex");
    return id;
}