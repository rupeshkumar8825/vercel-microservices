import express, { Request, Response } from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { generateId } from './utils';
import { getAllFiles } from './file';


const app = express();
app.use(cors());
app.use(express.json());



app.post("/deploy", async (req : Request, res : Response ) => {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const currRepoId = generateId();
    console.log("the unique id for this project is as follwos \n", currRepoId);
    await simpleGit().clone(repoUrl, `./output/${currRepoId}`);

    let listOfFiles : string[] = [];
    console.log("the repoid that i am sending is as follows \n", currRepoId);
    listOfFiles = await getAllFiles(currRepoId);
    console.log("printing the list of files inside the api call for this purpose\n");
    console.log(listOfFiles);

    // doing some thing here for this puropse 
    // here we have to store the files into the AWS s3 for this purpose
    // we may have to take the AWS subscription for this purpose 
    // we will implement that partciular feature after this .``
    // lets try and fix the nodemon issue currently for this purpose
    console.log("this console log just after the nodemon changes for testing purpose \n");
    // now here we have to fetch the list of files that needs to be put on the S3 for this purpose 
    res.json({id : currRepoId});

})

app.listen(3000, () => {
    console.log('listening on port 3000');
})