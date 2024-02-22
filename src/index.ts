import express, { Request, Response } from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { generateId } from './utils';


const app = express();
app.use(cors());
app.use(express.json());


app.post("/deploy", (req : Request, res : Response ) => {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    // now here we have to write the lo1gic for cloning this repo for this purpose 
    // we will use the simple git for this purpose 
    // now we have to clone the repo here using the simple git for this purpose 
    // below handles the promise that is being returned by this function and hence we have to write the callback functions  or we can just did await and async for this purpose 
    // fetching the id for this repo 
    const currRepoId = generateId();
    console.log("the unique id for this project is as follwos \n", currRepoId);
    simpleGit().clone(repoUrl, `./output/${currRepoId}`).then(() => {
        console.log("successfully cloned the repo for this purpose \n");
    }).catch(err => {
        console.log("some error happened while cloning the repo for this purpose: ", err);
    });

    res.json({repoUrl});

})

app.listen(3000, () => {
    console.log('listening on port 3000');
})