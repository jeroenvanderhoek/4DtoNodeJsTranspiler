// 4D command: TRACE
// Enables or disables debugging trace output for the current process
// Based on 4D v20 documentation: Enables or disables the trace mode for debugging
// TRACE(boolean) -> None

export default function TRACE(processState, enableTrace) {
    try {
        // Validate processState
        if (!processState) {
            throw new Error('processState is required');
        }

        // Validate enableTrace parameter
        if (typeof enableTrace !== 'boolean') {
            throw new Error('TRACE: enableTrace parameter must be a boolean');
        }

        // Initialize traceStats if not exists
        if (!processState.traceStats) {
            processState.traceStats = {
                enabled: false,
                totalTraces: 0,
                lastTraceToggle: null,
                traceHistory: []
            };
        }

        // Update trace state
        const previousState = processState.traceStats.enabled;
        processState.traceStats.enabled = enableTrace;
        processState.traceStats.lastTraceToggle = new Date().toISOString();
        processState.traceStats.totalTraces++;

        // Add to trace history
        processState.traceStats.traceHistory.push({
            timestamp: new Date().toISOString(),
            action: enableTrace ? 'ENABLED' : 'DISABLED',
            previousState: previousState
        });

        // Limit trace history to prevent memory growth
        if (processState.traceStats.traceHistory.length > 100) {
            processState.traceStats.traceHistory = processState.traceStats.traceHistory.slice(-100);
        }

        // Log the trace toggle
        if (!processState.logs) {
            processState.logs = [];
        }
        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `TRACE ${enableTrace ? 'ENABLED' : 'DISABLED'}`,
            command: 'TRACE',
            traceEnabled: enableTrace
        });

        // In a real implementation, this would configure console output
        if (enableTrace) {
            console.log('TRACE: Debug tracing enabled');
        } else {
            console.log('TRACE: Debug tracing disabled');
        }

    } catch (error) {
        // Log any errors
        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `TRACE command error: ${error.message}`,
                command: 'TRACE',
                error: error.stack
            });
        }
        
        throw new Error(`TRACE command failed: ${error.message}`);
    }
}
