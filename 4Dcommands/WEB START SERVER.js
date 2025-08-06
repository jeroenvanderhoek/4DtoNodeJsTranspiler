// 4D command: WEB START SERVER
// Starts the 4D web server to handle HTTP requests and serve web content
// Based on 4D v20 documentation: Launches the built-in web server with default or configured settings
// Essential for backend server functionality to serve web applications, REST APIs, and static content
// WEB START SERVER ( {* | port} )
// *       Operator  ->    Optional: If passed, use current settings without prompting
// port    Integer   ->    Optional: HTTP port number to use (default: 80)

import express from 'express';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

export default function WEB_START_SERVER(processState, portOrOptions) {
    try {
        // Check if web server is already running
        if (processState.webServer && processState.webServer.listening) {
            console.log('WEB START SERVER: Web server is already running');
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'WARN',
                    source: 'WEB START SERVER',
                    message: 'Web server is already running',
                    data: { 
                        port: processState.webServer.port,
                        status: 'already_running'
                    }
                });
            }
            return true;
        }

        // Initialize web server configuration from processState or defaults
        if (!processState.webServerOptions) {
            processState.webServerOptions = {
                httpPort: 80,
                httpsPort: 443,
                enableHttps: false,
                htmlRootFolder: path.join(process.cwd(), 'WebFolder'),
                maxConcurrentProcesses: 32,
                connectionTimeout: 15,
                serverCache: true,
                keepAlive: true,
                lastModified: new Date()
            };
        }

        // Determine port to use
        let port = processState.webServerOptions.httpPort;
        if (typeof portOrOptions === 'number') {
            port = portOrOptions;
            processState.webServerOptions.httpPort = port;
        }

        // Create Express application
        const app = express();
        
        // Configure middleware
        app.use(express.json({ limit: '32mb' }));
        app.use(express.urlencoded({ extended: true, limit: '32mb' }));
        
        // Trust proxy for correct IP addresses
        app.set('trust proxy', true);

        // Determine web root folder
        let webRootFolder = processState.webServerOptions.htmlRootFolder;
        
        // Try to find WebFolder if it doesn't exist at specified path
        if (!fs.existsSync(webRootFolder)) {
            const possiblePaths = [
                path.join(process.cwd(), 'input', 'WebFolder'),
                path.join(process.cwd(), 'WebFolder'),
                path.join(process.cwd(), 'www'),
                path.join(process.cwd(), 'public')
            ];
            
            for (const possiblePath of possiblePaths) {
                if (fs.existsSync(possiblePath)) {
                    webRootFolder = possiblePath;
                    processState.webServerOptions.htmlRootFolder = webRootFolder;
                    break;
                }
            }
        }

        // Create web root folder if it doesn't exist
        if (!fs.existsSync(webRootFolder)) {
            try {
                fs.mkdirSync(webRootFolder, { recursive: true });
                
                // Create default index.html
                const defaultIndex = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>4D Web Server</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        .logo { color: #0066cc; font-size: 48px; font-weight: bold; }
        .message { color: #666; font-size: 18px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">4D</div>
        <h1>Web Server is Running</h1>
        <p class="message">Your 4D web server is successfully running and ready to serve content.</p>
        <p>Port: ${port}</p>
        <p>Time: ${new Date().toISOString()}</p>
    </div>
</body>
</html>`;
                fs.writeFileSync(path.join(webRootFolder, 'index.html'), defaultIndex);
            } catch (error) {
                console.error(`WEB START SERVER: Could not create web root folder: ${error.message}`);
            }
        }

        // Static file middleware for serving files from web root
        app.use(express.static(webRootFolder, {
            etag: processState.webServerOptions.serverCache,
            lastModified: processState.webServerOptions.serverCache,
            maxAge: processState.webServerOptions.serverCache ? '1h' : 0
        }));

        // Custom file serving middleware for more control
        app.use((req, res, next) => {
            const filePath = path.join(webRootFolder, req.path);
            
            // Security check: prevent directory traversal
            if (!filePath.startsWith(webRootFolder)) {
                return res.status(403).send('Forbidden');
            }
            
            fs.stat(filePath, (err, stats) => {
                if (err || !stats.isFile()) {
                    return next(); // Let other routes handle it
                }
                
                // Set appropriate content type
                const contentType = mime.lookup(filePath) || 'application/octet-stream';
                res.setHeader('Content-Type', contentType);
                
                // Set cache headers if enabled
                if (processState.webServerOptions.serverCache) {
                    res.setHeader('Cache-Control', 'public, max-age=3600');
                    res.setHeader('ETag', `"${stats.mtime.getTime()}-${stats.size}"`);
                }
                
                res.sendFile(filePath);
            });
        });

        // 4DACTION handler for dynamic content
        app.all('/4DACTION/*', (req, res) => {
            // Extract method name and parameters from URL
            const urlParts = req.path.split('/');
            const methodName = urlParts[2];
            const param = urlParts[3] || '';
            
            // Set up processState for the request
            processState.req = req;
            processState.res = res;
            processState.currentWebRequest = {
                url: req.url,
                method: req.method,
                headers: req.headers,
                clientIP: req.ip,
                serverIP: req.socket.localAddress,
                timestamp: new Date().toISOString()
            };
            
            // Call the 4D method if it exists (placeholder for now)
            console.log(`WEB START SERVER: 4DACTION request for method: ${methodName}`);
            res.json({
                message: `4DACTION method ${methodName} called`,
                param: param,
                timestamp: new Date().toISOString()
            });
        });

        // Catch-all handler for On Web Connection
        app.all('*', (req, res) => {
            // Set up processState for the request
            processState.req = req;
            processState.res = res;
            processState.currentWebRequest = {
                url: req.url,
                method: req.method,
                headers: req.headers,
                clientIP: req.ip,
                serverIP: req.socket.localAddress,
                timestamp: new Date().toISOString()
            };
            
            // Call On Web Connection (placeholder for now)
            console.log(`WEB START SERVER: On Web Connection called for: ${req.url}`);
            
            // Default 404 response if nothing handled the request
            res.status(404).json({
                error: 'Not Found',
                message: `The requested URL ${req.url} was not found on this server`,
                timestamp: new Date().toISOString()
            });
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('WEB START SERVER: Express error:', err);
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'ERROR',
                    source: 'WEB START SERVER',
                    message: `Express error: ${err.message}`,
                    data: { 
                        error: err.message,
                        stack: err.stack,
                        url: req?.url
                    }
                });
            }
            
            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Internal Server Error',
                    message: 'An error occurred while processing your request',
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Start the server
        const server = app.listen(port, (err) => {
            if (err) {
                console.error(`WEB START SERVER: Failed to start server on port ${port}: ${err.message}`);
                if (processState.logs) {
                    processState.logs.push({
                        timestamp: new Date().toISOString(),
                        level: 'ERROR',
                        source: 'WEB START SERVER',
                        message: `Failed to start web server on port ${port}: ${err.message}`,
                        data: { 
                            port: port,
                            error: err.message
                        }
                    });
                }
                return;
            }
            
            console.log(`WEB START SERVER: Web server started successfully on port ${port}`);
            console.log(`WEB START SERVER: Web root folder: ${webRootFolder}`);
            
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'INFO',
                    source: 'WEB START SERVER',
                    message: `Web server started successfully on port ${port}`,
                    data: { 
                        port: port,
                        webRootFolder: webRootFolder,
                        httpsEnabled: processState.webServerOptions.enableHttps
                    }
                });
            }
        });

        // Store server reference in processState
        processState.webServer = server;
        processState.webServer.port = port;
        processState.webServer.webRootFolder = webRootFolder;
        // Don't set listening property - it's read-only on the server object
        processState.webServer.startTime = new Date();

        // Initialize web server statistics
        if (!processState.webServerStats) {
            processState.webServerStats = {
                startTime: new Date(),
                requestCount: 0,
                errorCount: 0,
                activeConnections: 0
            };
        }

        // Handle server events
        server.on('connection', (socket) => {
            processState.webServerStats.activeConnections++;
            socket.on('close', () => {
                processState.webServerStats.activeConnections--;
            });
        });

        server.on('request', (req, res) => {
            processState.webServerStats.requestCount++;
        });

        server.on('error', (error) => {
            processState.webServerStats.errorCount++;
            console.error(`WEB START SERVER: Server error: ${error.message}`);
        });

        return true;

    } catch (error) {
        console.error(`WEB START SERVER: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WEB START SERVER',
                message: `Error starting web server: ${error.message}`,
                data: { error: error.message, stack: error.stack }
            });
        }
        return false;
    }
}
