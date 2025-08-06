// 4D command: GOTO RECORD
// Moves to a specific record in the current selection by position number
// Based on 4D v20 documentation: Moves to the record at the specified position in the current selection
// GOTO RECORD(recordNumber) -> Boolean

export default function GOTO_RECORD(processState, tableName, recordNumber) {
    try {
        // Validate inputs
        if (!processState) {
            throw new Error('GOTO RECORD: processState is required');
        }
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('GOTO RECORD: tableName must be a valid string');
        }
        if (typeof recordNumber !== 'number' || recordNumber < 0) {
            throw new Error('GOTO RECORD: recordNumber must be a non-negative number');
        }

        // Initialize navigation statistics if not exists
        if (!processState.navigationStats) {
            processState.navigationStats = {
                totalNavigations: 0,
                gotoRecordCalls: 0,
                lastNavigation: null,
                recentNavigations: []
            };
        }

        // Get table data
        const table = processState.database?.tables?.[tableName];
        if (!table) {
            throw new Error(`GOTO RECORD: Table '${tableName}' not found in database`);
        }

        // Check if there's a current selection
        if (!table.currentSelection || table.currentSelection.length === 0) {
            // No records in selection
            const result = false;
            
            // Update statistics
            processState.navigationStats.gotoRecordCalls++;
            processState.navigationStats.totalNavigations++;
            processState.navigationStats.lastNavigation = new Date();
            processState.navigationStats.recentNavigations.push({
                operation: 'GOTO RECORD',
                table: tableName,
                targetPosition: recordNumber,
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
                operation: 'GOTO RECORD',
                table: tableName,
                targetPosition: recordNumber,
                result: result,
                message: `GOTO RECORD for table '${tableName}' to position ${recordNumber}: ${result} (no records in selection)`
            });

            return result;
        }

        // Check if target position is valid
        const selectionLength = table.currentSelection.length;
        if (recordNumber >= selectionLength) {
            const result = false;
            
            // Update statistics
            processState.navigationStats.gotoRecordCalls++;
            processState.navigationStats.totalNavigations++;
            processState.navigationStats.lastNavigation = new Date();
            processState.navigationStats.recentNavigations.push({
                operation: 'GOTO RECORD',
                table: tableName,
                targetPosition: recordNumber,
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
                operation: 'GOTO RECORD',
                table: tableName,
                targetPosition: recordNumber,
                selectionLength: selectionLength,
                result: result,
                message: `GOTO RECORD for table '${tableName}' to position ${recordNumber}: ${result} (position out of range)`
            });

            return result;
        }

        // Move to the target record
        table.currentSelectionPosition = recordNumber;

        // Load the target record
        const targetRecord = table.currentSelection[recordNumber];
        if (targetRecord) {
            table.currentRecord = JSON.parse(JSON.stringify(targetRecord)); // Deep copy
        }

        const result = true;

        // Update statistics
        processState.navigationStats.gotoRecordCalls++;
        processState.navigationStats.totalNavigations++;
        processState.navigationStats.lastNavigation = new Date();
        processState.navigationStats.recentNavigations.push({
            operation: 'GOTO RECORD',
            table: tableName,
            targetPosition: recordNumber,
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
            operation: 'GOTO RECORD',
            table: tableName,
            targetPosition: recordNumber,
            selectionLength: selectionLength,
            result: result,
            message: `GOTO RECORD for table '${tableName}' moved to position ${recordNumber}/${selectionLength}: ${result}`
        });

        return result;

    } catch (error) {
        // Log error
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'GOTO RECORD',
            table: tableName,
            targetPosition: recordNumber,
            error: error.message,
            message: `GOTO RECORD error: ${error.message}`
        });

        throw error;
    }
}
