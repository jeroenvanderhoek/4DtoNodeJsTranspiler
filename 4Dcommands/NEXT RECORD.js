// 4D command: NEXT RECORD
// Moves to the next record in the current selection and loads it
// Based on 4D v20 documentation: Advances the record pointer to the next record in the selection
// Essential for backend record iteration, data processing loops, and selection traversal
// NEXT RECORD {( aTable )}
// aTable    Table -> Target table for navigation (optional, uses default table if omitted)

export default function NEXT_RECORD(processState, aTable = null) {
    try {
        // Determine which table to use
        let tableName = aTable;
        
        // If no table specified, use the default table from processState
        if (!tableName) {
            if (processState.defaultTable) {
                tableName = processState.defaultTable;
            } else {
                console.warn('NEXT RECORD: No table specified and no default table set');
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
            console.warn(`NEXT RECORD: Table '${tableName}' does not exist`);
            return false;
        }
        
        const table = processState.database.tables[tableName];
        
        // Check if there's a current selection
        if (!table.selection || table.selection.length === 0) {
            console.warn('NEXT RECORD: No current selection available');
            table.currentRecord = null;
            table.currentRecordIndex = -1;
            table.currentSelectionPosition = -1;
            return false;
        }
        
        // Initialize navigation statistics
        if (!processState.navigationStats) {
            processState.navigationStats = {
                totalNavigations: 0,
                nextRecordCalls: 0,
                lastNavigation: null,
                recentNavigations: []
            };
        }
        
        // Get current position in selection
        let currentSelectionPosition = table.currentSelectionPosition || 0;
        
        // Check if we can move to next record
        if (currentSelectionPosition >= table.selection.length - 1) {
            // Already at the last record or beyond
            table.currentRecord = null;
            table.currentRecordIndex = -1;
            table.currentSelectionPosition = table.selection.length; // EOF position
            
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'INFO',
                    source: 'NEXT RECORD',
                    message: `Reached end of selection in table '${tableName}'`,
                    data: {
                        tableName: tableName,
                        selectionSize: table.selection.length,
                        position: 'EOF'
                    }
                });
            }
            
            return false;
        }
        
        // Move to next position
        const nextSelectionPosition = currentSelectionPosition + 1;
        const nextRecordIndex = table.selection[nextSelectionPosition];
        
        if (nextRecordIndex < 0 || nextRecordIndex >= table.records.length) {
            console.warn(`NEXT RECORD: Invalid record index ${nextRecordIndex}`);
            return false;
        }
        
        // Load the next record
        const nextRecord = table.records[nextRecordIndex];
        
        if (!nextRecord) {
            console.warn(`NEXT RECORD: Record at index ${nextRecordIndex} does not exist`);
            return false;
        }
        
        // Create a copy to avoid reference issues
        const recordCopy = JSON.parse(JSON.stringify(nextRecord));
        recordCopy._loaded = new Date();
        recordCopy._isNew = false;
        recordCopy._modified = false;
        
        // Set record navigation state
        table.currentRecord = recordCopy;
        table.currentRecordIndex = nextRecordIndex;
        table.currentSelectionPosition = nextSelectionPosition;
        
        // Update statistics
        processState.navigationStats.totalNavigations++;
        processState.navigationStats.nextRecordCalls++;
        processState.navigationStats.lastNavigation = new Date();
        
        processState.navigationStats.recentNavigations.push({
            timestamp: new Date(),
            operation: 'NEXT_RECORD',
            table: tableName,
            recordId: recordCopy._id || nextRecordIndex,
            recordIndex: nextRecordIndex,
            selectionPosition: nextSelectionPosition,
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
            operation: 'NEXT_RECORD',
            tableName: tableName,
            recordId: recordCopy._id || nextRecordIndex,
            recordIndex: nextRecordIndex,
            details: `Moved to next record (position ${nextSelectionPosition}/${table.selection.length})`
        });
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'NEXT RECORD',
                message: `Moved to next record in table '${tableName}' (${nextSelectionPosition + 1}/${table.selection.length})`,
                data: {
                    tableName: tableName,
                    recordId: recordCopy._id || nextRecordIndex,
                    recordIndex: nextRecordIndex,
                    selectionPosition: nextSelectionPosition,
                    selectionSize: table.selection.length,
                    totalNavigations: processState.navigationStats.totalNavigations
                }
            });
        }
        
        return true;
        
    } catch (error) {
        console.error('NEXT RECORD error:', error);
        
        if (processState.navigationStats) {
            processState.navigationStats.recentNavigations.push({
                timestamp: new Date(),
                operation: 'NEXT_RECORD',
                table: aTable,
                error: error.message,
                success: false
            });
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'NEXT RECORD',
                message: `Failed to move to next record: ${error.message}`,
                data: {
                    tableName: aTable,
                    error: error.message
                }
            });
        }
        
        return false;
    }
}
