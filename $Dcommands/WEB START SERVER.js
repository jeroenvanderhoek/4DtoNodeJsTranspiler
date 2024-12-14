// $D command: WEB START SERVER
import On_Web_Connection_database_method from '../Sources/DatabaseMethods/onWebConnection.js';

import express from 'express';

export default function WEB_START_SERVER (processState) {
    
    const webserver = express();
    const port = 80;

    processState.webservers.push(webserver);

    webserver.get('/', (req, res) => {

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

        // For WEB_SEND_TEXT should res.send() or res.json() the response 
        delete processState.req;
        delete processState.res;
        processState.req = req;
        processState.res = res;

        On_Web_Connection_database_method( processState, req.url, req.headers, clientIp, serverIp, req.params.username, req.params.password, req, res);
    
    });

    webserver.post('/', (req, res) => {

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

        
        // const headerValue = req.headers['custom-header']; // Example header
        // const bodyData = req.body; // Parsed body data
        const clientIp = req.ip; // $3
        const serverIp = req.socket.remoteAddress; // $4

        // For WEB_SEND_TEXT should res.send() or res.json() the response 
        delete processState.req;
        delete processState.res;
        processState.req = req;
        processState.res = res;

        // FIX On_Web_Connection_database_method should 
        // - res.send() or 
        // - res.json() the response 
        // - res.sendFile(__dirname + '/index.html');
        On_Web_Connection_database_method( processState, req.url,req.headers,clientIp,serverIp,req.params.username,req.params.password,req, res);
        
    });
    
    webserver.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    });


    try {

        webserver.listen(port, () => {
            console.log(`Server listening on port ${ port }`);
        });
    
        processState.OK = true;  

    } catch (e) {

        processState.OK = false;
        console.error("Error starting webserver ", e);

    }
    

}
