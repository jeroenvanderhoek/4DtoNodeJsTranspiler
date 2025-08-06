// This 4D command is fixed and tested.
// 4D command: Min
// Returns the minimum of two values
// Essential for comparison operations

export default function(processState) {
    return function Min(value1, value2) {
        try {
            const result = Math.min(value1, value2);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Min',
                message: 'Minimum value determined',
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
                source: 'Min',
                message: `Error determining minimum: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};