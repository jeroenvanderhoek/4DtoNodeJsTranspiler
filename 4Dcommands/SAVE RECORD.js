// 4D command: SAVE RECORD
// Saves the current record to the database, making changes permanent
// Based on 4D v20 documentation: Commits current record modifications to persistent storage
// Essential for backend data persistence and transaction management
// SAVE RECORD {( aTable )}
// aTable    Table -> Target table for record saving (optional, uses default table if omitted)

export default function SAVE_RECORD(processState, aTable = null) {
    try {
        // Determine which table to use
        let tableName = aTable;
        
        // If no table specified, use the default table from processState
        if (!tableName) {
            if (processState.defaultTable) {
                tableName = processState.defaultTable;
            } else {
                console.warn('SAVE RECORD: No table specified and no default table set');
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
            console.warn(`SAVE RECORD: Table '${tableName}' does not exist`);
            return false;
        }
        
        const table = processState.database.tables[tableName];
        
        // Check if there's a current record to save
        if (!table.currentRecord) {
            console.warn('SAVE RECORD: No current record to save');
            return false;
        }
        
        // Initialize record statistics
        if (!processState.recordStats) {
            processState.recordStats = {
                totalCreated: 0,
                totalSaved: 0,
                pendingRecords: 0,
                lastSaved: null,
                recentOperations: []
            };
        }
        
        const currentRecord = table.currentRecord;
        let operationType = 'UPDATE';
        let recordIndex = -1;
        
        // Check if this is a new record or existing record
        if (currentRecord._isNew) {
            // New record - add to the main records array
            operationType = 'INSERT';
            
            // Remove from newRecords array if present
            const newRecordIndex = table.newRecords.findIndex(r => r._id === currentRecord._id);
            if (newRecordIndex >= 0) {
                table.newRecords.splice(newRecordIndex, 1);
            }
            
            // Add to main records array
            recordIndex = table.records.length;
            table.records.push(currentRecord);
            
            // Add to current selection
            if (!table.selection.includes(recordIndex)) {
                table.selection.push(recordIndex);
            }
            
            // Update database selection
            if (!processState.database.currentSelection) {
                processState.database.currentSelection = {};
            }
            processState.database.currentSelection[tableName] = table.selection;
            
            processState.recordStats.pendingRecords--;
        } else {
            // Existing record - find and update
            recordIndex = table.records.findIndex(r => r._id === currentRecord._id);
            if (recordIndex >= 0) {
                table.records[recordIndex] = { ...currentRecord };
            } else {
                console.warn(`SAVE RECORD: Record with ID ${currentRecord._id} not found in table`);
                return false;
            }
        }
        
        // Update record metadata
        currentRecord._isNew = false;
        currentRecord._modified = false;
        currentRecord._saved = new Date();
        currentRecord.updated_at = new Date();
        
        // Update statistics
        processState.recordStats.totalSaved++;
        processState.recordStats.lastSaved = new Date();
        
        processState.recordStats.recentOperations.push({
            timestamp: new Date(),
            operation: 'SAVE',
            type: operationType,
            table: tableName,
            recordId: currentRecord._id,
            recordIndex: recordIndex,
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
            operation: 'SAVE_RECORD',
            operationType: operationType,
            tableName: tableName,
            recordId: currentRecord._id,
            recordIndex: recordIndex,
            details: `Record ${operationType.toLowerCase()}d successfully`
        });
        
        // Limit record history
        if (processState.database.recordHistory.length > 200) {
            processState.database.recordHistory.shift();
        }
        
        // Trigger data persistence if configured
        if (processState.dataPersistence && processState.dataPersistence.autoSave) {
            try {
                // Here you could implement actual file/database persistence
                // For now, we'll just log the intention
                if (processState.logs) {
                    processState.logs.push({
                        timestamp: new Date().toISOString(),
                        level: 'INFO',
                        source: 'SAVE RECORD',
                        message: `Auto-save triggered for table '${tableName}'`,
                        data: {
                            tableName: tableName,
                            recordCount: table.records.length,
                            persistenceType: 'auto'
                        }
                    });
                }
            } catch (persistError) {
                console.warn('SAVE RECORD: Auto-save failed:', persistError);
            }
        }
        
        // Log the successful operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'SAVE RECORD',
                message: `Record ${operationType.toLowerCase()}d in table '${tableName}' with ID ${currentRecord._id}`,
                data: {
                    tableName: tableName,
                    recordId: currentRecord._id,
                    recordIndex: recordIndex,
                    operationType: operationType,
                    totalRecords: table.records.length,
                    totalSaved: processState.recordStats.totalSaved,
                    pendingRecords: processState.recordStats.pendingRecords
                }
            });
        }
        
        return true;
        
    } catch (error) {
        console.error('SAVE RECORD error:', error);
        
        if (processState.recordStats) {
            processState.recordStats.recentOperations.push({
                timestamp: new Date(),
                operation: 'SAVE',
                table: aTable,
                error: error.message,
                success: false
            });
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'SAVE RECORD',
                message: `Failed to save record: ${error.message}`,
                data: {
                    tableName: aTable,
                    error: error.message
                }
            });
        }
        
        return false;
    }
}
