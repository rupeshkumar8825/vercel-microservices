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
    const currRepoId = generateId();
    console.log("the unique id for this project is as follwos \n", currRepoId);
    simpleGit().clone(repoUrl, `./output/${currRepoId}`).then(() => {
        console.log("successfully cloned the repo for this purpose \n");
    }).catch(err => {
        console.log("some error happened while cloning the repo for this purpose: ", err);
    });


    // now here we have to fetch the list of files that needs to be put on the S3 for this purpose 
    res.json({id : currRepoId});

})

app.listen(3000, () => {
    console.log('listening on port 3000');
})