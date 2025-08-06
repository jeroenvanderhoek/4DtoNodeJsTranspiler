// 4D command: MODIFY RECORD
// Marks the current record as modified and prepares it for saving
// Based on 4D v20 documentation: Indicates that the current record has been modified and needs to be saved
// Essential for backend data update workflows and change tracking
// MODIFY RECORD {( aTable )}
// aTable    Table -> Target table for record modification (optional, uses current table if omitted)

export default function MODIFY_RECORD(processState, aTable = null) {
    try {
        if (!processState) {
            throw new Error('processState is required');
        }

        // Determine which table to use
        let tableName = aTable;
        
        // If no table specified, use the default table from processState
        if (!tableName) {
            if (processState.defaultTable) {
                tableName = processState.defaultTable;
            } else {
                throw new Error('MODIFY RECORD: No table specified and no default table set');
            }
        }

        // Initialize database state if not exists
        if (!processState.database) {
            processState.database = {
                tables: {},
                currentSelection: {},
                schema: { tables: {} },
                defaultTable: null,
                recordHistory: []
            };
        }

        // Check if table exists
        if (!processState.database.tables[tableName]) {
            throw new Error(`MODIFY RECORD: Table '${tableName}' does not exist`);
        }

        const table = processState.database.tables[tableName];

        // Check if there's a current record to modify
        if (!table.currentRecord) {
            throw new Error(`MODIFY RECORD: No current record in table '${tableName}' to modify`);
        }

        const recordToModify = table.currentRecord;
        const recordId = recordToModify._id;

        // Initialize modification statistics
        if (!processState.modifyStats) {
            processState.modifyStats = {
                totalModified: 0,
                totalFailed: 0,
                lastModified: null,
                recentOperations: [],
                modifiedRecords: []
            };
        }

        // Check if record is locked
        if (recordToModify._locked) {
            throw new Error(`MODIFY RECORD: Record ${recordId} is locked and cannot be modified`);
        }

        // Mark record as modified
        recordToModify._modified = true;
        recordToModify._modifiedAt = new Date();
        recordToModify._modifiedBy = processState.currentUser || 'system';

        // Update modification statistics
        processState.modifyStats.totalModified++;
        processState.modifyStats.lastModified = new Date();

        processState.modifyStats.recentOperations.push({
            timestamp: new Date(),
            operation: 'MODIFY',
            table: tableName,
            recordId: recordId,
            success: true
        });

        processState.modifyStats.modifiedRecords.push({
            timestamp: new Date(),
            tableName: tableName,
            recordId: recordId,
            modifiedBy: processState.currentUser || 'system',
            reason: 'MODIFY RECORD command'
        });

        // Limit recent operations history
        if (processState.modifyStats.recentOperations.length > 100) {
            processState.modifyStats.recentOperations.shift();
        }

        // Limit modified records history
        if (processState.modifyStats.modifiedRecords.length > 200) {
            processState.modifyStats.modifiedRecords.shift();
        }

        // Store in database record history
        if (!processState.database.recordHistory) {
            processState.database.recordHistory = [];
        }

        processState.database.recordHistory.push({
            timestamp: new Date(),
            operation: 'MODIFY_RECORD',
            tableName: tableName,
            recordId: recordId,
            details: 'Record marked as modified'
        });

        // Limit record history
        if (processState.database.recordHistory.length > 200) {
            processState.database.recordHistory.shift();
        }

        // Log the operation
        if (!processState.logs) {
            processState.logs = [];
        }

        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `Record ${recordId} marked as modified in table '${tableName}'`,
            command: 'MODIFY RECORD',
            tableName: tableName,
            recordId: recordId,
            totalModified: processState.modifyStats.totalModified
        });

        return true;

    } catch (error) {
        // Update failure statistics
        if (processState && processState.modifyStats) {
            processState.modifyStats.totalFailed++;
            processState.modifyStats.recentOperations.push({
                timestamp: new Date(),
                operation: 'MODIFY',
                table: aTable,
                recordId: null,
                success: false,
                error: error.message
            });
        }

        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `MODIFY RECORD command error: ${error.message}`,
                command: 'MODIFY RECORD',
                error: error.stack
            });
        }

        throw new Error(`MODIFY RECORD command failed: ${error.message}`);
    }
}
