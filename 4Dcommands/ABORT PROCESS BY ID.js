// This 4D command is fixed and tested.
// 4D command: ABORT PROCESS BY ID
// Terminates a process specified by its unique process ID
// Based on 4D v20 documentation: Aborts execution of the process designated by processID
// ABORT PROCESS BY ID ( processID )
// Parameter		Type		Description
// processID		Longint		Process ID of the process to abort

export default function ABORT_PROCESS_BY_ID(processState, processID) {
    if (!processID || typeof processID !== 'number') {
        console.warn('ABORT PROCESS BY ID: Invalid process ID provided');
        return;
    }
    
    // Check if we have access to process management in processState
    if (processState.processManager && processState.processManager.processes) {
        const targetProcess = processState.processManager.processes.find(p => p.id === processID);
        
        if (targetProcess) {
            try {
                // Mark process as aborted
                targetProcess.aborted = true;
                targetProcess.abortedAt = new Date().toISOString();
                
                // If it's a worker thread or child process, terminate it
                if (targetProcess.worker) {
                    targetProcess.worker.terminate();
                } else if (targetProcess.childProcess) {
                    targetProcess.childProcess.kill('SIGTERM');
                }
                
                console.log(`Process ${processID} has been aborted`);
                
                // Log the abort event
                if (processState.logEvents) {
                    processState.logEvents.push({
                        timestamp: new Date().toISOString(),
                        type: 2, // Warning level
                        typeName: 'WARNING',
                        message: `Process ${processID} aborted by ABORT PROCESS BY ID`
                    });
                }
                
            } catch (error) {
                console.error(`Error aborting process ${processID}:`, error.message);
            }
        } else {
            console.warn(`ABORT PROCESS BY ID: Process ${processID} not found`);
        }
    } else {
        console.warn('ABORT PROCESS BY ID: No process manager available in current context');
    }
}