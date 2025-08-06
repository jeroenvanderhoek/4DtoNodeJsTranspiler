// 4D command: Field
// Returns a reference to a field in a table for dynamic field access
// Based on 4D v20 documentation: Provides dynamic field referencing by table and field number
// Essential for backend dynamic data access, schema introspection, and generic operations
// Field ( tableNum ; fieldNum ) -> Function result
// tableNum        Longint -> Table number (1-based)
// fieldNum        Longint -> Field number within the table (1-based)
// Function result FieldRef -> Reference to the specified field

export default function Field(processState, tableNum, fieldNum) {
    try {
        // Validate inputs
        if (typeof tableNum !== 'number' || tableNum < 1) {
            console.warn('Field: Table number must be a positive integer');
            return null;
        }
        
        if (typeof fieldNum !== 'number' || fieldNum < 1) {
            console.warn('Field: Field number must be a positive integer');
            return null;
        }
        
        // Initialize field operations statistics
        if (!processState.fieldOperations) {
            processState.fieldOperations = {
                totalReferences: 0,
                validReferences: 0,
                invalidReferences: 0,
                lastReference: null,
                recentReferences: []
            };
        }
        
        // Initialize database schema if not exists
        if (!processState.database) {
            processState.database = {
                tables: {},
                schema: { tables: {} },
                defaultTable: null
            };
        }
        
        // Get table name from number (using a mapping or default naming)
        let tableName = `Table_${tableNum}`;
        
        // Check if we have a schema mapping for table numbers
        if (processState.database.schema && processState.database.schema.tableMapping) {
            tableName = processState.database.schema.tableMapping[tableNum] || tableName;
        }
        
        // Initialize table schema if not exists
        if (!processState.database.schema.tables[tableName]) {
            processState.database.schema.tables[tableName] = {
                tableNumber: tableNum,
                fields: {},
                fieldMapping: {}
            };
        }
        
        const tableSchema = processState.database.schema.tables[tableName];
        
        // Get field name from number (using a mapping or default naming)
        let fieldName = `Field_${fieldNum}`;
        
        // Check if we have a field mapping for this table
        if (tableSchema.fieldMapping && tableSchema.fieldMapping[fieldNum]) {
            fieldName = tableSchema.fieldMapping[fieldNum];
        } else {
            // Create default field mapping
            if (!tableSchema.fieldMapping) {
                tableSchema.fieldMapping = {};
            }
            tableSchema.fieldMapping[fieldNum] = fieldName;
        }
        
        // Create field reference object
        const fieldRef = {
            tableName: tableName,
            tableNumber: tableNum,
            fieldName: fieldName,
            fieldNumber: fieldNum,
            type: 'FieldReference',
            created: new Date(),
            
            // Helper methods for field operations
            getValue: function(record) {
                if (record && typeof record === 'object') {
                    return record[this.fieldName];
                }
                return null;
            },
            
            setValue: function(record, value) {
                if (record && typeof record === 'object') {
                    record[this.fieldName] = value;
                    record._modified = true;
                    record.updated_at = new Date();
                    return true;
                }
                return false;
            },
            
            exists: function(record) {
                if (record && typeof record === 'object') {
                    return this.fieldName in record;
                }
                return false;
            }
        };
        
        // Initialize field in schema if not exists
        if (!tableSchema.fields[fieldName]) {
            tableSchema.fields[fieldName] = {
                fieldNumber: fieldNum,
                name: fieldName,
                type: 'text', // Default type
                length: 255,
                indexed: false,
                required: false,
                created: new Date()
            };
        }
        
        // Update statistics
        processState.fieldOperations.totalReferences++;
        processState.fieldOperations.validReferences++;
        processState.fieldOperations.lastReference = new Date();
        
        processState.fieldOperations.recentReferences.push({
            timestamp: new Date(),
            operation: 'FIELD_REFERENCE',
            tableName: tableName,
            tableNumber: tableNum,
            fieldName: fieldName,
            fieldNumber: fieldNum,
            success: true
        });
        
        // Limit recent references history
        if (processState.fieldOperations.recentReferences.length > 100) {
            processState.fieldOperations.recentReferences.shift();
        }
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Field',
                message: `Field reference created: ${tableName}.${fieldName} (${tableNum}.${fieldNum})`,
                data: {
                    tableName: tableName,
                    tableNumber: tableNum,
                    fieldName: fieldName,
                    fieldNumber: fieldNum,
                    totalReferences: processState.fieldOperations.totalReferences
                }
            });
        }
        
        return fieldRef;
        
    } catch (error) {
        console.error('Field reference error:', error);
        
        if (processState.fieldOperations) {
            processState.fieldOperations.totalReferences++;
            processState.fieldOperations.invalidReferences++;
            
            processState.fieldOperations.recentReferences.push({
                timestamp: new Date(),
                operation: 'FIELD_REFERENCE',
                tableNumber: tableNum,
                fieldNumber: fieldNum,
                error: error.message,
                success: false
            });
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Field',
                message: `Field reference error: ${error.message}`,
                data: {
                    tableNumber: tableNum,
                    fieldNumber: fieldNum,
                    error: error.message
                }
            });
        }
        
        return null;
    }
}
