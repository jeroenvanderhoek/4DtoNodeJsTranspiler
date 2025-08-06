// This 4D command is fixed and tested.
// 4D command: Choose
// Returns a value from a list based on an index
// Essential for conditional value selection in backend logic

export default function(processState) {
    return function Choose(index, ...values) {
        try {
            if (typeof index !== 'number') {
                throw new Error('Index must be a number');
            }
            
            // In 4D, Choose is 1-based indexing
            const zeroBasedIndex = index - 1;
            
            if (zeroBasedIndex < 0 || zeroBasedIndex >= values.length) {
                // Return empty/null for out of bounds
                processState.OK = 0;
                return '';
            }
            
            const result = values[zeroBasedIndex];
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Choose',
                message: 'Value chosen from list',
                data: { 
                    index, 
                    totalValues: values.length,
                    chosenValue: result 
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Choose',
                message: `Error choosing value: ${error.message}`,
                data: { error: error.message, index }
            });
            processState.OK = 0;
            return '';
        }
    };
};