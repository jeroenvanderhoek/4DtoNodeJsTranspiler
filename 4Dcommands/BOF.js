// 4D command: BOF
// Returns True if the current record is the first record in the current selection, False otherwise
// Based on 4D v20 documentation: Tests whether the current record is the first record in the current selection
// BOF -> Boolean

export default function BOF(processState, tableName) {
    try {
        // Validate inputs
        if (!processState) {
            throw new Error('BOF: processState is required');
        }
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('BOF: tableName must be a valid string');
        }

        // Initialize navigation statistics if not exists
        if (!processState.navigationStats) {
            processState.navigationStats = {
                totalNavigations: 0,
                bofChecks: 0,
                lastNavigation: null,
                recentNavigations: []
            };
        }

        // Get table data
        const table = processState.database?.tables?.[tableName];
        if (!table) {
            throw new Error(`BOF: Table '${tableName}' not found in database`);
        }

        // Check if there's a current selection
        if (!table.currentSelection || table.currentSelection.length === 0) {
            // No records in selection, so we're at BOF
            const result = true;
            
            // Update statistics
            processState.navigationStats.bofChecks++;
            processState.navigationStats.totalNavigations++;
            processState.navigationStats.lastNavigation = new Date();
            processState.navigationStats.recentNavigations.push({
                operation: 'BOF',
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
                operation: 'BOF',
                table: tableName,
                result: result,
                message: `BOF check for table '${tableName}': ${result} (no records in selection)`
            });

            return result;
        }

        // Check if current position is at the beginning
        const currentPosition = table.currentSelectionPosition || 0;
        const result = currentPosition <= 0;

        // Update statistics
        processState.navigationStats.bofChecks++;
        processState.navigationStats.totalNavigations++;
        processState.navigationStats.lastNavigation = new Date();
        processState.navigationStats.recentNavigations.push({
            operation: 'BOF',
            table: tableName,
            position: currentPosition,
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
            operation: 'BOF',
            table: tableName,
            position: currentPosition,
            result: result,
            message: `BOF check for table '${tableName}' at position ${currentPosition}: ${result}`
        });

        return result;

    } catch (error) {
        // Log error
        processState.logs.push({
            timestamp: new Date().toISOString(),
            operation: 'BOF',
            table: tableName,
            error: error.message,
            message: `BOF error: ${error.message}`
        });

        throw error;
    }
} 