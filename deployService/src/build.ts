// here this consists the code to build the code that we have locally downloaded 
// for this we have to write the function to build the project and then whatever codes comes inside the dist 
// we have to store it on the server to be able to serve these files for this purpose
import {exec, spawn}  from 'child_process';
import path from 'path';

export const buildProject = (currRepoId : string) => {
    return new Promise ((resolve) => {
        const filePath = path.join(__dirname, `output/${currRepoId}`);
        console.log("the file path is   " + filePath);
        const child = exec(`cd ${path.join(__dirname, `output/${currRepoId}`)}  && npm install && npm run build`);
        child.stdout?.on('data', (data) => {
            console.log(`stdOut: ` + data);
        })
    
        child.stderr?.on('data', (data) => {
            console.log(`stderr`, data);
        })  
    
        child.on('exit', () => {
            console.log("resolving the child process................................................................");
            resolve("");
        })

    })
}

