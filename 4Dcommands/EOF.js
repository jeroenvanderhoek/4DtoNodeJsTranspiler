// 4D command: EOF
// Returns True if the current record is the last record in the current selection, False otherwise
// Based on 4D v20 documentation: Tests whether the current record is the last record in the current selection
// EOF -> Boolean

export default function EOF(processState, tableName) {
    try {
        // Validate inputs
        if (!processState) {
            throw new Error('EOF: processState is required');
        }
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('EOF: tableName must be a valid string');
        }

        // Initialize navigation statistics if not exists
        if (!processState.navigationStats) {
            processState.navigationStats = {
                totalNavigations: 0,
                eofChecks: 0,
                lastNavigation: null,
                recentNavigations: []
            };
        }

        // Get table data
        const table = processState.database?.tables?.[tableName];
        if (!table) {
            throw new Error(`EOF: Table '${tableName}' not found in database`);
        }

        // Check if there's a current selection
        if (!table.currentSelection || table.currentSelection.length === 0) {
            // No records in selection, so we're at EOF
            const result = true;
            
            // Update statistics
            processState.navigationStats.eofChecks++;
            processState.navigationStats.totalNavigations++;
            processState.navigationStats.lastNavigation = new Date();
            processState.navigationStats.recentNavigations.push({
                operation: 'EOF',
                table: tableName,
                result: result,
                timestamp: new Date()
            });

            // Keep only last 100 navigation operations
            if (processState.navigationStats.recentNavigations.length > 100) {
                processState.navigationStats.recentNavigations = 
                    processState.navigationStats.recentNavigations.slice(-100);
            }

            // Log operation
            processState.logs.push({
                timestamp: new Date().toISOString(),
                operation: 'EOF',
                table: tableName,
                result: result,
                message: `EOF check for table '${tableName}': ${result} (no records in selection)`
            });

            return result;
        }

        // Check if current position is at the end
        const currentPosition = table.currentSelectionPosition || 0;
        const selectionLength = table.currentSelection.length;
        const result = currentPosition >= selectionLength - 1;

        // Update statistics
        processState.navigationStats.eofChecks++;
        processState.navigationStats.totalNavigations++;
        processState.navigationStats.lastNavigation = new Date();
        processState.navigationStats.recentNavigations.push({
            operation: 'EOF',
            table: tableName,
            position: currentPosition,
            selectionLength: selectionLength,
            result: result,
            timestamp: new Date()
        });

        // Keep only last 100 navigation operations
        if (processState.navigationStats.recentNavigations.length > 100) {
            processState.navigationStats.recentNavigations = 
                processState.navigationStats.recentNavigations.slice(-100);
        }

        // Log operation
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'EOF',
            table: tableName,
            position: currentPosition,
            selectionLength: selectionLength,
            result: result,
            message: `EOF check for table '${tableName}' at position ${currentPosition}/${selectionLength}: ${result}`
        });

        return result;

    } catch (error) {
        // Log error
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'EOF',
            table: tableName,
            error: error.message,
            message: `EOF error: ${error.message}`
        });

        throw error;
    }
} 