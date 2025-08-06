// 4D command: Last errors
// Returns information about the last error that occurred in the current process
// Based on 4D v20 documentation: Returns information about the last error that occurred
// Last errors -> Object

export default function Last_errors(processState) {
    try {
        // Validate processState
        if (!processState) {
            throw new Error('processState is required');
        }

        // Initialize errorHandlingStats if not exists
        if (!processState.errorHandlingStats) {
            processState.errorHandlingStats = {
                errorHandler: null,
                totalErrors: 0,
                lastError: null,
                errorHistory: [],
                handlerChanges: []
            };
        }

        // Get the last error information
        const lastError = processState.errorHandlingStats.lastError;
        
        // If no error has occurred, return null
        if (!lastError) {
            return null;
        }

        // Log the last errors query
        if (!processState.logs) {
            processState.logs = [];
        }
        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: 'Last errors information retrieved',
            command: 'Last errors',
            errorCount: processState.errorHandlingStats.totalErrors
        });

        // Return the last error information in 4D format
        return {
            errorCode: lastError.errorCode || 0,
            errorMessage: lastError.errorMessage || '',
            errorMethod: lastError.errorMethod || '',
            errorLine: lastError.errorLine || 0,
            errorColumn: lastError.errorColumn || 0,
            errorTimestamp: lastError.timestamp || new Date().toISOString(),
            errorStack: lastError.stack || '',
            totalErrors: processState.errorHandlingStats.totalErrors
        };

    } catch (error) {
        // Log any errors
        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `Last errors command error: ${error.message}`,
                command: 'Last errors',
                error: error.stack
            });
        }
        
        throw new Error(`Last errors command failed: ${error.message}`);
    }
}
