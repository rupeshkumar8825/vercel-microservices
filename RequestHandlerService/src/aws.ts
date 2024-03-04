import aws from "aws-sdk";

// initializing the s3 object here for this puropse 
const s3 = new aws.S3({
    accessKeyId: "6ec32fa33747e375e05fc2a279d1ab72", 
    secretAccessKey: "d3eda2528c601ee9162badf4c9682d8f3adcfd9844bc4bf1dc0e5bdab4668715", 
    endpoint: "https://1ea20514e3014ab5d376bc593ece2c61.r2.cloudflarestorage.com"
});



// now we have to define the function using which we will be able to fetch the files from the S3 bucket and we will be able to serve it here for this purpose 
const getFileFromServer = (filePath : string, deploymentId : string) => {
    // this will itself will send the response back and this function uses the async await for this purpose 
    return new Promise((resolve , reject) => {
        s3.getObject({
            Bucket : "vercel-clone", 
            Key : `build/${deploymentId}${filePath}`
        }, (err, response) => {
            if(err)
            {
                // console.log("some error happened while accessing the file from the S3 bucket", err);
                resolve(err);
            }
            else
            {
                // console.log("the response from the S3 bucket is as follows \n", response);
                resolve(response.Body)
            }
        });

    }) 
}


export default getFileFromServer;