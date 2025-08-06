// 4D command: FIRST RECORD
// Moves to the first record in the current selection and loads it
// Based on 4D v20 documentation: Sets the current record pointer to the first record in the selection
// Essential for backend record navigation, data processing loops, and selection iteration
// FIRST RECORD {( aTable )}
// aTable    Table -> Target table for navigation (optional, uses default table if omitted)

export default function FIRST_RECORD(processState, aTable = null) {
    try {
        // Determine which table to use
        let tableName = aTable;
        
        // If no table specified, use the default table from processState
        if (!tableName) {
            if (processState.defaultTable) {
                tableName = processState.defaultTable;
            } else {
                console.warn('FIRST RECORD: No table specified and no default table set');
                return false;
            }
        }
        
        // Initialize database state if not exists
        if (!processState.database) {
            processState.database = {
                tables: {},
                currentSelection: {},
                defaultTable: null,
                recordHistory: []
            };
        }
        
        // Check if table exists
        if (!processState.database.tables[tableName]) {
            console.warn(`FIRST RECORD: Table '${tableName}' does not exist`);
            return false;
        }
        
        const table = processState.database.tables[tableName];
        
        // Check if there's a current selection
        if (!table.selection || table.selection.length === 0) {
            console.warn('FIRST RECORD: No current selection available');
            table.currentRecord = null;
            table.currentRecordIndex = -1;
            table.currentSelectionPosition = -1;
            return false;
        }
        
        // Initialize navigation statistics
        if (!processState.navigationStats) {
            processState.navigationStats = {
                totalNavigations: 0,
                firstRecordCalls: 0,
                lastNavigation: null,
                recentNavigations: []
            };
        }
        
        // Get the first record from the selection
        const firstRecordIndex = table.selection[0];
        
        if (firstRecordIndex < 0 || firstRecordIndex >= table.records.length) {
            console.warn(`FIRST RECORD: Invalid record index ${firstRecordIndex}`);
            return false;
        }
        
        // Load the first record
        const firstRecord = table.records[firstRecordIndex];
        
        if (!firstRecord) {
            console.warn(`FIRST RECORD: Record at index ${firstRecordIndex} does not exist`);
            return false;
        }
        
        // Create a copy to avoid reference issues
        const recordCopy = JSON.parse(JSON.stringify(firstRecord));
        recordCopy._loaded = new Date();
        recordCopy._isNew = false;
        recordCopy._modified = false;
        
        // Set record navigation state
        table.currentRecord = recordCopy;
        table.currentRecordIndex = firstRecordIndex;
        table.currentSelectionPosition = 0; // First position in selection
        
        // Update statistics
        processState.navigationStats.totalNavigations++;
        processState.navigationStats.firstRecordCalls++;
        processState.navigationStats.lastNavigation = new Date();
        
        processState.navigationStats.recentNavigations.push({
            timestamp: new Date(),
            operation: 'FIRST_RECORD',
            table: tableName,
            recordId: recordCopy._id || firstRecordIndex,
            recordIndex: firstRecordIndex,
            selectionPosition: 0,
            selectionSize: table.selection.length,
            success: true
        });
        
        // Limit recent navigations history
        if (processState.navigationStats.recentNavigations.length > 100) {
            processState.navigationStats.recentNavigations.shift();
        }
        
        // Store in database record history
        if (!processState.database.recordHistory) {
            processState.database.recordHistory = [];
        }
        
        processState.database.recordHistory.push({
            timestamp: new Date(),
            operation: 'FIRST_RECORD',
            tableName: tableName,
            recordId: recordCopy._id || firstRecordIndex,
            recordIndex: firstRecordIndex,
            details: 'Moved to first record in selection'
        });
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'FIRST RECORD',
                message: `Moved to first record in table '${tableName}' (record ${firstRecordIndex})`,
                data: {
                    tableName: tableName,
                    recordId: recordCopy._id || firstRecordIndex,
                    recordIndex: firstRecordIndex,
                    selectionSize: table.selection.length,
                    totalNavigations: processState.navigationStats.totalNavigations
                }
            });
        }
        
        return true;
        
    } catch (error) {
        console.error('FIRST RECORD error:', error);
        
        if (processState.navigationStats) {
            processState.navigationStats.recentNavigations.push({
                timestamp: new Date(),
                operation: 'FIRST_RECORD',
                table: aTable,
                error: error.message,
                success: false
            });
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'FIRST RECORD',
                message: `Failed to move to first record: ${error.message}`,
                data: {
                    tableName: aTable,
                    error: error.message
                }
            });
        }
        
        return false;
    }
}
