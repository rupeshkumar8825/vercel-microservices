import fs from 'fs/promises';
import path from 'path';


export const getAllFiles = async (filePath : string) : Promise<string[]> => {
    const listOfFiles : string[] = await fs.readdir(filePath, {recursive: true});

 
    let listOfFilesAbsolutePath : string[] = [];
    listOfFilesAbsolutePath = listOfFiles.map((currFile : string) => {
        return path.join(filePath, currFile);
    })


    // say everything went fine 
    return listOfFilesAbsolutePath;
}
