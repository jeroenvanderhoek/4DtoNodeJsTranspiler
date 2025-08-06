// 4D command: DELETE SELECTION
// Deletes the current selection of records from a table
// Based on 4D v19 documentation: Permanently removes all records in the current selection of a table
// DELETE SELECTION {( aTable )}
// Parameter		Type		Description
// aTable		Table		Table for which to delete the current selection (optional, uses default table if omitted)

export default function DELETE_SELECTION(processState, aTable = null) {
    // Determine which table to use
    let tableName = aTable;
    
    // If no table specified, use the default table from processState
    if (!tableName) {
        if (processState.defaultTable) {
            tableName = processState.defaultTable;
        } else {
            console.warn('DELETE SELECTION: No table specified and no default table set');
            return 0;
        }
    }
    
    // Initialize database state if not exists
    if (!processState.database) {
        processState.database = {
            tables: {},
            currentSelection: {},
            schema: { tables: {} },
            defaultTable: null
        };
    }
    
    // Initialize table if not exists
    if (!processState.database.tables[tableName]) {
        processState.database.tables[tableName] = {
            name: tableName,
            records: [],
            fields: {},
            currentRecord: null,
            selection: [],
            lockedRecords: new Set()
        };
    }
    
    const table = processState.database.tables[tableName];
    
    // Check if there's a current selection
    if (!table.selection || table.selection.length === 0) {
        console.log(`DELETE SELECTION: No records in current selection for table '${tableName}'`);
        return 0;
    }
    
    let deletedCount = 0;
    const lockedRecords = [];
    
    // Process each record in the selection
    const recordsToDelete = [...table.selection]; // Create a copy to avoid issues during deletion
    
    for (let i = 0; i < recordsToDelete.length; i++) {
        const recordIndex = recordsToDelete[i];
        
        // Check if record exists and is not locked
        if (recordIndex >= 0 && recordIndex < table.records.length) {
            const recordId = table.records[recordIndex]?.id;
            
            // Check if record is locked
            if (table.lockedRecords && table.lockedRecords.has(recordId)) {
                lockedRecords.push(recordIndex);
                console.warn(`DELETE SELECTION: Record ${recordId} is locked and cannot be deleted`);
                continue;
            }
            
            // Mark record as deleted (set to null to preserve indices)
            table.records[recordIndex] = null;
            deletedCount++;
        }
    }
    
    // Clean up records array by removing null entries and updating indices
    const remainingRecords = [];
    const indexMapping = new Map(); // Map old index to new index
    
    for (let i = 0; i < table.records.length; i++) {
        if (table.records[i] !== null) {
            indexMapping.set(i, remainingRecords.length);
            remainingRecords.push(table.records[i]);
        }
    }
    
    table.records = remainingRecords;
    
    // Update current record pointer
    if (table.currentRecord !== null) {
        const newIndex = indexMapping.get(table.currentRecord);
        table.currentRecord = newIndex !== undefined ? newIndex : null;
    }
    
    // Clear the current selection (as per 4D behavior)
    table.selection = [];
    
    // Update locked records set with new indices if any locked records remain
    if (lockedRecords.length > 0 && processState.database.lockedSet) {
        processState.database.lockedSet = [];
        lockedRecords.forEach(oldIndex => {
            const newIndex = indexMapping.get(oldIndex);
            if (newIndex !== undefined) {
                processState.database.lockedSet.push(newIndex);
            }
        });
    }
    
    // Log the operation
    if (processState.logEvents) {
        processState.logEvents.push({
            timestamp: new Date().toISOString(),
            type: 1, // Info level
            typeName: 'INFO',
            message: `DELETE SELECTION: Deleted ${deletedCount} records from table '${tableName}'. ${lockedRecords.length} records were locked and not deleted.`
        });
    }
    
    console.log(`DELETE SELECTION: Deleted ${deletedCount} records from table '${tableName}'. ${lockedRecords.length} records were locked and not deleted.`);
    
    return deletedCount;
}
