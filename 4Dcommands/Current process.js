// 4D command: Current process
// Returns the unique ID number of the currently executing process
// Based on 4D v20 documentation: Returns the process number of the current process
// Current process -> Function result
// Function result		Longint		Current process ID number

export default function Current_process(processState) {
    // Check if process ID is available in processState
    if (processState.processId !== undefined && processState.processId !== null) {
        return processState.processId;
    }
    
    // Check if we have process manager info
    if (processState.processManager && processState.processManager.currentProcessId) {
        return processState.processManager.currentProcessId;
    }
    
    // Fallback: generate or use Node.js process ID
    if (processState.nodeProcessId === undefined) {
        // Use Node.js process ID as fallback
        processState.nodeProcessId = process.pid;
    }
    
    return processState.nodeProcessId;
}
