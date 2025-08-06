// 4D command: Table
// Returns a pointer to a table or creates table reference
// Based on 4D v20 documentation: Returns a reference to a table by its name or number
// Table ( tableNum ) -> Function result
// Table ( tableName ) -> Function result
// Parameter		Type		Description
// tableNum		Longint		Table number
// tableName		String		Table name
// Function result	Pointer		Pointer to the table

export default function Table(processState, tableIdentifier) {
    if (!tableIdentifier) {
        console.warn('Table: Table identifier is required');
        return null;
    }
    
    let tableName;
    
    // Handle both table number and table name
    if (typeof tableIdentifier === 'number') {
        // Get table name by number from database schema
        if (processState.database && processState.database.schema && processState.database.schema.tables) {
            const tableList = Object.keys(processState.database.schema.tables);
            if (tableIdentifier > 0 && tableIdentifier <= tableList.length) {
                tableName = tableList[tableIdentifier - 1]; // 1-based indexing
            } else {
                console.warn(`Table: Invalid table number ${tableIdentifier}`);
                return null;
            }
        } else {
            console.warn('Table: No database schema available for table number lookup');
            return null;
        }
    } else if (typeof tableIdentifier === 'string') {
        tableName = tableIdentifier;
    } else {
        console.warn('Table: Invalid table identifier type');
        return null;
    }
    
    // Initialize database if not exists
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
            locked: false
        };
        
        // Add to schema if not exists
        if (!processState.database.schema.tables[tableName]) {
            processState.database.schema.tables[tableName] = {
                name: tableName,
                fields: {},
                primaryKey: 'id'
            };
        }
    }
    
    // Return a table reference object (similar to 4D's table pointer)
    const tableReference = {
        name: tableName,
        table: processState.database.tables[tableName],
        schema: processState.database.schema.tables[tableName],
        
        // Add methods for table operations
        recordCount: function() {
            return this.table.records.length;
        },
        
        selectionCount: function() {
            return this.table.selection.length;
        },
        
        getCurrentRecord: function() {
            if (this.table.currentRecord !== null && this.table.records[this.table.currentRecord]) {
                return this.table.records[this.table.currentRecord];
            }
            return null;
        }
    };
    
    return tableReference;
}
