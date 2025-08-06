// This 4D command is fixed and tested.
// 4D command: Find in array
// Searches for a value in an array and returns its position
// Essential for array operations in backend processing

export default function(processState) {
    return function Find_in_array(array, value, startFrom = 0) {
        try {
            if (!Array.isArray(array)) {
                throw new Error('First parameter must be an array');
            }
            
            // In 4D, arrays are 1-based, but JavaScript arrays are 0-based
            // startFrom in 4D is 1-based, convert to 0-based
            const startIndex = Math.max(0, startFrom - 1);
            
            // Search for the value
            const index = array.indexOf(value, startIndex);
            
            // Convert back to 1-based index (0 means not found in 4D)
            const result = index === -1 ? 0 : index + 1;
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Find in array',
                message: 'Array search completed',
                data: { 
                    arrayLength: array.length,
                    searchValue: value,
                    startFrom,
                    foundAt: result
                }
            });
            
            processState.OK = result > 0 ? 1 : 0;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Find in array',
                message: `Error searching array: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};