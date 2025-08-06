// 4D command: Records in selection
// Returns the number of records in the current selection
// Based on 4D v20 documentation: Returns the number of records in the current selection
// Records in selection -> Longint

export default function Records_in_selection(processState, tableName) {
    try {
        // Validate inputs
        if (!processState) {
            throw new Error('Records in selection: processState is required');
        }
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('Records in selection: tableName must be a valid string');
        }

        // Initialize selection statistics if not exists
        if (!processState.selectionStats) {
            processState.selectionStats = {
                totalCounts: 0,
                lastCount: null,
                recentCounts: []
            };
        }

        // Get table data
        const table = processState.database?.tables?.[tableName];
        if (!table) {
            throw new Error(`Records in selection: Table '${tableName}' not found in database`);
        }

        // Count records in current selection
        const recordCount = table.currentSelection ? table.currentSelection.length : 0;

        // Update statistics
        processState.selectionStats.totalCounts++;
        processState.selectionStats.lastCount = new Date();
        processState.selectionStats.recentCounts.push({
            table: tableName,
            recordCount: recordCount,
            timestamp: new Date()
        });

        // Keep only last 100 count operations
        if (processState.selectionStats.recentCounts.length > 100) {
            processState.selectionStats.recentCounts = 
                processState.selectionStats.recentCounts.slice(-100);
        }

        // Log operation
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'Records in selection',
            table: tableName,
            recordCount: recordCount,
            message: `Records in selection for table '${tableName}': ${recordCount} records`
        });

        return recordCount;

    } catch (error) {
        // Log error
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'Records in selection',
            table: tableName,
            error: error.message,
            message: `Records in selection error: ${error.message}`
        });

        throw error;
    }
}
