// here we will write the code to get the list of all the files inside the directory for this purpose 
// this function should take the path of the folder whose file names needs to be added into the array 
// we need the array of files to be able to upload on to the S3 bucket for this purpose 
// here we may have to use the fs.readdir() for this purpose 
import fs from 'fs/promises';
import path from 'path';

export const getAllFiles = async (currRepoId : string, filePath : string) : Promise<string[]> => {
    const listOfFiles : string[] = await fs.readdir(filePath, {recursive: true});

 
    let listOfFilesAbsolutePath : string[] = [];
    listOfFilesAbsolutePath = listOfFiles.map((currFile : string) => {
        return path.join(filePath, currFile);
    })

    
    // say everything went fine 
    return listOfFilesAbsolutePath;
}
