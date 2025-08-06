// This 4D command is fixed and tested.
// 4D command: ALL RECORDS
// Selects all records in a table and makes them the current selection
// Based on 4D v20 documentation: Creates a selection containing all records of a table
// ALL RECORDS {( aTable )}
// Parameter		Type		Description
// aTable		Table		Table for which to select all records (optional, uses default table if omitted)

export default function ALL_RECORDS(processState, aTable = null) {
    // Determine which table to use
    let tableName = aTable;
    
    // If no table specified, use the default table from processState
    if (!tableName) {
        if (processState.defaultTable) {
            tableName = processState.defaultTable;
        } else {
            console.warn('ALL RECORDS: No table specified and no default table set');
            return;
        }
    }
    
    // Initialize database state if not exists
    if (!processState.database) {
        processState.database = {
            tables: {},
            currentSelection: {},
            defaultTable: null
        };
    }
    
    // Initialize table if not exists
    if (!processState.database.tables[tableName]) {
        processState.database.tables[tableName] = {
            records: [],
            currentRecord: null,
            selection: []
        };
    }
    
    const table = processState.database.tables[tableName];
    
    // Create selection containing all records
    const allRecordIds = table.records.map((record, index) => index);
    table.selection = [...allRecordIds];
    
    // Set current selection in database state
    processState.database.currentSelection[tableName] = table.selection;
    
    // Set the first record as current if selection is not empty
    if (table.selection.length > 0) {
        table.currentRecord = 0; // Index of first record in selection
    } else {
        table.currentRecord = null;
    }
    
    // Log the operation
    if (processState.logEvents) {
        processState.logEvents.push({
            timestamp: new Date().toISOString(),
            type: 1, // Info level
            typeName: 'INFO',
            message: `ALL RECORDS: Selected ${table.selection.length} records from table '${tableName}'`
        });
    }
    
    console.log(`ALL RECORDS: Selected ${table.selection.length} records from table '${tableName}'`);
    
    return table.selection.length;
}