import  fs from 'fs';
// here we will write the functions related to the AWS tasks for this puropse like the uploading the file on to the server 
import aws from 'aws-sdk';
import { String } from 'aws-sdk/clients/apigateway';


// initializing the s3 object here for this puropse 
const s3 = new aws.S3({
    accessKeyId: "6ec32fa33747e375e05fc2a279d1ab72", 
    secretAccessKey: "d3eda2528c601ee9162badf4c9682d8f3adcfd9844bc4bf1dc0e5bdab4668715", 
    endpoint: "https://1ea20514e3014ab5d376bc593ece2c61.r2.cloudflarestorage.com"
});


const uploadOnS3 = (result : Buffer, fileName : String) => {
    return new Promise((resolve, reject) => {
        s3.upload({
            Body : result, 
            Bucket : "vercel-clone", 
            Key : fileName
        }, (error, data) => {
            if(error)
            {
                console.log("some error happened which is \n", error);
                resolve(error);
            }
            else{
                console.log(`File uploaded successfully ${data.Location}`);
                resolve(data.Location);
            }
        });

    })
}



// defining the upload function here for this purpose 
export const uploadFile = async (fileName : string, localFilePath : string) => {
    // console.log("filename is : ", fileName, "   localFilePath is : ", localFilePath);
    return new Promise((resolve, reject) => {
        fs.readFile(localFilePath,async (err, result) => {
            if(err)
            {
                console.log("filename is : ", fileName, "   localFilePath is : ", localFilePath);
                console.log('some error happened while reaading the file asynchronously', err);
                resolve(err);
            }
            else
            {
                await uploadOnS3(result, fileName)
                resolve(result)
            }
        });
        

    })

    // say everything went fine 
    return;



}