// 4D command: ON ERR CALL
// Sets up a global error handler method to be called when errors occur
// Based on 4D v20 documentation: Installs an error handling method for the current process
// ON ERR CALL(methodName) -> None

export default function ON_ERR_CALL(processState, methodName) {
    try {
        // Validate processState
        if (!processState) {
            throw new Error('processState is required');
        }

        // Validate methodName parameter
        if (!methodName || typeof methodName !== 'string') {
            throw new Error('ON ERR CALL: methodName parameter must be a non-empty string');
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

        // Update error handler
        const previousHandler = processState.errorHandlingStats.errorHandler;
        processState.errorHandlingStats.errorHandler = methodName;
        processState.errorHandlingStats.lastError = null;

        // Add to handler changes history
        processState.errorHandlingStats.handlerChanges.push({
            timestamp: new Date().toISOString(),
            previousHandler: previousHandler,
            newHandler: methodName
        });

        // Limit handler changes history to prevent memory growth
        if (processState.errorHandlingStats.handlerChanges.length > 50) {
            processState.errorHandlingStats.handlerChanges = processState.errorHandlingStats.handlerChanges.slice(-50);
        }

        // Log the error handler setup
        if (!processState.logs) {
            processState.logs = [];
        }
        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `Error handler set to: ${methodName}`,
            command: 'ON ERR CALL',
            errorHandler: methodName,
            previousHandler: previousHandler
        });

        // In a real implementation, this would register the error handler
        console.log(`ON ERR CALL: Error handler registered: ${methodName}`);

    } catch (error) {
        // Log any errors
        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `ON ERR CALL command error: ${error.message}`,
                command: 'ON ERR CALL',
                error: error.stack
            });
        }
        
        throw new Error(`ON ERR CALL command failed: ${error.message}`);
    }
}
