// This 4D command is fixed and tested.
// 4D command: Max
// Returns the maximum of two values
// Essential for comparison operations

export default function(processState) {
    return function Max(value1, value2) {
        try {
            const result = Math.max(value1, value2);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Max',
                message: 'Maximum value determined',
                data: { 
                    value1,
                    value2,
                    result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Max',
                message: `Error determining maximum: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};