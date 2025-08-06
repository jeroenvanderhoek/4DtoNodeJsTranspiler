// 4D command: Insert string
// Inserts a string into another string at a specified position
// Based on 4D v20 documentation: Performs string insertion with position-based placement
// Essential for backend text construction, data formatting, and content manipulation
// Insert string ( sourceString ; whatString ; wherePos ) -> Function result
// sourceString    Text      -> Source string to insert into
// whatString      Text      -> String to be inserted
// wherePos        Longint   -> Position where to insert (1-based)
// Function result Text      -> Resulting string with insertion

export default function Insert_string(processState, sourceString, whatString, wherePos) {
    try {
        // Validate inputs
        if (typeof sourceString !== 'string') {
            console.warn('Insert string: Source string must be a string');
            return '';
        }
        
        if (typeof whatString !== 'string') {
            console.warn('Insert string: Insert string must be a string');
            return sourceString;
        }
        
        if (typeof wherePos !== 'number' || wherePos < 1) {
            console.warn('Insert string: Position must be a positive number (1-based)');
            return sourceString;
        }
        
        // Initialize string operations statistics
        if (!processState.stringOperations) {
            processState.stringOperations = {
                totalInsertions: 0,
                totalOperations: 0,
                lastOperation: null,
                recentOperations: []
            };
        }
        
        // Convert to 0-based index for JavaScript
        const insertIndex = Math.min(wherePos - 1, sourceString.length);
        const adjustedIndex = Math.max(0, insertIndex);
        
        // Perform insertion
        const result = sourceString.substring(0, adjustedIndex) + 
                      whatString + 
                      sourceString.substring(adjustedIndex);
        
        // Update statistics
        processState.stringOperations.totalOperations++;
        processState.stringOperations.totalInsertions++;
        processState.stringOperations.lastOperation = new Date();
        
        processState.stringOperations.recentOperations.push({
            timestamp: new Date(),
            operation: 'INSERT',
            sourceLength: sourceString.length,
            resultLength: result.length,
            insertString: whatString.substring(0, 50), // Limit for logging
            position: wherePos,
            adjustedPosition: adjustedIndex,
            success: true
        });
        
        // Limit recent operations history
        if (processState.stringOperations.recentOperations.length > 100) {
            processState.stringOperations.recentOperations.shift();
        }
        
        // Log the operation for significant changes
        if (processState.logs && (whatString.length > 100 || sourceString.length > 1000)) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Insert string',
                message: `String insertion: ${whatString.length} characters inserted at position ${wherePos}`,
                data: {
                    sourceLength: sourceString.length,
                    resultLength: result.length,
                    insertLength: whatString.length,
                    position: wherePos,
                    totalOperations: processState.stringOperations.totalOperations
                }
            });
        }
        
        return result;
        
    } catch (error) {
        console.error('Insert string error:', error);
        
        if (processState.stringOperations) {
            processState.stringOperations.recentOperations.push({
                timestamp: new Date(),
                operation: 'INSERT',
                error: error.message,
                success: false
            });
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Insert string',
                message: `String insertion failed: ${error.message}`,
                data: {
                    sourceString: sourceString,
                    whatString: whatString,
                    wherePos: wherePos,
                    error: error.message
                }
            });
        }
        
        return sourceString;
    }
}
