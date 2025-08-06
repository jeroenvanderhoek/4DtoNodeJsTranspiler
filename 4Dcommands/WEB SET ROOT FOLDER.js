// 4D command: WEB SET ROOT FOLDER
// Sets the web server's HTML root folder path for serving static files
// Based on 4D v20 documentation: Configures the base directory for web content
// Essential for backend web server file serving and static content management
// WEB SET ROOT FOLDER ( htmlRootFolder )
// htmlRootFolder    Text    -> Path to the HTML root folder

import path from 'path';
import fs from 'fs';

export default function WEB_SET_ROOT_FOLDER(processState, htmlRootFolder) {
    try {
        // Validate input
        if (typeof htmlRootFolder !== 'string' || htmlRootFolder.trim() === '') {
            console.warn('WEB SET ROOT FOLDER: HTML root folder must be a non-empty string');
            return;
        }
        
        // Resolve the path to absolute
        const absolutePath = path.resolve(htmlRootFolder.trim());
        
        // Initialize web server options if not exists
        if (!processState.webServerOptions) {
            processState.webServerOptions = {
                httpPort: 80,
                httpsPort: 443,
                enableHttps: false,
                htmlRootFolder: './WebFolder',
                maxConcurrentProcesses: 32,
                connectionTimeout: 15,
                serverCache: true,
                keepAlive: true,
                lastModified: new Date()
            };
        }
        
        // Store the previous root folder
        const previousRootFolder = processState.webServerOptions.htmlRootFolder;
        
        // Check if the folder exists
        let folderExists = false;
        let folderStats = null;
        
        try {
            folderStats = fs.statSync(absolutePath);
            folderExists = folderStats.isDirectory();
        } catch (err) {
            folderExists = false;
        }
        
        // Set the new root folder
        processState.webServerOptions.htmlRootFolder = absolutePath;
        processState.webServerOptions.lastModified = new Date();
        
        // Initialize web server configuration history
        if (!processState.webServerConfigHistory) {
            processState.webServerConfigHistory = [];
        }
        
        // Record the configuration change
        processState.webServerConfigHistory.push({
            timestamp: new Date(),
            operation: 'SET_ROOT_FOLDER',
            previousValue: previousRootFolder,
            newValue: absolutePath,
            folderExists: folderExists,
            requestId: processState.webServerConfigHistory.length + 1
        });
        
        // Limit history to prevent memory growth
        if (processState.webServerConfigHistory.length > 50) {
            processState.webServerConfigHistory.shift();
        }
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: folderExists ? 'INFO' : 'WARN',
                source: 'WEB SET ROOT FOLDER',
                message: `HTML root folder changed from '${previousRootFolder}' to '${absolutePath}'${folderExists ? '' : ' (folder does not exist)'}`,
                data: {
                    previousFolder: previousRootFolder,
                    newFolder: absolutePath,
                    folderExists: folderExists,
                    isAbsolute: path.isAbsolute(absolutePath),
                    stats: folderStats ? {
                        size: folderStats.size,
                        created: folderStats.birthtime,
                        modified: folderStats.mtime
                    } : null
                }
            });
        }
        
        // Warn if folder doesn't exist
        if (!folderExists && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'WARN',
                source: 'WEB SET ROOT FOLDER',
                message: `HTML root folder does not exist: ${absolutePath}`,
                data: {
                    path: absolutePath,
                    suggestion: 'Create the folder or verify the path before starting the web server'
                }
            });
        }
        
        // If web server is running, log that it may need restart
        if (processState.webServer && processState.webServer.isRunning) {
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'INFO',
                    source: 'WEB SET ROOT FOLDER',
                    message: 'Web server is running - restart may be required for changes to take effect',
                    data: {
                        serverRunning: true,
                        newRootFolder: absolutePath
                    }
                });
            }
        }
        
    } catch (error) {
        console.error('WEB SET ROOT FOLDER error:', error);
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WEB SET ROOT FOLDER',
                message: `Error setting HTML root folder: ${error.message}`,
                data: {
                    htmlRootFolder: htmlRootFolder,
                    error: error.message
                }
            });
        }
    }
}
