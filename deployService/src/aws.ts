// here we have to write the function to fetch the files or download the files from the bucket for this purpose 
import aws, { DirectConnect } from "aws-sdk";
import path from  "path";
import fs from "fs/promises";
import fs2 from "fs";
import { String } from 'aws-sdk/clients/apigateway';


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
            }
            else{
                console.log(`File uploaded successfully ${data.Location}`);
                resolve("");
            }
        });

    })
}




// defining the upload function here for this purpose 
export const uploadFile = async (fileName : string, localFilePath : string) => {
    console.log("filename is : ", fileName, "   localFilePath is : ", localFilePath);
    return new Promise((resolve, reject) => {
        fs2.readFile(localFilePath,async (err, result) => {
            if(err)
            {
                console.log("filename is : ", fileName, "   localFilePath is : ", localFilePath);
                console.log('some error happened while reaading the file asynchronously', err);
                resolve("");
            }
            else
            {
                await uploadOnS3(result, fileName);
                resolve("");
            }
        });

    })
    

    // say everything went fine 
    return;



}



export const getAllFiles = async (filePath : string) : Promise<string[]> => {
    const listOfFiles : string[] = await fs.readdir(filePath, {recursive: true});

 
    let listOfFilesAbsolutePath : string[] = [];
    listOfFilesAbsolutePath = listOfFiles.map((currFile : string) => {
        return path.join(filePath, currFile);
    })


    // say everything went fine 
    return listOfFilesAbsolutePath;
}


// the following function to take out the files from the build folder and then it will upload on the S3 for this purpose 
export const copyBuildFilesToS3 = async (currRepoId : string) =>{
    // here we have to copy the files for this purpose
    return new Promise(async (resolve, reject) => {
        let count : number = 0;
        let filePath : string = path.join(__dirname, `output/${currRepoId}/build`);
        const listOfFiles = await getAllFiles(filePath);
        console.log(listOfFiles.length);
        listOfFiles.forEach(async (currFile: string) => {
            // /home/rupesh/Desktop/project/vercel/deployService/src/output/a21c987615ffa13f61ce/build
            await uploadFile(`build/${currRepoId}/` + currFile.slice(__dirname.length + 35), currFile);
            count++;
            console.log("count: " + count + "\n\n\n\n\n\n\n\n\n\n\n\n\n");
            if(count  == listOfFiles.length)
            {
                console.log("resolving the copubuild here ================================================================================================================================================================================= ")
                resolve("");
            }
        })

    }) 
}