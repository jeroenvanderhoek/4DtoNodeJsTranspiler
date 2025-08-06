// 4D command: DELAY PROCESS
// Delays execution of a process for a specified duration
// Based on 4D v20 documentation: Delays the execution of a process for a number of ticks
// DELAY PROCESS ( processID ; duration )
// Parameter		Type		Description
// processID		Longint		Process ID of the process to delay
// duration		Real		Duration in ticks (1 tick = 1/60th of a second)

export default function DELAY_PROCESS(processState, processID, duration) {
    if (!processID || typeof processID !== 'number') {
        console.warn('DELAY PROCESS: Invalid process ID provided');
        return;
    }
    
    if (duration === undefined || duration === null) {
        console.warn('DELAY PROCESS: Duration parameter required');
        return;
    }
    
    // Convert ticks to milliseconds (1 tick = 1/60 second = ~16.67ms)
    const delayMs = Math.max(0, duration * (1000 / 60));
    
    // Check if we have access to process management in processState
    if (processState.processManager && processState.processManager.processes) {
        const targetProcess = processState.processManager.processes.find(p => p.id === processID);
        
        if (targetProcess) {
            try {
                // Clear any existing delay timeout
                if (targetProcess.delayTimeout) {
                    clearTimeout(targetProcess.delayTimeout);
                }
                
                // Set process as delayed
                targetProcess.delayed = true;
                targetProcess.delayStartTime = Date.now();
                targetProcess.delayDuration = delayMs;
                
                // If duration is 0, immediately undelay the process
                if (delayMs === 0) {
                    targetProcess.delayed = false;
                    targetProcess.delayTimeout = null;
                    console.log(`Process ${processID} delay cleared`);
                } else {
                    // Set timeout to undelay the process
                    targetProcess.delayTimeout = setTimeout(() => {
                        targetProcess.delayed = false;
                        targetProcess.delayTimeout = null;
                        console.log(`Process ${processID} delay completed after ${delayMs}ms`);
                    }, delayMs);
                    
                    console.log(`Process ${processID} delayed for ${duration} ticks (${delayMs}ms)`);
                }
                
                // Log the delay event
                if (processState.logEvents) {
                    processState.logEvents.push({
                        timestamp: new Date().toISOString(),
                        type: 1, // Info level
                        typeName: 'INFO',
                        message: `Process ${processID} delayed for ${duration} ticks (${delayMs}ms)`
                    });
                }
                
            } catch (error) {
                console.error(`Error delaying process ${processID}:`, error.message);
            }
        } else {
            console.warn(`DELAY PROCESS: Process ${processID} not found`);
        }
    } else {
        console.warn('DELAY PROCESS: No process manager available in current context');
    }
}
