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


export const downloadS3Files = async (filePath : string) => {
    console.log("the file path is as follows \n", filePath);
    
    
    const params = {
        Bucket: "vercel-clone", 
        Prefix : filePath    
    }

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
    

    s3.listObjectsV2(params, (err, result) => {
        if(err)
        {
            console.log("some error happened \n", err);
        }
        else
        {
            // console.log("the response of the listObjectsv2 is as follows \n", result);
            // now we have to write the logic to download this files 
            // we have to download the files inside the dist may be for this purpose 
            // we will be using the getObject function inside the S3 to fetch the files for this purpose 
            // using the for loop here for this purpoose 
            const listOfFiles = result.Contents;

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
                    }
                    else
                    {
                        // console.log("successfully fetched the object from s3", data);
                        // we have to store this in the file for this purpose 
                        const fullFilePath = path.join(__dirname, getParams.Key);
                        console.log("the file path that we have got is as follows \n", fullFilePath);
                        await writeFile(fullFilePath, data.Body?.toString() as string);
                        // fs.writeFileSync(fullFilePath, data.Body?.toString() as string);

                    }
                })

            })
        }
    });



    s3.getObject()

}