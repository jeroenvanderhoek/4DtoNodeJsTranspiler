// 4D command: LAST RECORD
// Moves to the last record in the current selection and makes it the current record
// Based on 4D v20 documentation: Moves to the last record in the current selection
// LAST RECORD -> Boolean

export default function LAST_RECORD(processState, tableName) {
    try {
        // Validate inputs
        if (!processState) {
            throw new Error('LAST RECORD: processState is required');
        }
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('LAST RECORD: tableName must be a valid string');
        }

        // Initialize navigation statistics if not exists
        if (!processState.navigationStats) {
            processState.navigationStats = {
                totalNavigations: 0,
                lastRecordCalls: 0,
                lastNavigation: null,
                recentNavigations: []
            };
        }

        // Get table data
        const table = processState.database?.tables?.[tableName];
        if (!table) {
            throw new Error(`LAST RECORD: Table '${tableName}' not found in database`);
        }

        // Check if there's a current selection
        if (!table.currentSelection || table.currentSelection.length === 0) {
            // No records in selection
            const result = false;
            
            // Update statistics
            processState.navigationStats.lastRecordCalls++;
            processState.navigationStats.totalNavigations++;
            processState.navigationStats.lastNavigation = new Date();
            processState.navigationStats.recentNavigations.push({
                operation: 'LAST RECORD',
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
                operation: 'LAST RECORD',
                table: tableName,
                result: result,
                message: `LAST RECORD for table '${tableName}': ${result} (no records in selection)`
            });

            return result;
        }

        // Move to the last record in selection
        const selectionLength = table.currentSelection.length;
        const lastPosition = selectionLength - 1;
        table.currentSelectionPosition = lastPosition;

        // Load the last record
        const lastRecord = table.currentSelection[lastPosition];
        if (lastRecord) {
            table.currentRecord = JSON.parse(JSON.stringify(lastRecord)); // Deep copy
        }

        const result = true;

        // Update statistics
        processState.navigationStats.lastRecordCalls++;
        processState.navigationStats.totalNavigations++;
        processState.navigationStats.lastNavigation = new Date();
        processState.navigationStats.recentNavigations.push({
            operation: 'LAST RECORD',
            table: tableName,
            position: lastPosition,
            selectionLength: selectionLength,
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
            operation: 'LAST RECORD',
            table: tableName,
            position: lastPosition,
            selectionLength: selectionLength,
            result: result,
            message: `LAST RECORD for table '${tableName}' moved to position ${lastPosition}/${selectionLength}: ${result}`
        });

        return result;

    } catch (error) {
        // Log error
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'LAST RECORD',
            table: tableName,
            error: error.message,
            message: `LAST RECORD error: ${error.message}`
        });

        throw error;
    }
}
