// 4D command: WEB Is server running
// Returns whether the web server is currently running
// Based on 4D v20 documentation: Tests if the web server is running and accepting connections
// WEB Is server running -> Function result
// Function result		Boolean		True if web server is running, False otherwise

export default function WEB_Is_server_running(processState) {
    // Check if we have a web server instance in processState
    if (processState.webServer && processState.webServer.server) {
        // Check if the server is listening
        const isListening = processState.webServer.server.listening;
        
        // Additional check - verify server is marked as running
        const isRunning = processState.webServer.isRunning === true;
        
        // Both conditions must be true
        const serverRunning = isListening && isRunning;
        
        // Log the check
        if (processState.logEvents) {
            processState.logEvents.push({
                timestamp: new Date().toISOString(),
                type: 1, // Info level
                typeName: 'INFO',
                message: `WEB Is server running: ${serverRunning ? 'Server is running' : 'Server is not running'}`
            });
        }
        
        return serverRunning;
    }
    
    // No web server instance found
    return false;
}
