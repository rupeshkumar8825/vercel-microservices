import express, { Request, Response } from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { generateId } from './utils';
import { getAllFiles } from './file';
import path from "path";
import { uploadFile } from './aws';

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
    listOfFiles.forEach((currFile: string) => {
        uploadFile(currFile.slice(__dirname.length + 1), currFile);
    })
    

    res.json({id : currRepoId});

})



app.listen(3000, () => {
    console.log('listening on port 3000');
})