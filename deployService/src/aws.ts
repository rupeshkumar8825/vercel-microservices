// here we have to write the function to fetch the files or download the files from the bucket for this purpose 
import aws from "aws-sdk";


// initializing the s3 object here for this puropse 
const s3 = new aws.S3({
    accessKeyId: "6ec32fa33747e375e05fc2a279d1ab72", 
    secretAccessKey: "d3eda2528c601ee9162badf4c9682d8f3adcfd9844bc4bf1dc0e5bdab4668715", 
    endpoint: "https://1ea20514e3014ab5d376bc593ece2c61.r2.cloudflarestorage.com"
});


export const downloadS3Files = async (filePath : string) => {
    console.log("the file path is as follows \n", filePath);
    
    
    const params = {
        Bucket: "vercel-clone", 
        Prefix : filePath    
    }
    

    s3.listObjectsV2(params, (err, result) => {
        if(err)
        {
            console.log("some error happened \n", err);
        }
        else
        {
            console.log("the response of the listObjectsv2 is as follows \n", result);
        }
    })
}