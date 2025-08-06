// 4D command: QUIT 4D
// Exits the current 4D application and returns to the Desktop
// Based on 4D v20 documentation: Quits the 4D application with optional timeout for server
// QUIT 4D {( time )}
// Parameter		Type		Description
// time			Longint		Time in seconds before quitting (server only, optional)

export default function QUIT_4D(processState, time = 0) {
    console.log('QUIT 4D command initiated');
    
    // Log the quit event
    if (processState.logEvents) {
        processState.logEvents.push({
            timestamp: new Date().toISOString(),
            type: 2, // Warning level
            typeName: 'WARNING',
            message: `QUIT 4D command executed${time ? ` with ${time} seconds timeout` : ''}`
        });
    }
    
    // Execute any cleanup operations
    try {
        // Clean up any active processes
        if (processState.processManager && processState.processManager.processes) {
            processState.processManager.processes.forEach(proc => {
                if (!proc.terminated && !proc.aborted) {
                    console.log(`Cleaning up process ${proc.id} (${proc.name})`);
                    proc.terminated = true;
                    proc.terminatedAt = new Date().toISOString();
                    
                    // Clean up any worker threads or child processes
                    if (proc.worker) {
                        proc.worker.terminate();
                    }
                    if (proc.childProcess) {
                        proc.childProcess.kill('SIGTERM');
                    }
                }
            });
        }
        
        // Close any active web server
        if (processState.webServer && processState.webServer.server) {
            console.log('Closing web server...');
            processState.webServer.server.close();
        }
        
        // Clean up any active database connections
        if (processState.database && processState.database.close) {
            console.log('Closing database connections...');
            processState.database.close();
        }
        
        // In server mode, handle the timeout parameter
        if (time > 0) {
            console.log(`4D Server will quit in ${time} seconds...`);
            
            // In a real implementation, this would notify all connected clients
            // For now, we'll simulate the delay
            setTimeout(() => {
                console.log('4D Server timeout reached, initiating quit...');
                process.exit(0);
            }, time * 1000);
            
            return; // Don't quit immediately in server mode with timeout
        }
        
        // Immediate quit
        console.log('4D application is now quitting...');
        
        // In a backend server context, we'll set a flag instead of actually exiting
        // to allow graceful shutdown
        processState.shouldQuit = true;
        processState.quitTimestamp = new Date().toISOString();
        
        // In a real Node.js application, you might call process.exit(0)
        // but for a library/module, we'll let the calling application handle this
        
    } catch (error) {
        console.error('Error during QUIT 4D cleanup:', error.message);
        // Force quit on error
        processState.shouldQuit = true;
    }
}
