// here we will write the code to get the list of all the files inside the directory for this purpose 
// this function should take the path of the folder whose file names needs to be added into the array 
// we need the array of files to be able to upload on to the S3 bucket for this purpose 
// here we may have to use the fs.readdir() for this purpose 
import fs from 'fs/promises';

export const getAllFiles = async (currRepoId : string) : Promise<string[]> => {
    const folderName = `./output/${currRepoId}`;
    console.log("inside the getall files function with currrepoid as  \n", currRepoId);
    const listOfFiles : string[] = await fs.readdir(folderName);
    console.log("returning from the function of getAllFiles.");
    // say everything went fine 
    return listOfFiles;
}
