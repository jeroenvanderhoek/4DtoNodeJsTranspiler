// 4D command: DELETE RECORD
// Deletes the current record from the database table
// Based on 4D v20 documentation: Removes the current record from the active table
// Essential for backend data management and record cleanup operations
// DELETE RECORD {( aTable )}
// aTable    Table -> Target table for record deletion (optional, uses current table if omitted)

import fs from 'fs';
import path from 'path';

export default function DELETE_RECORD(processState, aTable = null) {
    try {
        if (!processState) {
            throw new Error('processState is required');
        }

        // Determine which table to use
        let tableName = aTable;
        
        // If no table specified, use the default table from processState
        if (!tableName) {
            if (processState.defaultTable) {
                tableName = processState.defaultTable;
            } else {
                throw new Error('DELETE RECORD: No table specified and no default table set');
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
            throw new Error(`DELETE RECORD: Table '${tableName}' does not exist`);
        }

        const table = processState.database.tables[tableName];

        // Check if there's a current record to delete
        if (!table.currentRecord) {
            throw new Error(`DELETE RECORD: No current record in table '${tableName}' to delete`);
        }

        const recordToDelete = table.currentRecord;
        const recordId = recordToDelete._id;

        // Initialize delete statistics
        if (!processState.deleteStats) {
            processState.deleteStats = {
                totalDeleted: 0,
                totalFailed: 0,
                lastDeleted: null,
                recentOperations: [],
                deletedRecords: []
            };
        }

        // Check if record is locked or has dependencies
        if (recordToDelete._locked) {
            throw new Error(`DELETE RECORD: Record ${recordId} is locked and cannot be deleted`);
        }

        // Remove from main records array
        const recordIndex = table.records.findIndex(r => r._id === recordId);
        if (recordIndex !== -1) {
            table.records.splice(recordIndex, 1);
        }

        // Remove from new records if it was a pending record
        const newRecordIndex = table.newRecords.findIndex(r => r._id === recordId);
        if (newRecordIndex !== -1) {
            table.newRecords.splice(newRecordIndex, 1);
        }

        // Remove from selection if present
        const selectionIndex = table.selection.findIndex(r => r._id === recordId);
        if (selectionIndex !== -1) {
            table.selection.splice(selectionIndex, 1);
        }

        // Clear current record if it was the deleted one
        if (table.currentRecord && table.currentRecord._id === recordId) {
            table.currentRecord = null;
        }

        // Update statistics
        processState.deleteStats.totalDeleted++;
        processState.deleteStats.lastDeleted = new Date();

        processState.deleteStats.recentOperations.push({
            timestamp: new Date(),
            operation: 'DELETE',
            table: tableName,
            recordId: recordId,
            success: true
        });

        processState.deleteStats.deletedRecords.push({
            timestamp: new Date(),
            tableName: tableName,
            recordId: recordId,
            recordData: { ...recordToDelete },
            reason: 'DELETE RECORD command'
        });

        // Limit recent operations history
        if (processState.deleteStats.recentOperations.length > 100) {
            processState.deleteStats.recentOperations.shift();
        }

        // Limit deleted records history
        if (processState.deleteStats.deletedRecords.length > 200) {
            processState.deleteStats.deletedRecords.shift();
        }

        // Store in database record history
        if (!processState.database.recordHistory) {
            processState.database.recordHistory = [];
        }

        processState.database.recordHistory.push({
            timestamp: new Date(),
            operation: 'DELETE_RECORD',
            tableName: tableName,
            recordId: recordId,
            details: 'Record deleted from database'
        });

        // Limit record history
        if (processState.database.recordHistory.length > 200) {
            processState.database.recordHistory.shift();
        }

        // Log the operation
        if (!processState.logs) {
            processState.logs = [];
        }

        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `Record ${recordId} deleted from table '${tableName}'`,
            command: 'DELETE RECORD',
            tableName: tableName,
            recordId: recordId,
            totalDeleted: processState.deleteStats.totalDeleted
        });

        return true;

    } catch (error) {
        // Update failure statistics
        if (processState && processState.deleteStats) {
            processState.deleteStats.totalFailed++;
            processState.deleteStats.recentOperations.push({
                timestamp: new Date(),
                operation: 'DELETE',
                table: aTable,
                recordId: null,
                success: false,
                error: error.message
            });
        }

        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `DELETE RECORD command error: ${error.message}`,
                command: 'DELETE RECORD',
                error: error.stack
            });
        }

        throw new Error(`DELETE RECORD command failed: ${error.message}`);
    }
}
