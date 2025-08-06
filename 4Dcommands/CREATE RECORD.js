// 4D command: CREATE RECORD
// Creates a new empty record in memory without adding it to the table selection
// Based on 4D v20 documentation: Initializes a new record structure for data entry
// Essential for backend data creation workflows and form-based record management
// CREATE RECORD {( aTable )}
// aTable    Table -> Target table for record creation (optional, uses default table if omitted)

export default function CREATE_RECORD(processState, aTable = null) {
    try {
        // Determine which table to use
        let tableName = aTable;
        
        // If no table specified, use the default table from processState
        if (!tableName) {
            if (processState.defaultTable) {
                tableName = processState.defaultTable;
            } else {
                console.warn('CREATE RECORD: No table specified and no default table set');
                return null;
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
        
        // Initialize table if not exists
        if (!processState.database.tables[tableName]) {
            processState.database.tables[tableName] = {
                name: tableName,
                records: [],
                fields: {},
                currentRecord: null,
                selection: [],
                nextId: 1,
                newRecords: [] // Track records created but not yet saved
            };
        }
        
        const table = processState.database.tables[tableName];
        
        // Initialize record creation statistics
        if (!processState.recordStats) {
            processState.recordStats = {
                totalCreated: 0,
                totalSaved: 0,
                pendingRecords: 0,
                lastCreated: null,
                recentOperations: []
            };
        }
        
        // Get table schema for field initialization
        let tableSchema = {};
        if (processState.database.schema && processState.database.schema.tables[tableName]) {
            tableSchema = processState.database.schema.tables[tableName];
        }
        
        // Create new record with default values
        const newRecord = {
            _id: table.nextId++, // Internal ID
            _isNew: true, // Mark as new record
            _modified: false, // Track if modified
            _created: new Date(), // Creation timestamp
            _table: tableName // Reference to parent table
        };
        
        // Initialize fields with default values based on schema
        if (tableSchema.fields) {
            Object.entries(tableSchema.fields).forEach(([fieldName, fieldConfig]) => {
                switch (fieldConfig.type) {
                    case 'text':
                    case 'string':
                        newRecord[fieldName] = fieldConfig.default || '';
                        break;
                    case 'number':
                    case 'integer':
                        newRecord[fieldName] = fieldConfig.default || 0;
                        break;
                    case 'boolean':
                        newRecord[fieldName] = fieldConfig.default || false;
                        break;
                    case 'date':
                        newRecord[fieldName] = fieldConfig.default || null;
                        break;
                    case 'object':
                        newRecord[fieldName] = fieldConfig.default || {};
                        break;
                    default:
                        newRecord[fieldName] = fieldConfig.default || null;
                }
            });
        } else {
            // If no schema, initialize with common default fields
            newRecord.name = '';
            newRecord.description = '';
            newRecord.created_at = new Date();
            newRecord.updated_at = new Date();
        }
        
        // Add to new records tracking (not yet in main records array)
        table.newRecords.push(newRecord);
        
        // Set as current record
        table.currentRecord = newRecord;
        
        // Update statistics
        processState.recordStats.totalCreated++;
        processState.recordStats.pendingRecords++;
        processState.recordStats.lastCreated = new Date();
        
        processState.recordStats.recentOperations.push({
            timestamp: new Date(),
            operation: 'CREATE',
            table: tableName,
            recordId: newRecord._id,
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
            operation: 'CREATE_RECORD',
            tableName: tableName,
            recordId: newRecord._id,
            details: 'New record created in memory'
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
                source: 'CREATE RECORD',
                message: `New record created in table '${tableName}' with ID ${newRecord._id}`,
                data: {
                    tableName: tableName,
                    recordId: newRecord._id,
                    fieldsInitialized: Object.keys(newRecord).filter(k => !k.startsWith('_')).length,
                    totalCreated: processState.recordStats.totalCreated,
                    pendingRecords: processState.recordStats.pendingRecords
                }
            });
        }
        
        return newRecord;
        
    } catch (error) {
        console.error('CREATE RECORD error:', error);
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'CREATE RECORD',
                message: `Failed to create record: ${error.message}`,
                data: {
                    tableName: aTable,
                    error: error.message
                }
            });
        }
        
        return null;
    }
}
