// 4D command: QUERY
// Searches for records in a table based on specified criteria
// Based on 4D v20 documentation: Creates a selection of records matching search conditions
// Essential for backend data retrieval, filtering, and database operations
// QUERY ( {aTable ;} queryArgument {; ...} )
// aTable          Table     -> Table to query (optional, uses default table if omitted)
// queryArgument   Expression -> Search criteria and logical operators

export default function QUERY(processState, aTable = null, ...queryArguments) {
    try {
        // Determine which table to use
        let tableName = aTable;
        
        // If no table specified, use the default table from processState
        if (!tableName) {
            if (processState.defaultTable) {
                tableName = processState.defaultTable;
            } else {
                console.warn('QUERY: No table specified and no default table set');
                return [];
            }
        }
        
        // Initialize database state if not exists
        if (!processState.database) {
            processState.database = {
                tables: {},
                currentSelection: {},
                schema: { tables: {} },
                defaultTable: null,
                queryHistory: []
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
                nextId: 1
            };
        }
        
        const table = processState.database.tables[tableName];
        
        // Initialize query statistics
        if (!processState.queryStats) {
            processState.queryStats = {
                totalQueries: 0,
                lastQuery: null,
                recentQueries: []
            };
        }
        
        // If no query arguments, select all records
        if (!queryArguments || queryArguments.length === 0) {
            table.selection = table.records.map((record, index) => index);
            
            // Log the operation
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'INFO',
                    source: 'QUERY',
                    message: `Query with no criteria: Selected all ${table.selection.length} records from '${tableName}'`,
                    data: {
                        tableName: tableName,
                        recordCount: table.selection.length,
                        queryType: 'SELECT_ALL'
                    }
                });
            }
            
            return table.selection;
        }
        
        // Parse query arguments and build selection
        let resultIndices = [];
        
        // Simple implementation: support basic field = value queries
        for (let i = 0; i < queryArguments.length; i += 3) {
            const field = queryArguments[i];
            const operator = queryArguments[i + 1];
            const value = queryArguments[i + 2];
            
            if (!field || !operator) break;
            
            // Find matching records
            const matchingIndices = table.records
                .map((record, index) => ({ record, index }))
                .filter(({ record }) => {
                    const fieldValue = record[field];
                    
                    switch (operator) {
                        case '=':
                        case '==':
                            return fieldValue === value;
                        case '!=':
                        case '<>':
                            return fieldValue !== value;
                        case '>':
                            return fieldValue > value;
                        case '>=':
                            return fieldValue >= value;
                        case '<':
                            return fieldValue < value;
                        case '<=':
                            return fieldValue <= value;
                        case '@':
                        case 'contains':
                            return String(fieldValue).includes(String(value));
                        case 'begins':
                        case 'starts_with':
                            return String(fieldValue).startsWith(String(value));
                        case 'ends':
                        case 'ends_with':
                            return String(fieldValue).endsWith(String(value));
                        default:
                            console.warn(`QUERY: Unknown operator '${operator}'`);
                            return false;
                    }
                })
                .map(({ index }) => index);
            
            // For first condition, set results
            if (i === 0) {
                resultIndices = matchingIndices;
            } else {
                // For subsequent conditions, intersect results (AND logic)
                resultIndices = resultIndices.filter(index => matchingIndices.includes(index));
            }
        }
        
        // Update table selection
        table.selection = resultIndices;
        
        // Set current selection in database state
        if (!processState.database.currentSelection) {
            processState.database.currentSelection = {};
        }
        processState.database.currentSelection[tableName] = table.selection;
        
        // Set the first record as current if selection is not empty
        if (table.selection.length > 0) {
            table.currentRecord = 0; // Index of first record in selection
        } else {
            table.currentRecord = null;
        }
        
        // Update query statistics
        processState.queryStats.totalQueries++;
        processState.queryStats.lastQuery = new Date();
        processState.queryStats.recentQueries.push({
            timestamp: new Date(),
            tableName: tableName,
            argumentCount: queryArguments.length,
            resultCount: table.selection.length,
            query: queryArguments.slice(0, 6) // Store first 6 arguments for debugging
        });
        
        // Limit recent queries history
        if (processState.queryStats.recentQueries.length > 50) {
            processState.queryStats.recentQueries.shift();
        }
        
        // Store in database query history
        if (!processState.database.queryHistory) {
            processState.database.queryHistory = [];
        }
        
        processState.database.queryHistory.push({
            timestamp: new Date(),
            tableName: tableName,
            criteria: queryArguments,
            resultCount: table.selection.length
        });
        
        // Limit query history
        if (processState.database.queryHistory.length > 100) {
            processState.database.queryHistory.shift();
        }
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'QUERY',
                message: `Query executed: Found ${table.selection.length} records in '${tableName}'`,
                data: {
                    tableName: tableName,
                    resultCount: table.selection.length,
                    totalRecords: table.records.length,
                    argumentCount: queryArguments.length,
                    totalQueries: processState.queryStats.totalQueries
                }
            });
        }
        
        return table.selection;
        
    } catch (error) {
        console.error('QUERY error:', error);
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'QUERY',
                message: `Query failed: ${error.message}`,
                data: {
                    tableName: aTable,
                    arguments: queryArguments,
                    error: error.message
                }
            });
        }
        
        return [];
    }
}
