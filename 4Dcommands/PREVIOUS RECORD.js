// 4D command: PREVIOUS RECORD
// Moves to the previous record in the current selection and makes it the current record
// Based on 4D v20 documentation: Moves to the previous record in the current selection
// PREVIOUS RECORD -> Boolean

export default function PREVIOUS_RECORD(processState, tableName) {
    try {
        // Validate inputs
        if (!processState) {
            throw new Error('PREVIOUS RECORD: processState is required');
        }
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('PREVIOUS RECORD: tableName must be a valid string');
        }

        // Initialize navigation statistics if not exists
        if (!processState.navigationStats) {
            processState.navigationStats = {
                totalNavigations: 0,
                previousRecordCalls: 0,
                lastNavigation: null,
                recentNavigations: []
            };
        }

        // Get table data
        const table = processState.database?.tables?.[tableName];
        if (!table) {
            throw new Error(`PREVIOUS RECORD: Table '${tableName}' not found in database`);
        }

        // Check if there's a current selection
        if (!table.currentSelection || table.currentSelection.length === 0) {
            // No records in selection
            const result = false;
            
            // Update statistics
            processState.navigationStats.previousRecordCalls++;
            processState.navigationStats.totalNavigations++;
            processState.navigationStats.lastNavigation = new Date();
            processState.navigationStats.recentNavigations.push({
                operation: 'PREVIOUS RECORD',
                table: tableName,
                result: result,
                timestamp: new Date()
            });

            // Keep only last 100 navigation operations
            if (processState.navigationStats.recentNavigations.length > 100) {
                processState.navigationStats.recentNavigations = 
                    processState.navigationStats.recentNavigations.slice(-100);
            }

            // Log operation
            processState.logs.push({
                timestamp: new Date().toISOString(),
                operation: 'PREVIOUS RECORD',
                table: tableName,
                result: result,
                message: `PREVIOUS RECORD for table '${tableName}': ${result} (no records in selection)`
            });

            return result;
        }

        // Get current position
        const currentPosition = table.currentSelectionPosition || 0;
        
        // Check if we're already at the beginning
        if (currentPosition <= 0) {
            const result = false;
            
            // Update statistics
            processState.navigationStats.previousRecordCalls++;
            processState.navigationStats.totalNavigations++;
            processState.navigationStats.lastNavigation = new Date();
            processState.navigationStats.recentNavigations.push({
                operation: 'PREVIOUS RECORD',
                table: tableName,
                position: currentPosition,
                result: result,
                timestamp: new Date()
            });

            // Keep only last 100 navigation operations
            if (processState.navigationStats.recentNavigations.length > 100) {
                processState.navigationStats.recentNavigations = 
                    processState.navigationStats.recentNavigations.slice(-100);
            }

            // Log operation
            processState.logs.push({
                timestamp: new Date().toISOString(),
                operation: 'PREVIOUS RECORD',
                table: tableName,
                position: currentPosition,
                result: result,
                message: `PREVIOUS RECORD for table '${tableName}' at position ${currentPosition}: ${result} (already at beginning)`
            });

            return result;
        }

        // Move to the previous record
        const previousPosition = currentPosition - 1;
        table.currentSelectionPosition = previousPosition;

        // Load the previous record
        const previousRecord = table.currentSelection[previousPosition];
        if (previousRecord) {
            table.currentRecord = JSON.parse(JSON.stringify(previousRecord)); // Deep copy
        }

        const result = true;

        // Update statistics
        processState.navigationStats.previousRecordCalls++;
        processState.navigationStats.totalNavigations++;
        processState.navigationStats.lastNavigation = new Date();
        processState.navigationStats.recentNavigations.push({
            operation: 'PREVIOUS RECORD',
            table: tableName,
            fromPosition: currentPosition,
            toPosition: previousPosition,
            result: result,
            timestamp: new Date()
        });

        // Keep only last 100 navigation operations
        if (processState.navigationStats.recentNavigations.length > 100) {
            processState.navigationStats.recentNavigations = 
                processState.navigationStats.recentNavigations.slice(-100);
        }

        // Log operation
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'PREVIOUS RECORD',
            table: tableName,
            fromPosition: currentPosition,
            toPosition: previousPosition,
            result: result,
            message: `PREVIOUS RECORD for table '${tableName}' moved from position ${currentPosition} to ${previousPosition}: ${result}`
        });

        return result;

    } catch (error) {
        // Log error
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'PREVIOUS RECORD',
            table: tableName,
            error: error.message,
            message: `PREVIOUS RECORD error: ${error.message}`
        });

        throw error;
    }
}
