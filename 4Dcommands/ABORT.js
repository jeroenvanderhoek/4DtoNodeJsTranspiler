// This 4D command is fixed and tested.
// 4D command: ABORT
// Terminates the current process execution immediately
// Based on 4D v20 documentation: Terminates execution of the current process
// ABORT -> None

export default function ABORT(processState) {
    try {
        // Validate processState
        if (!processState) {
            throw new Error('processState is required');
        }

        // Initialize abortStats if not exists
        if (!processState.abortStats) {
            processState.abortStats = {
                totalAborts: 0,
                lastAbort: null,
                abortedProcesses: []
            };
        }

        // Update statistics
        processState.abortStats.totalAborts++;
        processState.abortStats.lastAbort = new Date().toISOString();
        
        // Add current process to aborted list
        const processInfo = {
            processId: processState.processId || 'unknown',
            abortedAt: new Date().toISOString(),
            reason: 'ABORT command called'
        };
        processState.abortStats.abortedProcesses.push(processInfo);

        // Log the abort event
        if (!processState.logs) {
            processState.logs = [];
        }
        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'WARN',
            message: 'ABORT command executed - terminating current process',
            command: 'ABORT',
            processId: processState.processId || 'unknown'
        });

        // In a real Node.js environment, this would terminate the process
        // For our simulation, we'll throw an error to simulate termination
        throw new Error('ABORT: Process terminated by ABORT command');

    } catch (error) {
        // If this is our abort error, re-throw it
        if (error.message === 'ABORT: Process terminated by ABORT command') {
            throw error;
        }

        // Log any other errors
        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `ABORT command error: ${error.message}`,
                command: 'ABORT',
                error: error.stack
            });
        }
        
        throw new Error(`ABORT command failed: ${error.message}`);
    }
}
