import {createClient} from "redis"

// we have to make this service as subscriber for this purpose 
// this service main task will be to keep checking whether there is something in the queue or no t
// if something is there  then this service will fetch the value and then it will start the deployment process for this purpose 
const subscriber = createClient();
subscriber.connect();

// here we have to implement this function whose main aim is to poll the queue 
async function main () 
{
    let count = 10;
    while(1)
    {
        // console.log("inside the while loop \n");
        // here we have to pop the element from the right for this puropse 
        const response = await subscriber.rPop("build-queue");
        if(response)
        {
            console.log("the response from the queue is as follows \n", response);
        }

    }
}

main();