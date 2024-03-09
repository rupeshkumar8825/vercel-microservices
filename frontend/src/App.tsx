/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/t2FzPqLEgx2
 */
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { ChangeEvent, useState } from "react"
import axios from "axios"
import { Label } from "./components/ui/label"

const BACKEND_UPLOAD_URL = "http://localhost:4000";

export function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);


  const onDeployClickHandler = async () => {
    console.log("the user has clicked the deploy button and hence we have to fetch the link of the url for this purpose \n");
    console.log("the repoURL that we have is as follows \n", repoUrl);

    // make the axios backend request to deploy the project for this purpose 
    const response = await axios.post(`${BACKEND_UPLOAD_URL}/deploy`, {repoUrl: repoUrl});
    console.log("the response from the server is as follows \n");
    console.log("the URL id is as follows \n", response.data.id);
    setUploadId(response.data.id);


    // start the interval here for this purpose to keep polling the values to the end of 
    const interval = setInterval(async () => {
      // here we have to keep on hitting the backend service to check whether the project is deployed or not for this purpose 
      const deploymentResponse = await axios.get(`${BACKEND_UPLOAD_URL}/status?id=${response.data.id}`)
      // checking if the project is deployed successfully or not for this purpose 
      if(deploymentResponse.data.status === 'deployed')
      {
        // then we have to clear this interval and make the deployed status complete 
        clearInterval(interval);
        setDeployed(true);
      }
    }, 3000);
    
  }



  const onChangeRepoUrlHandler = (event : ChangeEvent<HTMLInputElement>) => {
    console.log("the user has changed the value of the repoUrl hence we have to update this for this purpose \n");
    const targetValue = event.target.value;
    setRepoUrl(targetValue);
    
  }


  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Deploy your GitHub Repository</CardTitle>
          <CardDescription>Enter the URL of your GitHub repository to deploy it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <Input 
                onChange={onChangeRepoUrlHandler}
                placeholder="https://github.com/username/repo" 
              />
            </div>
            <Button onClick={onDeployClickHandler} disabled={uploadId !== "" || uploading} className="w-full" type="submit">
              {uploadId ? `Deploying (${uploadId})` : uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {deployed && <Card className="w-full max-w-md mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Deployment Status</CardTitle>
          <CardDescription>Your website is successfully deployed!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="deployed-url">Deployed URL</Label>
            <Input id="deployed-url" readOnly type="url" value={`http://${uploadId}.vercel.com:3001/index.html`} />
          </div>
          <br />
          <Button className="w-full" variant="outline">
            <a href={`http://${uploadId}.vercel.com/index.html`} target="_blank">
              Visit Website
            </a>
          </Button>
        </CardContent>
      </Card>}
    </main>
  )
}