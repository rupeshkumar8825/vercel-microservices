// here we have to write the function to fetch the files or download the files from the bucket for this purpose 
import aws, { DirectConnect } from "aws-sdk";
import path from  "path";
import fs from "fs/promises";

// initializing the s3 object here for this puropse 
const s3 = new aws.S3({
    accessKeyId: "6ec32fa33747e375e05fc2a279d1ab72", 
    secretAccessKey: "d3eda2528c601ee9162badf4c9682d8f3adcfd9844bc4bf1dc0e5bdab4668715", 
    endpoint: "https://1ea20514e3014ab5d376bc593ece2c61.r2.cloudflarestorage.com"
});



async function isExists(path : string) {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
};
  


async function writeFile(filePath : string, data : string) {
try {
    const dirname = path.dirname(filePath);
    const exist = await isExists(dirname);
    if (!exist) {
    await fs.mkdir(dirname, {recursive: true});
    }
    
    await fs.writeFile(filePath, data, 'utf8');
} catch (err : any) {
    throw new Error(err);
}
}




export const downloadS3Files = async (filePath : string)  => {
    
    const params = {
        Bucket: "vercel-clone", 
        Prefix : filePath    
    }

    // here we have to return the promise so that the function can wait on this for this purpose 
    return new Promise ((resolve, reject) => {

        s3.listObjectsV2(params, (err, result) => {
            if(err)
            {
                console.log("some error happened \n", err);
            }
            else
            {
                
                const listOfFiles = result.Contents;
                let listSize = listOfFiles?.length;
                let count = 0;
                listOfFiles?.forEach((currFile) => {
                    // here we have to make the getobject function call for this purpose 
                    let getParams = {
                        Bucket : "vercel-clone", 
                        Key : currFile.Key as string
                    }
    
                    s3.getObject(getParams, async (err, data) => {
                        if(err)
                        {
                            console.log("error happened while getting the object from s3", err);
                            reject(err);
                        }
                        else
                        {
                            
                            // we have to store this in the file for this purpose 
                            const fullFilePath = path.join(__dirname, getParams.Key);
                            console.log("the file path that we have got is as follows \n", fullFilePath);
                            await writeFile(fullFilePath, data.Body?.toString() as string);
                            count++;
                            if(count == listSize)
                            {
                                console.log("resolving the download files function here\n\n\n\n\n\n\n");
                                resolve("")
                            }
    
                        }
                    })

                    // once this operation is over then we have to resolve the promise for this purpose 
                    // resolve("");
    
                })
            }
        });
    })

}