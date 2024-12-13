// $D command: WEB START SERVER
import On_Web_Connection_database_method from '../Sources/DatabaseMethods/onWebConnection.js';

import express from 'express';

export default function WEB_START_SERVER () {


    
    const webserver = express();
    const port = 80;

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

        const headerValue = req.headers['custom-header'];
        const bodyData = req.body;
        const clientIp = req.ip; // $3
        const serverIp = req.socket.remoteAddress; // $4

        // FIX WEB_SEND_TEXT should res.send() or res.json() the response 

        return On_Web_Connection_database_method( req.url,req.headers,clientIp,serverIp,req.params.username,req.params.password,req, res);
    
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

        const headerValue = req.headers['custom-header']; // Example header
        const bodyData = req.body; // Parsed body data
        const clientIp = req.ip; // $3
        const serverIp = req.socket.remoteAddress; // $4

        // FIX On_Web_Connection_database_method should 
        // - res.send() or 
        // - res.json() the response 
        // - res.sendFile(__dirname + '/index.html');
        return On_Web_Connection_database_method( req.url,req.headers,clientIp,serverIp,req.params.username,req.params.password,req, res);
        
    });
    
    webserver.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
    });


    let started = false;

    try {

        webserver.listen(port, () => {
            console.log(`Server listening on port ${ port }`);
        });
    
        started = 1;

    } catch (e) {
        console.error("Error starting webserver ", e);
    }
    
    // FIXME for $vb__webserverStarted:=(OK=1)
    return { 
        webserver: webserver, 
        OK: started 
    };
    
}


