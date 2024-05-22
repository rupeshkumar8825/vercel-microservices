import express, { Request, Response, request } from "express";
import getFileFromServer from "./aws";

const app = express();



app.get("/*", async (req : Request,res : Response) => {
    const url = req.hostname;
    console.log("host is \n", url);

    const id = url.split(".")[0];

    console.log("the value of id is as follows \n", id);
    
    let requestedPath = req.path;
    console.log("the requested path is as follows \n", requestedPath);
    if(req.path !== "/index.html")
    {
        let currPath = req.path;
        console.log("the current reqwuest path is as follows \n", currPath);
        let arrayString = currPath.split("/")[1];
        // le
        console.log("the length is as follows\n\n", arrayString);
        // now we have to take the substring for this purpose 
        requestedPath = requestedPath.substring(arrayString.length + 1, requestedPath.length);
        console.log("the updated requested path is as follows \n", requestedPath);

    }
    console.log("the request path is as follows \n", requestedPath);

    // now we have to write the logic in order to fetch the file from the S3 to local and then serve this file for this purpose 
    const response = await getFileFromServer(requestedPath, id);
    
    // setting the content type for this 
    const type = requestedPath.endsWith("html") ? "text/html" : requestedPath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type", type);

    // console.log("the response from the server is as follows \n", response);
    // console.log("sending the json response to the frontend for this purpose \n");
    res.send(response);

})




app.listen(3001, () => {
    console.log(`server is running on port 3001 `);
});