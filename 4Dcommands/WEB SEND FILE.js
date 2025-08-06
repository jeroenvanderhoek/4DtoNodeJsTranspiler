// 4D command: WEB SEND FILE
// Sends an HTML page or web file to the browser from a specified path
// Based on 4D v20 documentation: Sends files to web clients with proper MIME type detection
// WEB SEND FILE ( htmlFile )
// Parameter		Type		Description
// htmlFile		Text		Path to the HTML file or web document to send

import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export default function WEB_SEND_FILE(processState, htmlFile) {
    // Validate input parameters
    if (!processState.res) {
        console.warn('WEB SEND FILE: No HTTP response context available');
        processState.OK = 0;
        return;
    }
    
    if (!htmlFile || typeof htmlFile !== 'string') {
        console.warn('WEB SEND FILE: Invalid file path provided');
        processState.OK = 0;
        return;
    }
    
    try {
        // Resolve the file path
        let filePath;
        
        // Check if it's an absolute path
        if (path.isAbsolute(htmlFile)) {
            filePath = htmlFile;
        } else {
            // Relative path - look in web folder or current directory
            const webFolder = processState.webFolder || process.cwd();
            filePath = path.join(webFolder, htmlFile);
        }
        
        // Resolve and normalize the path
        filePath = path.resolve(filePath);
        
        // Check if file exists and is accessible
        if (!fs.existsSync(filePath)) {
            console.warn(`WEB SEND FILE: File not found: ${filePath}`);
            processState.OK = 0;
            
            // Send 404 error
            if (processState.res && !processState.res.headersSent) {
                processState.res.status(404).send('File Not Found');
            }
            return;
        }
        
        // Get file stats
        const stats = fs.statSync(filePath);
        
        if (!stats.isFile()) {
            console.warn(`WEB SEND FILE: Path is not a file: ${filePath}`);
            processState.OK = 0;
            
            if (processState.res && !processState.res.headersSent) {
                processState.res.status(400).send('Bad Request');
            }
            return;
        }
        
        // Determine MIME type
        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
        
        // Set response headers
        processState.res.setHeader('Content-Type', mimeType);
        processState.res.setHeader('Content-Length', stats.size);
        processState.res.setHeader('Last-Modified', stats.mtime.toUTCString());
        
        // Add caching headers for static files
        const ext = path.extname(filePath).toLowerCase();
        if (['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2'].includes(ext)) {
            processState.res.setHeader('Cache-Control', 'public, max-age=3600');
        } else {
            processState.res.setHeader('Cache-Control', 'no-cache');
        }
        
        // Send the file using Express.js sendFile method
        processState.res.sendFile(filePath, (error) => {
            if (error) {
                console.error('WEB SEND FILE error:', error.message);
                processState.OK = 0;
                
                // Send error response if headers haven't been sent
                if (processState.res && !processState.res.headersSent) {
                    processState.res.status(500).send('Internal Server Error');
                }
            } else {
                processState.OK = 1;
                
                // Log successful file send
                if (processState.logEvents) {
                    processState.logEvents.push({
                        timestamp: new Date().toISOString(),
                        type: 1, // Info level
                        typeName: 'INFO',
                        message: `WEB SEND FILE: Sent file '${htmlFile}' (${stats.size} bytes, ${mimeType})`
                    });
                }
                
                console.log(`WEB SEND FILE: Sent file '${htmlFile}' (${stats.size} bytes, ${mimeType})`);
            }
        });
        
    } catch (error) {
        console.error('WEB SEND FILE error:', error.message);
        processState.OK = 0;
        
        // Send error response if headers haven't been sent
        if (processState.res && !processState.res.headersSent) {
            processState.res.status(500).send('Internal Server Error');
        }
    }
}