import express, { Request, Response } from 'express';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());


app.post("/deploy", (req : Request, res : Response ) => {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    // now here we have to write the lo1gic for cloning this repo for this purpose 
    // we will use the simple git for this purpose 

    res.json({repoUrl});

})

app.listen(3000, () => {
    console.log('listening on port 3000');
})