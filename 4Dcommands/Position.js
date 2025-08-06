// This 4D command is fixed and tested.
// 4D command: Position
// Finds the position of a substring within a string
// Essential for string manipulation

export default function(processState) {
    return function Position(find, inString, start = 1) {
        try {
            if (typeof find !== 'string' || typeof inString !== 'string') {
                throw new Error('Both parameters must be strings');
            }
            
            // Convert 4D 1-based index to JavaScript 0-based
            const startIndex = Math.max(0, start - 1);
            
            // Find the position
            const index = inString.indexOf(find, startIndex);
            
            // Convert back to 1-based (0 means not found in 4D)
            const result = index === -1 ? 0 : index + 1;
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Position',
                message: 'Substring position found',
                data: { 
                    searchFor: find,
                    inStringLength: inString.length,
                    startFrom: start,
                    foundAt: result
                }
            });
            
            processState.OK = result > 0 ? 1 : 0;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Position',
                message: `Error finding position: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};