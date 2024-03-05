import express, { Request, Response } from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { generateId } from './utils';
import { getAllFiles } from './file';
import path from "path";
import { uploadFile } from './aws';
import { createClient } from 'redis';

// here we have to initialize this as the publisher client 
// this will be acting as the publisher client as this service or microservice work is to just upload the files and then publish the id of teh current github project on the queue for this purpose 
const publisherService = createClient();
publisherService.connect();


const subscriber = createClient();
subscriber.connect();


const app = express();
app.use(cors());
app.use(express.json());



app.post("/deploy", async (req : Request, res : Response) => {
    const repoUrl = req.body.repoUrl;

    let currRepoId = generateId();

    let filePath : string = path.join(__dirname, `output/${currRepoId}`);

    await simpleGit().clone(repoUrl, filePath);


    const listOfFiles = await getAllFiles(filePath);
    console.log(listOfFiles.length);
    // for(let currFile in listOfFiles)
    // {
    //     await uploadFile(currFile.slice(__dirname.length + 1), currFile);
    // }
    await Promise.all(listOfFiles.map(async (currFile, index) => {
        const contents = await uploadFile(currFile.slice(__dirname.length + 1), currFile);
        console.log("this is the result for the content and index as \n\n\n\n", contents, index)
    }));
    // listOfFiles.forEach(async (currFile: string) => {
    //     await uploadFile(currFile.slice(__dirname.length + 1), currFile);
    // })
    

    // now here we have to put the id of this github into the redis queue for this purpose 
    publisherService.lPush("build-queue", currRepoId);

    // setting the status of this particular deployment as "UPLOADED" as this is not yet deployed hence we will store this information inside the REDIS itself 
    // do note that we can also use the redis as the database but it is not recommended for this purpose 
    publisherService.hSet("status", currRepoId, "uploaded");
    console.log("successfully pushed the current id on to the redis server for this purpose\n");

    res.json({id : currRepoId});

});



// endpoint  to check the status of the current deployment for this purpose 
app.get("/status", async (req : Request, res : Response) => {
    const id = req.query.id;

    const statusResponse = await subscriber.hGet("status", id as string);
    res.json({
        status : statusResponse
    });
})



app.listen(3000, () => {
    console.log('listening on port 3000');
})