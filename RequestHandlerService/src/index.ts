// here we have to write the main logic for the request handler for this purpose 


console.log("this is index.ts for request handler for this purpose \n");
import express, { Request, Response } from "express";
import getFileFromServer from "./aws";

const app = express();



app.get("/*", async (req : Request,res : Response) => {
    console.log("this endpoint was hit for this purpose \n");
    // now fetching the value of the hostname 
    const url = req.hostname;
    console.log("host is \n", url);

    const id = url.split(".")[0];

    console.log("the value of id is as follows \n", id);
    
    const requestedPath = req.path;
    console.log("the request path is as follows \n", requestedPath);

    // now we have to write the logic in order to fetch the file from the S3 to local and then serve this file for this purpose 
    const response = await getFileFromServer(requestedPath, id);

    console.log("the response from the server is as follows \n", response);
    console.log("sending the json response to the frontend for this purpose \n");
    res.json({response});

})




app.listen(3001, () => {
    console.log(`server is running on port 3001 `);
});