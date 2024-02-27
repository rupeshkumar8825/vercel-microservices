import {createClient} from "redis"
import { copyBuildFilesToS3, downloadS3Files } from "./aws";
import { buildProject } from "./build";


const subscriber = createClient();
subscriber.connect();

// here we have to implement this function whose main aim is to poll the queue 
async function main () 
{
    while(1)
    {
        // console.log("inside the while loop \n");
        // here we have to pop the element from the right for this puropse 
        const response = await subscriber.rPop("build-queue");
        if(response)
        {
            console.log("the response from the queue is as follows \n", response);
            // here we have to download the files from the cloudFlare bucket server for this purpose 
            await downloadS3Files(`output/${response}`);
            console.log("done downloading the files");
            console.log("================================Building the code files...==============================");
            // now we also have to build this project locally that is on the server 
            await buildProject(response);
            console.log("================================Finished building the code files...==============================");
            // here we have to upload the files to s3 again for this purpose 
            // here we have to write the same logic to upload the files to s3 for this purpose 
            await copyBuildFilesToS3(response);

            console.log("================================Finished uploading the build files to s3 =================================================================");
        }

    }
}

main();