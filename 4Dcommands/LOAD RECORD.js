// 4D command: LOAD RECORD
// Loads a specific record from the database into memory as the current record
// Based on 4D v20 documentation: Retrieves and sets a specific record as current
// Essential for backend record navigation and data retrieval operations
// LOAD RECORD {( aTable )}
// aTable    Table -> Target table for record loading (optional, uses default table if omitted)

export default function LOAD_RECORD(processState, aTable = null) {
    try {
        // Determine which table to use
        let tableName = aTable;
        
        // If no table specified, use the default table from processState
        if (!tableName) {
            if (processState.defaultTable) {
                tableName = processState.defaultTable;
            } else {
                console.warn('LOAD RECORD: No table specified and no default table set');
                return false;
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
            console.warn(`LOAD RECORD: Table '${tableName}' does not exist`);
            return false;
        }
        
        const table = processState.database.tables[tableName];
        
        // Check if there's a current selection
        if (!table.selection || table.selection.length === 0) {
            console.warn('LOAD RECORD: No current selection to load from');
            return false;
        }
        
        // Initialize record statistics
        if (!processState.recordStats) {
            processState.recordStats = {
                totalLoaded: 0,
                lastLoaded: null,
                recentOperations: []
            };
        }
        
        // Determine which record to load
        let recordIndex = -1;
        
        // If there's already a current record position, use it
        if (typeof table.currentRecord === 'number' && table.currentRecord >= 0) {
            recordIndex = table.selection[table.currentRecord];
        } else {
            // Load the first record in the selection
            recordIndex = table.selection[0];
            table.currentRecord = 0; // Set position in selection
        }
        
        // Validate record index
        if (recordIndex < 0 || recordIndex >= table.records.length) {
            console.warn(`LOAD RECORD: Invalid record index ${recordIndex}`);
            return false;
        }
        
        // Load the record
        const loadedRecord = table.records[recordIndex];
        
        if (!loadedRecord) {
            console.warn(`LOAD RECORD: Record at index ${recordIndex} does not exist`);
            return false;
        }
        
        // Create a copy to avoid reference issues
        const recordCopy = JSON.parse(JSON.stringify(loadedRecord));
        
        // Mark as loaded
        recordCopy._loaded = new Date();
        recordCopy._isNew = false;
        recordCopy._modified = false;
        
        // Set as current record
        table.currentRecord = recordCopy;
        table.currentRecordIndex = recordIndex;
        table.currentSelectionPosition = table.selection.indexOf(recordIndex);
        
        // Update statistics
        processState.recordStats.totalLoaded++;
        processState.recordStats.lastLoaded = new Date();
        
        processState.recordStats.recentOperations.push({
            timestamp: new Date(),
            operation: 'LOAD',
            table: tableName,
            recordId: recordCopy._id || recordIndex,
            recordIndex: recordIndex,
            selectionPosition: table.currentSelectionPosition,
            success: true
        });
        
        // Limit recent operations history
        if (processState.recordStats.recentOperations.length > 100) {
            processState.recordStats.recentOperations.shift();
        }
        
        // Store in database record history
        if (!processState.database.recordHistory) {
            processState.database.recordHistory = [];
        }
        
        processState.database.recordHistory.push({
            timestamp: new Date(),
            operation: 'LOAD_RECORD',
            tableName: tableName,
            recordId: recordCopy._id || recordIndex,
            recordIndex: recordIndex,
            details: 'Record loaded into memory as current record'
        });
        
        // Limit record history
        if (processState.database.recordHistory.length > 200) {
            processState.database.recordHistory.shift();
        }
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'LOAD RECORD',
                message: `Record loaded from table '${tableName}' at index ${recordIndex}`,
                data: {
                    tableName: tableName,
                    recordId: recordCopy._id || recordIndex,
                    recordIndex: recordIndex,
                    selectionSize: table.selection.length,
                    selectionPosition: table.currentSelectionPosition,
                    totalLoaded: processState.recordStats.totalLoaded
                }
            });
        }
        
        return true;
        
    } catch (error) {
        console.error('LOAD RECORD error:', error);
        
        if (processState.recordStats) {
            processState.recordStats.recentOperations.push({
                timestamp: new Date(),
                operation: 'LOAD',
                table: aTable,
                error: error.message,
                success: false
            });
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'LOAD RECORD',
                message: `Failed to load record: ${error.message}`,
                data: {
                    tableName: aTable,
                    error: error.message
                }
            });
        }
        
        return false;
    }
}
