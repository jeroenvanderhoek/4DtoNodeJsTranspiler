// 4D command: Records in table
// Returns the total number of records in the specified table
// Based on 4D v20 documentation: Returns the total number of records in the specified table
// Records in table(tableName) -> Longint

export default function Records_in_table(processState, tableName) {
    try {
        // Validate inputs
        if (!processState) {
            throw new Error('Records in table: processState is required');
        }
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('Records in table: tableName must be a valid string');
        }

        // Initialize table statistics if not exists
        if (!processState.tableStats) {
            processState.tableStats = {
                totalCounts: 0,
                lastCount: null,
                recentCounts: []
            };
        }

        // Get table data
        const table = processState.database?.tables?.[tableName];
        if (!table) {
            throw new Error(`Records in table: Table '${tableName}' not found in database`);
        }

        // Count all records in table
        const recordCount = table.records ? table.records.length : 0;

        // Update statistics
        processState.tableStats.totalCounts++;
        processState.tableStats.lastCount = new Date();
        processState.tableStats.recentCounts.push({
            table: tableName,
            recordCount: recordCount,
            timestamp: new Date()
        });

        // Keep only last 100 count operations
        if (processState.tableStats.recentCounts.length > 100) {
            processState.tableStats.recentCounts = 
                processState.tableStats.recentCounts.slice(-100);
        }

        // Log operation
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'Records in table',
            table: tableName,
            recordCount: recordCount,
            message: `Records in table '${tableName}': ${recordCount} total records`
        });

        return recordCount;

    } catch (error) {
        // Log error
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'Records in table',
            table: tableName,
            error: error.message,
            message: `Records in table error: ${error.message}`
        });

        throw error;
    }
}
