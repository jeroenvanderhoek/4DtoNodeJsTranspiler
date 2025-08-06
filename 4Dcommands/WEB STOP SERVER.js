// 4D command: WEB STOP SERVER
// Stops the 4D web server
// Based on 4D v20 documentation: Stops the web server from serving HTTP requests
// WEB STOP SERVER
// No parameters
// This command stops the web server that was started with WEB START SERVER

export default function WEB_STOP_SERVER(processState) {
    // Check if there's a web server instance in processState
    if (processState.webServer && processState.webServer.server) {
        try {
            // Close all connections and stop the server
            processState.webServer.server.close(() => {
                console.log('4D Web Server stopped successfully');
            });
            
            // Mark server as stopped
            processState.webServer.isRunning = false;
            processState.webServer.stoppedAt = new Date().toISOString();
            
            // Log the event
            if (!processState.webServerEvents) {
                processState.webServerEvents = [];
            }
            
            processState.webServerEvents.push({
                type: 'stop',
                timestamp: new Date().toISOString(),
                message: 'Web server stopped via WEB STOP SERVER command'
            });
            
        } catch (error) {
            console.error('Error stopping web server:', error.message);
            
            // Log the error
            if (!processState.webServerEvents) {
                processState.webServerEvents = [];
            }
            
            processState.webServerEvents.push({
                type: 'error',
                timestamp: new Date().toISOString(),
                message: `Error stopping web server: ${error.message}`
            });
        }
    } else {
        console.warn('WEB STOP SERVER: No web server is currently running');
        
        // Log the warning
        if (!processState.webServerEvents) {
            processState.webServerEvents = [];
        }
        
        processState.webServerEvents.push({
            type: 'warning',
            timestamp: new Date().toISOString(),
            message: 'Attempted to stop web server but no server was running'
        });
    }
}
