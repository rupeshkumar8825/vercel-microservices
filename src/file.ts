// here we will write the code to get the list of all the files inside the directory for this purpose 
// this function should take the path of the folder whose file names needs to be added into the array 
// we need the array of files to be able to upload on to the S3 bucket for this purpose 
// here we may have to use the fs.readdir() for this purpose 
import fs from 'fs';

export const getAllFiles = (currRepoId : string) : string[] => {
    const folderName = `./output/${currRepoId}`;
    
    // using the fs module for this puropse 
    let listOfFiles : string[] = [];

    // here we have to pass the callback function for this purpose since this asynchronous function 
    fs.readdir(folderName, (err, files) => {
        // using the for loop to iterate over each of the files in the folder for this purpose 
        files.forEach((currFile : string) => {
            listOfFiles.push(currFile);
            console.log(currFile);
        });
    })

    // say everything went fine 
    return listOfFiles;
}
