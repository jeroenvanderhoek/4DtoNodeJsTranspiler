// 4D command: WEB START SERVER
import On_Web_Connection_database_method from '../Sources/DatabaseMethods/onWebConnection.js';

import express from 'express';
import path from 'path';
import { globSync } from 'glob';
import fs from 'fs';

export default function WEB_START_SERVER (processState) {
    
    const app = express();
    const port = 80;

    // Find absolute path of the WebFolder
    const pattern = "**/WebFolder/index.html"; // Adjust the pattern to match your needs  
    // Use glob.sync to get an array of matched file paths  
    const file = globSync(pattern)[0];  
    // Convert the file paths to absolute paths  
    const webFolderAbsolutePath = path.dirname(path.resolve(file)); 

    processState.webservers.push(app);

    // Redirect to index.html
    app.get('/', (req, res) => {
        res.redirect('/index.html'); 
    });

    // // Serve index.html
    // app.get(['/','/index.html'], (req, res, next) => {  
    
    //     // Define the pattern to match files  
    //     const pattern = "**/WebFolder/index.html"; // Adjust the pattern to match your needs  

    //     // Use glob.sync to get an array of matched file paths  
    //     const files = globSync(pattern);  

    //     // Convert the file paths to absolute paths  
    //     const absolutePaths = files.map(file => path.resolve(file));  

    //     let __dirname = path.resolve(path.dirname('../WebFolder'));

    //     const filePath = absolutePaths[0];  
    //     res.sendFile(filePath, (err) => {  
    //         if (err) {  
    //             console.error('Error sending file:', err);  
    //             res.status(404).send('File not found',filePath);  
    //             next();
    //         } else {  
    //             console.log('File sent successfully',filePath);  
    //         }  
    //     });  

    // });

    // Middleware to check if a file exists and serve it if present  
    app.use((req, res, next) => {

        // let __dirname = path.resolve(path.dirname('../WebFolder'));

        const filePath = path.join(webFolderAbsolutePath, req.path);  

        // Check if the file exists  
        fs.stat(filePath, (err, stats) => {  
            
            if (err) {  
                // File does not exist, move to the next middleware/route  
                return next();  
            }  

            if (stats.isFile()) {  
                console.log("Serving: ",filePath);   
                // File exists, serve it  
                return res.sendFile(filePath);  
            }  

            // Not a file, move to the next middleware/route  
            next();  

        });

    });  



    app.get('/', (req, res) => {

        // $1 : Text ; $2 : Text ; $3 : Text ; $4 : Text ; $5 : Text ; $6 : Text )
        // Parameters	Type		Description
        // $1	Text	<-	URL
        // $2	Text	<-	HTTP headers + HTTP body (up to 32 kb limit)
        // $3	Text	<-	IP address of the web client (browser)
        // $4	Text	<-	IP address of the server
        // $5	Text	<-	User name
        // $6	Text	<-	Password
        // $7	Text	<-	req
        // $8	Text	<-	res

        const clientIp = req.ip; // $3
        const serverIp = req.socket.remoteAddress; // $4

        delete processState.req;
        delete processState.res;
        processState.req = req;
        processState.res = res;

        On_Web_Connection_database_method( processState, req.url, req.headers, clientIp, serverIp, req.params.username, req.params.password, req, res);
    
    });

    // app.post('/', (req, res) => {

    //     // $1 : Text ; $2 : Text ; $3 : Text ; $4 : Text ; $5 : Text ; $6 : Text )
    //     // Parameters	Type		Description
    //     // $1	Text	<-	URL
    //     // $2	Text	<-	HTTP headers + HTTP body (up to 32 kb limit)
    //     // $3	Text	<-	IP address of the web client (browser)
    //     // $4	Text	<-	IP address of the server
    //     // $5	Text	<-	User name
    //     // $6	Text	<-	Password
    //     // $7	Text	<-	req
    //     // $8	Text	<-	res

        
    //     // const headerValue = req.headers['custom-header']; // Example header
    //     // const bodyData = req.body; // Parsed body data
    //     const clientIp = req.ip; // $3
    //     const serverIp = req.socket.remoteAddress; // $4

    //     // For WEB_SEND_TEXT should res.send() or res.json() the response 
    //     delete processState.req;
    //     delete processState.res;
    //     processState.req = req;
    //     processState.res = res;

    //     // FIX On_Web_Connection_database_method should 
    //     // - res.send() or 
    //     // - res.json() the response 
    //     // - res.sendFile(__dirname + '/index.html');
    //     On_Web_Connection_database_method( processState, req.url,req.headers,clientIp,serverIp,req.params.username,req.params.password,req, res);
        
    // });
    
    // app.use((err, req, res, next) => {
    //     console.error(err.stack);
    //     res.status(500).send('Internal Server Error');
    // });


    try {

        app.listen(port, () => {
            console.log(`Webserver listening on port ${ port }`);
        });
    
        processState.OK = true;  

    } catch (e) {

        processState.OK = false;
        console.error("Error starting webserver ", e);

    }
    

}
